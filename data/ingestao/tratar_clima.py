from datetime import datetime

from external_apis.openmeteo_api import buscar_coordenadas, buscar_clima_bruto


def tratar_clima(dados_brutos, municipio_codigo):
    """
    Transforma o JSON bruto da Open-Meteo (com listas paralelas de datas e
    valores) em uma lista de dicionários, um por dia, prontos para virar
    linhas no banco.
    """
    datas = dados_brutos["daily"]["time"]
    chuvas = dados_brutos["daily"]["precipitation_sum"]
    temperaturas = dados_brutos["daily"]["temperature_2m_max"]

    linhas = []

    # zip junta as três listas, andando em paralelo, posição a posição
    for data_str, chuva, temperatura in zip(datas, chuvas, temperaturas):
        linhas.append({
            "municipio_codigo": municipio_codigo,
            "data": datetime.strptime(data_str, "%Y-%m-%d").date(),
            "precipitacao_mm": chuva,  # já vem numérico ou None, não precisa limpar
            "temperatura_max_c": temperatura,
        })

    return linhas


if __name__ == "__main__":
    coordenadas = buscar_coordenadas("Itapipoca")

    dados_brutos = buscar_clima_bruto(
        latitude=coordenadas["latitude"],
        longitude=coordenadas["longitude"],
        data_inicio="2022-01-01",
        data_fim="2022-01-31",
    )

    linhas = tratar_clima(dados_brutos, municipio_codigo=2306405)

    print(f"Total de linhas geradas: {len(linhas)}")
    print("\n--- Primeiras 5 ---")
    for linha in linhas[:5]:
        print(linha)