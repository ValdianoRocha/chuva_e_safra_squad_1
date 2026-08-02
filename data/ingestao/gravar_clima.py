import time

from sqlalchemy.dialects.postgresql import insert as pg_insert

from database.db import SessionLocal
from models.models import MunicipioCoordenada, ClimaDiario
from external_apis.openmeteo_api import buscar_clima_bruto
from ingestao.tratar_clima import tratar_clima


def buscar_municipios_com_coordenada():
    """Lê do banco todos os municípios que já têm latitude/longitude preenchidas."""
    db = SessionLocal()
    municipios = (
        db.query(MunicipioCoordenada)
        .filter(MunicipioCoordenada.latitude.is_not(None))
        .all()
    )
    db.close()
    return municipios


def gravar_linhas(linhas):
    """Grava um lote de linhas de clima no banco, ignorando duplicatas."""
    if not linhas:
        return 0

    db = SessionLocal()
    stmt = pg_insert(ClimaDiario).values(linhas)
    stmt = stmt.on_conflict_do_nothing(constraint="uq_municipio_data")
    resultado = db.execute(stmt)
    db.commit()
    db.close()
    return resultado.rowcount


if __name__ == "__main__":
    data_inicio = "2015-01-01"
    data_fim = "2022-12-31"

    municipios = buscar_municipios_com_coordenada()
    print(f"Municípios a processar: {len(municipios)}\n")

    total_inseridas = 0
    total_geradas = 0
    falhas = []

    for municipio in municipios:
        try:
            dados_brutos = buscar_clima_bruto(
                latitude=municipio.latitude,
                longitude=municipio.longitude,
                data_inicio=data_inicio,
                data_fim=data_fim,
            )
            linhas = tratar_clima(dados_brutos, municipio_codigo=municipio.municipio_codigo)

            inseridas = gravar_linhas(linhas)

            total_geradas += len(linhas)
            total_inseridas += inseridas

            print(f"{municipio.nome}: {len(linhas)} dias buscados, {inseridas} novos gravados")

        except Exception as erro:
            falhas.append(municipio.nome)
            print(f"{municipio.nome}: FALHOU - {erro}")

        time.sleep(0.2)  # pausa entre chamadas, para não sobrecarregar a API

    print(f"\nTotal de linhas geradas: {total_geradas}")
    print(f"Total efetivamente inseridas: {total_inseridas}")
    print(f"Municípios com falha: {len(falhas)}")
    if falhas:
        print(falhas)