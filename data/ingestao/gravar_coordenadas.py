import time

from sqlalchemy.dialects.postgresql import insert as pg_insert

from database.db import SessionLocal
from models.models import MunicipioCoordenada
from external_apis.ibge_api import buscar_municipios
from external_apis.openmeteo_api import buscar_coordenadas


# Caixa geográfica aproximada do Ceará (latitude/longitude mínima e máxima)
CE_LAT_MIN, CE_LAT_MAX = -7.9, -2.8
CE_LON_MIN, CE_LON_MAX = -41.4, -37.0


def verificar_coordenadas_suspeitas(dados):
    """
    Confere se as coordenadas encontradas caem dentro da área aproximada do
    Ceará. Município fora dessa faixa é sinal de que a geocodificação pode
    ter pego o lugar errado.
    """
    suspeitos = []

    for item in dados:
        lat = item["latitude"]
        lon = item["longitude"]

        if lat is None or lon is None:
            continue  # já tratado separadamente como "não encontrado"

        dentro_da_faixa = (CE_LAT_MIN <= lat <= CE_LAT_MAX) and (CE_LON_MIN <= lon <= CE_LON_MAX)

        if not dentro_da_faixa:
            suspeitos.append(item)

    return suspeitos


def montar_dados_coordenadas(estado_codigo, uf, pausa_segundos=0.3):
    """
    Para cada município do estado, busca a coordenada na Open-Meteo.
    Monta uma lista de dicionários prontos para gravar no banco.
    """
    municipios = buscar_municipios(estado_codigo)
    dados = []
    nao_encontrados = []

    for municipio in municipios:
        coordenadas = buscar_coordenadas(municipio["nome"], uf=uf)

        if coordenadas is None:
            nao_encontrados.append(municipio["nome"])
            latitude = None
            longitude = None
        else:
            latitude = coordenadas["latitude"]
            longitude = coordenadas["longitude"]

        dados.append({
            "municipio_codigo": municipio["codigo"],
            "nome": municipio["nome"],
            "latitude": latitude,
            "longitude": longitude,
        })

        print(f"{municipio['nome']}: {latitude}, {longitude}")
        time.sleep(pausa_segundos)  # pausa entre chamadas, para não sobrecarregar a API

    return dados, nao_encontrados


def gravar_coordenadas(dados):
    """
    Grava a lista de coordenadas no banco de uma vez (em lote).
    Se o município já existir (mesmo municipio_codigo), ignora.
    """
    db = SessionLocal()

    stmt = pg_insert(MunicipioCoordenada).values(dados)
    stmt = stmt.on_conflict_do_nothing(index_elements=["municipio_codigo"])

    resultado = db.execute(stmt)
    db.commit()
    db.close()

    print(f"\nLinhas efetivamente inseridas: {resultado.rowcount}")
    print(f"Linhas ignoradas (já existiam): {len(dados) - resultado.rowcount}")


if __name__ == "__main__":
    dados, nao_encontrados = montar_dados_coordenadas(estado_codigo=23, uf="CE")

    print(f"\nTotal de municípios processados: {len(dados)}")
    print(f"Municípios sem coordenada encontrada: {len(nao_encontrados)}")
    if nao_encontrados:
        print(nao_encontrados)

    suspeitos = verificar_coordenadas_suspeitas(dados)
    print(f"\nMunicípios com coordenada fora da área esperada do Ceará: {len(suspeitos)}")
    if suspeitos:
        for item in suspeitos:
            print(f"  {item['nome']} ({item['municipio_codigo']}): {item['latitude']}, {item['longitude']}")

    gravar_coordenadas(dados)