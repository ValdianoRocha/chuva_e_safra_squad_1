import pandas as pd


def padronizar_tipos(df):
    """
    Card 4 - Converte cada coluna para o tipo correto:
      municipio_codigo -> string (mantém zeros à esquerda)
      ano               -> inteiro
      demais colunas numéricas -> numérico (float, aceita NaN)
    """
    df = df.copy()

    if "municipio_codigo" in df.columns:
        # passa primeiro por Int64 (nullable) antes de virar string, senão
        # uma coluna com algum valor nulo misturado vira float e o código
        # sai errado (ex: "2300101.0" em vez de "2300101")
        codigo_numerico = pd.to_numeric(df["municipio_codigo"], errors="coerce").astype("Int64")
        df["municipio_codigo"] = codigo_numerico.astype("string")

    if "ano" in df.columns:
        df["ano"] = pd.to_numeric(df["ano"], errors="coerce").astype("Int64")

    colunas_numericas = [
        "area_plantada_ha",
        "area_colhida_ha",
        "quantidade_produzida_ton",
        "rendimento_medio_kg_ha",
        "valor_producao_mil_reais",
        "precipitacao_mm",
        "temperatura_max_c",
        "latitude",
        "longitude",
    ]

    for coluna in colunas_numericas:
        if coluna in df.columns:
            df[coluna] = pd.to_numeric(df[coluna], errors="coerce")

    return df