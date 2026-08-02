import requests

BASE_URL = "https://servicodados.ibge.gov.br/api/v3/agregados"
LOCALIDADES_URL = "https://servicodados.ibge.gov.br/api/v1/localidades"

# As 5 variáveis "reais" do agregado 1612 (área plantada, colhida, quantidade,rendimento, valor)
VARIAVEIS = "109,216,214,112,215"

# Códigos dos produtos que o projeto usa (classificação 81)
PRODUTOS = {
    "milho": 2711,
    "feijao": 2702,
    "mandioca": 2708,
    "arroz": 2692,
}

def buscar_producao_bruta(agregado, estado_codigo, anos, produtos_codigos):
    """
    Busca dados brutos de produção agrícola de TODOS os municípios de um
    estado, para uma lista de anos.

    agregado: 1612 (lavouras temporárias) ou 1613 (lavouras permanentes)
    estado_codigo: código IBGE do estado (ex: 23 = Ceará)
    anos: lista de anos da pesquisa (ex: [2015, 2016, ..., 2022])
    produtos_codigos: lista de códigos de produto (classificação 81), ex: [2711, 2702]
    """
    codigos_str = ",".join(str(c) for c in produtos_codigos)
    periodos_str = "|".join(str(a) for a in anos)

    url = (
        f"{BASE_URL}/{agregado}/periodos/{periodos_str}"
        f"/variaveis/{VARIAVEIS}?localidades=N6[N3[{estado_codigo}]]&classificacao=81[{codigos_str}]"
    )

    resposta = requests.get(url)
    resposta.raise_for_status()

    return resposta.json()


def buscar_municipios(estado_codigo):
    """
    Busca a lista de municípios de um estado, com nome e código IBGE.

    estado_codigo: código IBGE do estado (ex: 23 = Ceará)
    Retorna uma lista de dicionários: [{"codigo": 2306405, "nome": "Itapipoca"}, ...]
    """
    url = f"{LOCALIDADES_URL}/estados/{estado_codigo}/municipios"

    resposta = requests.get(url)
    resposta.raise_for_status()
    dados = resposta.json()

    return [{"codigo": item["id"], "nome": item["nome"]} for item in dados]


if __name__ == "__main__":
    # Teste: buscar a lista de municípios do Ceará
    municipios = buscar_municipios(estado_codigo=23)

    print(f"Total de municípios: {len(municipios)}")
    print("\n--- Primeiros 5 ---")
    for m in municipios[:5]:
        print(m)