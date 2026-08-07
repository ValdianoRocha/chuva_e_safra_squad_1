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


if __name__ == "__main__":
    df_teste = pd.DataFrame([
        {"municipio_codigo": 2300101, "ano": "2020", "area_plantada_ha": "150", "valor_producao_mil_reais": "900,5"},
        {"municipio_codigo": None, "ano": "2021", "area_plantada_ha": "80", "valor_producao_mil_reais": "300"},
    ])

    print("--- Antes da padronização ---")
    print(df_teste.dtypes)
    print(df_teste)

    df_tipado = padronizar_tipos(df_teste)

    print("\n--- Card 4: padronizar_tipos ---")
    print(df_tipado.dtypes)
    print(df_tipado)