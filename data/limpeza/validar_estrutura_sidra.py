import pandas as pd

COLUNAS_ESPERADAS = [
    "municipio_codigo",
    "ano",
    "produto",
    "area_plantada_ha",
    "area_colhida_ha",
    "quantidade_produzida_ton",
    "rendimento_medio_kg_ha",
    "valor_producao_mil_reais",
]


def validar_estrutura_sidra(df):
    """
    Card 3 - Confere se o DataFrame que veio da tabela producao_agricola
    (já tabulado por tratar_producao na ingestão) tem a estrutura esperada
    antes de seguir para os próximos passos de limpeza.
    """
    erros = []

    for coluna in COLUNAS_ESPERADAS:
        if coluna not in df.columns:
            erros.append(f"Coluna ausente: {coluna}")

    if len(df) == 0:
        erros.append("DataFrame vazio")

    return erros


if __name__ == "__main__":
    df_completo = pd.DataFrame([{
        "municipio_codigo": 2300101,
        "ano": 2020,
        "produto": "milho",
        "area_plantada_ha": 150,
        "area_colhida_ha": 140,
        "quantidade_produzida_ton": 300,
        "rendimento_medio_kg_ha": 2100,
        "valor_producao_mil_reais": 900,
    }])

    df_incompleto = pd.DataFrame([{
        "municipio_codigo": 2300101,
        "ano": 2020,
        "produto": "feijao",
        # faltam propositalmente as colunas de área e produção, pra testar a validação
    }])

    print("--- Card 3: validar_estrutura_sidra (DataFrame completo) ---")
    erros_completo = validar_estrutura_sidra(df_completo)
    print(f"erros encontrados: {erros_completo if erros_completo else 'nenhum'}")

    print("\n--- Card 3: validar_estrutura_sidra (DataFrame incompleto) ---")
    erros_incompleto = validar_estrutura_sidra(df_incompleto)
    print(f"erros encontrados: {erros_incompleto}")

    print("\n--- Card 3: validar_estrutura_sidra (DataFrame vazio) ---")
    erros_vazio = validar_estrutura_sidra(pd.DataFrame())
    print(f"erros encontrados: {erros_vazio}")