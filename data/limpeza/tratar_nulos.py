import pandas as pd

# Colunas de produção: ausência é interpretada como "não houve" (zero),
# já que o IBGE usa "-" para indicar que a atividade não ocorreu naquele
# município/ano.
COLUNAS_ZERO = [
    "area_plantada_ha",
    "area_colhida_ha",
    "quantidade_produzida_ton",
    "rendimento_medio_kg_ha",
    "valor_producao_mil_reais",
]

# Colunas climáticas: ausência não deve ser inventada (não faz sentido
# "zerar" chuva ou temperatura), então permanece como NaN.
COLUNAS_MANTER_NAN = [
    "precipitacao_mm",
    "temperatura_max_c",
]

# Colunas obrigatórias: sem elas o registro não é utilizável no merge.
COLUNAS_OBRIGATORIAS = [
    "municipio_codigo",
]


def tratar_nulos(df):
    """
    Card 5 - Trata valores ausentes:
      1. "-", "...", "X" (marcadores de "sem dado" do IBGE) viram NaN
      2. colunas de produção agrícola ausentes -> preenchidas com 0
      3. colunas climáticas ausentes -> mantidas como NaN
      4. registros sem município_codigo -> removidos

    Retorna (df_tratado, df_log). df_log documenta, por coluna, quantos
    registros foram afetados e qual estratégia foi usada.
    """
    df = df.replace(["-", "...", "X"], pd.NA)

    log = []

    for coluna in COLUNAS_ZERO:
        if coluna in df.columns:
            n_ausentes = int(df[coluna].isna().sum())
            if n_ausentes > 0:
                df[coluna] = df[coluna].fillna(0)
                log.append({
                    "coluna": coluna,
                    "estrategia": "preenchido_com_zero",
                    "registros_afetados": n_ausentes,
                })

    for coluna in COLUNAS_MANTER_NAN:
        if coluna in df.columns:
            n_ausentes = int(df[coluna].isna().sum())
            if n_ausentes > 0:
                log.append({
                    "coluna": coluna,
                    "estrategia": "mantido_como_nan",
                    "registros_afetados": n_ausentes,
                })

    for coluna in COLUNAS_OBRIGATORIAS:
        if coluna in df.columns:
            n_ausentes = int(df[coluna].isna().sum())
            if n_ausentes > 0:
                df = df[df[coluna].notna()]
                log.append({
                    "coluna": coluna,
                    "estrategia": "registro_removido",
                    "registros_afetados": n_ausentes,
                })

    return df.reset_index(drop=True), pd.DataFrame(log)