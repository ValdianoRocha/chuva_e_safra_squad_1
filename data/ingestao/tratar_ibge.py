from external_apis.ibge_api import buscar_producao_bruta, PRODUTOS

def _limpar_valor(valor_bruto):
    """
    Converte valores "sem dado" do IBGE (ex: '-', '...') para None.
    Quando o valor é válido, converte de string para número.
    """
    if valor_bruto in ("-", "...", "X"):
        return None
    return float(valor_bruto)


def tratar_producao(dados_brutos):
    """
    Transforma o JSON bruto do IBGE (com vários municípios e vários anos) em
    uma lista de dicionários, um por município/produto/ano, prontos para
    virar linhas no banco.
    """
    # Mapeia nome da variável -> nome do campo que queremos no dicionário final
    mapa_variaveis = {
        "Área plantada": "area_plantada_ha",
        "Área colhida": "area_colhida_ha",
        "Quantidade produzida": "quantidade_produzida_ton",
        "Rendimento médio da produção": "rendimento_medio_kg_ha",
        "Valor da produção": "valor_producao_mil_reais",
    }

    # Mapeia código do produto (ex: 2711) -> nome amigável (ex: "milho")
    codigo_para_nome = {codigo: nome for nome, codigo in PRODUTOS.items()}

    # Guarda um dicionário de resultado por (município, produto, ano)
    resultados = {}

    for bloco in dados_brutos:
        nome_variavel = bloco["variavel"]
        campo = mapa_variaveis.get(nome_variavel)

        if campo is None:
            continue  # ignora variável que não está no nosso mapa

        for resultado in bloco["resultados"]:
            categoria = resultado["classificacoes"][0]["categoria"]
            codigo_produto = int(list(categoria.keys())[0])

            if codigo_produto not in codigo_para_nome:
                continue  # ignora produto que não pedimos

            nome_produto = codigo_para_nome[codigo_produto]

            for serie in resultado["series"]:
                municipio_codigo = int(serie["localidade"]["id"])
                serie_por_ano = serie["serie"]  # ex: {"2015": "...", "2016": "..."}

                for ano_str, valor_bruto in serie_por_ano.items():
                    ano = int(ano_str)
                    chave = (municipio_codigo, nome_produto, ano)

                    if chave not in resultados:
                        resultados[chave] = {
                            "municipio_codigo": municipio_codigo,
                            "ano": ano,
                            "produto": nome_produto,
                        }

                    resultados[chave][campo] = _limpar_valor(valor_bruto)

    return list(resultados.values())


if __name__ == "__main__":
    dados_brutos = buscar_producao_bruta(
        agregado=1612,
        estado_codigo=23,  # Ceará
        anos=[2022],
        produtos_codigos=list(PRODUTOS.values()),
    )

    dados_tratados = tratar_producao(dados_brutos)

    print(f"Total de linhas geradas: {len(dados_tratados)}")
    print("\n--- Primeiras 5 linhas ---")
    for item in dados_tratados[:5]:
        print(item)