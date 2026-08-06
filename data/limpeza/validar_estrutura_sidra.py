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