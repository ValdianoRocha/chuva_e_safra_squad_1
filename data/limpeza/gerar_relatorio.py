import re

import pandas as pd


def gerar_relatorio(df):
    """
    Card 8 - Roda as validações finais antes do merge:
      - município possui código IBGE
      - código IBGE é válido (pertence ao Ceará: 7 dígitos, começa com "23")
      - produção possui ano válido (dentro do período coletado: 2015-2022)
      - município possui coordenadas (latitude/longitude não nulas)
      - chuva possui data válida (quando a coluna "data" existir, ex: clima_diario)
    """
    relatorio = {
        "total_linhas": len(df),
        "total_colunas": len(df.columns),
        "duplicados": int(df.duplicated().sum()),
        "nulos": int(df.isnull().sum().sum()),
    }

    if "municipio_codigo" in df.columns:
        relatorio["codigo_ibge_nulo"] = int(df["municipio_codigo"].isna().sum())

        codigos_validos = df["municipio_codigo"].astype(str).str.match(r"^23\d{5}$")
        relatorio["codigo_ibge_invalido"] = int((~codigos_validos).sum())

    if "ano" in df.columns:
        ano_numerico = pd.to_numeric(df["ano"], errors="coerce")
        relatorio["anos_invalidos"] = int(
            (ano_numerico.isna() | (ano_numerico < 2015) | (ano_numerico > 2022)).sum()
        )

    if "latitude" in df.columns:
        relatorio["latitude_nula"] = int(df["latitude"].isna().sum())

    if "longitude" in df.columns:
        relatorio["longitude_nula"] = int(df["longitude"].isna().sum())

    if "data" in df.columns:
        datas_invalidas = pd.to_datetime(df["data"], errors="coerce").isna()
        relatorio["chuva_data_invalida"] = int(datas_invalidas.sum())

    return relatorio