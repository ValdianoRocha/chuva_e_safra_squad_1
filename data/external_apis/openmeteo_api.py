import requests

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"

def _tentar_buscar(nome_busca, uf_nome):
    """Faz uma requisição à API e retorna o primeiro resultado que bate com a UF, ou None."""
    params = {
        "name": nome_busca,
        "count": 100,  # máximo permitido pela API - aumenta a chance de achar cidades pequenas
    }

    resposta = requests.get(GEOCODING_URL, params=params)
    resposta.raise_for_status()
    dados = resposta.json()

    resultados = dados.get("results")
    if not resultados:
        return None

    for resultado in resultados:
        if resultado.get("admin1") == uf_nome and resultado.get("country_code") == "BR":
            return {
                "latitude": resultado["latitude"],
                "longitude": resultado["longitude"],
            }

    return None


def buscar_coordenadas(nome_municipio, uf="CE"):
    """
    Busca latitude e longitude de um município usando a Open-Meteo Geocoding.

    nome_municipio: nome do município (ex: "Amontada")
    Retorna um dicionário {"latitude": ..., "longitude": ...} ou None se não achou.
    """
    nomes_uf = {"CE": "Ceará"}
    uf_nome = nomes_uf.get(uf, uf)

    # Primeira tentativa: busca só pelo nome do município
    resultado = _tentar_buscar(nome_municipio, uf_nome)
    if resultado:
        return resultado

    # Plano B: acrescenta o nome do estado na busca, ajuda a desambiguar
    resultado = _tentar_buscar(f"{nome_municipio}, {uf_nome}", uf_nome)
    return resultado


def buscar_clima_bruto(latitude, longitude, data_inicio, data_fim):
    """
    Busca o histórico diário de chuva e temperatura máxima para uma
    coordenada, num intervalo de datas.

    latitude, longitude: coordenadas do município
    data_inicio, data_fim: strings no formato "AAAA-MM-DD"

    Retorna o JSON bruto da API (duas listas paralelas: datas e valores).
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": data_inicio,
        "end_date": data_fim,
        "daily": "precipitation_sum,temperature_2m_max",
        "timezone": "America/Fortaleza",
    }

    resposta = requests.get(ARCHIVE_URL, params=params)
    resposta.raise_for_status()

    return resposta.json()


if __name__ == "__main__":
    coordenadas = buscar_coordenadas("Itapipoca")
    print("Itapipoca:", coordenadas)

    # Caso que estava falhando: cidade pequena com nome comum em outros países
    coordenadas_aurora = buscar_coordenadas("Aurora")
    print("Aurora:", coordenadas_aurora)

    # Teste de caso "não achou" - nome que não existe
    coordenadas_invalidas = buscar_coordenadas("MunicipioQueNaoExiste123")
    print("Inexistente:", coordenadas_invalidas)

    # Teste do histórico climático - só um mês, pra manter a resposta pequena
    print("\n--- Clima de Itapipoca (jan/2022) ---")
    clima = buscar_clima_bruto(
        latitude=coordenadas["latitude"],
        longitude=coordenadas["longitude"],
        data_inicio="2022-01-01",
        data_fim="2022-01-31",
    )
    print(clima)