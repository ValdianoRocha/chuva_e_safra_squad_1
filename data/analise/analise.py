# import numpy as np
# import pandas as pd

# from get_db.get_db import get_db

# df = get_db()

# #so pra identificar se o arquivo e csv ou xlsx
# def processar_base_analitica(caminho_entrada: str, caminho_saida: str):

#     if caminho_entrada.endswith(".csv"):
#         df = pd.read_csv(caminho_entrada)
#     else:
#         df = pd.read_excel(caminho_entrada)

# #colhida e nula igual ou <0, ou a quantidade produzida e nula ou <0
#     condicao_invalida = (
#         df["area_colhida"].isna()
#         | (df["area_colhida"] <= 0)
#         | df["quantidade_produzida"].isna()
#         | (df["quantidade_produzida"] < 0)
#     )
# #Caso o registro seja invaido e prenchido como valor nulo
#     df_invalidos = df[condicao_invalida].copy()
#     caminho_invalidos = caminho_saida.replace(".", "_invalidos.")
#     df_invalidos.to_csv(caminho_invalidos, index=False)
#     print(
#         f"{len(df_invalidos)} registros invalidos salvos em: {caminho_invalidos}"
#     )
# #Gera a coluna produtividade
#     df["produtividade"] = np.where(
#         (df["area_colhida"] > 0) & (df["quantidade_produzida"] >= 0),
#         df["quantidade_produzida"] / df["area_colhida"],
#         np.nan,
#     )

#     df.to_csv(caminho_saida, index=False)
#     print(f"Base processada com sucesso e salva em: {caminho_saida}")

# if _name_ == "_main_":

#     ARQUIVO_ENTRADA = "dados_originais.csv"
#     ARQUIVO_SAIDA = "base_analitica.csv"

#     processar_base_analitica(ARQUIVO_ENTRADA, ARQUIVO_SAIDA)


# caucula o volume acumulado de precipitacao nos meses

import numpy as np
import pandas as pd

from get_db.get_db import get_db


# CARREGAR BASE DE DADOS

df = get_db()


# PREPARAR BASE PARA ANÁLISE

def preparar_base(df):
    # Cria uma cópia da base para não alterar o DataFrame original
    df = df.copy()

    # GERA A COLUNA DE PRODUTIVIDADE

    df["produtividade_ton_ha"] = np.where(
        (df["area_colhida_ha"] > 0)
        & (df["quantidade_produzida_ton"].notna()),
        df["quantidade_produzida_ton"] / df["area_colhida_ha"],
        np.nan,
    )

    # CALCULA A PRECIPITAÇÃO TOTAL DO ANO CIVIL

    # Usamos o ano civil porque ele captura o ciclo agrícola completo
    # e vai considerar chuvas atipicas que estão fora da quadra

    df["precipitacao_total_mm_ano_civil"] = (
        df["precipitacao_total_mm_T1"]
        + df["precipitacao_total_mm_T2"]
        + df["precipitacao_total_mm_T3"]
        + df["precipitacao_total_mm_T4"]
    )

    return df


# PREPARAR BASE ORIGINAL

df = preparar_base(df)


# IDENTIFICA REGISTROS SEM PRODUTIVIDADE

invalidos = df["produtividade_ton_ha"].isna().sum()

print(
    f"Registros sem produtividade calculada "
    f"(inválidos/zerados): {invalidos}"
)


# ESTATÍSTICAS DESCRITIVAS

colunas_interesse = [
    # Produção e Área
    "area_plantada_ha",
    "area_colhida_ha",
    "quantidade_produzida_ton",
    "produtividade_ton_ha",

    # Chuva por Trimestre e Ano Civil
    "precipitacao_total_mm_T1",
    "precipitacao_total_mm_T2",
    "precipitacao_total_mm_T3",
    "precipitacao_total_mm_T4",
    "precipitacao_total_mm_ano_civil",
]

tabela_estatisticas = df[colunas_interesse].agg(
    ["mean", "median", "max", "min", "std"]
)

print("\n--- Estatísticas Descritivas ---")
print(tabela_estatisticas)


# CORRELAÇÃO ENTRE CHUVA E PRODUTIVIDADE

colunas_chuva = [
    "precipitacao_total_mm_T1",
    "precipitacao_total_mm_T2",
    "precipitacao_total_mm_T3",
    "precipitacao_total_mm_T4",
]

correlacoes_chuva = df[colunas_chuva].corrwith(
    df["produtividade_ton_ha"]
)

print(
    "\n--- Correlação da Produtividade com Chuva "
    "(Por Trimestre) ---"
)

print(correlacoes_chuva)


def interpretar_correlacao(
    r: float,
    nome_variavel: str
) -> str:
    """Classifica a força e a direção da correlação e retorna um texto interpretativo."""

    if pd.isna(r):
        return (
            f"{nome_variavel}: Não foi possível calcular "
            f"a correlação (dados insuficientes)."
        )

    abs_r = abs(r)

    if abs_r < 0.3:
        forca = "fraca"

    elif abs_r < 0.7:
        forca = "moderada"

    else:
        forca = "forte"

    if abs_r < 0.05:
        return (
            f"{nome_variavel} (r = {r:.4f}): "
            f"Correlação praticamente nula. "
            f"Não se observa padrão claro nesta amostra."
        )

    if r > 0:
        return (
            f"{nome_variavel} (r = {r:.4f}): "
            f"Correlação positiva {forca}. "
            f"Nos períodos mais chuvosos, observou-se "
            f"tendência de maior produtividade nesta amostra."
        )

    else:
        return (
            f"{nome_variavel} (r = {r:.4f}): "
            f"Correlação negativa {forca}. "
            f"Nos períodos mais chuvosos, observou-se "
            f"tendência de menor produtividade nesta amostra."
        )


print(
    "\n--- Interpretação das Correlações "
    "(Sem Relação de Causa e Efeito) ---"
)

for col in colunas_chuva:
    r_val = correlacoes_chuva[col]

    print(
        interpretar_correlacao(
            r_val,
            col
        )
    )


# IDENTIFICA COMPORTAMENTOS ATÍPICOS

media_chuva = df[
    "precipitacao_total_mm_ano_civil"
].mean()

media_produtividade = df[
    "produtividade_ton_ha"
].mean()


condicao_muita_chuva_baixa_prod = (
    (df["precipitacao_total_mm_ano_civil"] > media_chuva)
    &
    (df["produtividade_ton_ha"] < media_produtividade)
)


condicao_pouca_chuva_alta_prod = (
    (df["precipitacao_total_mm_ano_civil"] < media_chuva)
    &
    (df["produtividade_ton_ha"] > media_produtividade)
)


df["comportamento_atipico"] = np.select(
    [
        condicao_muita_chuva_baixa_prod,
        condicao_pouca_chuva_alta_prod
    ],
    [
        "Muita Chuva e Baixa Produtividade",
        "Pouca Chuva e Alta Produtividade"
    ],
    default="Padrão Esperado/Intermediário"
)


# TABELA DE MUNICÍPIOS ATÍPICOS

colunas_entregavel = [
    "municipio_codigo",
    "nome" if "nome" in df.columns else "municipio_codigo",
    "ano",
    "produto"
    if "produto" in df.columns
    else "quantidade_produzida_ton",
    "precipitacao_total_mm_ano_civil",
    "produtividade_ton_ha",
    "comportamento_atipico"
]


colunas_existentes = [
    col
    for col in colunas_entregavel
    if col in df.columns
]


tabela_municipios_atipicos = df[
    df["comportamento_atipico"]
    != "Padrão Esperado/Intermediário"
][colunas_existentes].sort_values(
    by="comportamento_atipico"
)


print("\n--- Tabela de Municípios Atípicos ---")
print(tabela_municipios_atipicos)


# PRODUTIVIDADE E CHUVA POR ANO

df_por_ano = (
    df.groupby("ano")
    .agg(
        produtividade_media_ton_ha=(
            "produtividade_ton_ha",
            "mean"
        ),
        produtividade_mediana_ton_ha=(
            "produtividade_ton_ha",
            "median"
        ),
        precipitacao_media_mm=(
            "precipitacao_total_mm_ano_civil",
            "mean"
        ),
        total_produzido_ton=(
            "quantidade_produzida_ton",
            "sum"
        ),
        area_colhida_total_ha=(
            "area_colhida_ha",
            "sum"
        ),
    )
    .reset_index()
)


# PRODUTIVIDADE E CHUVA POR MUNICÍPIO

coluna_nome = (
    "nome"
    if "nome" in df.columns
    else "municipio_codigo"
)


df_por_municipio = (
    df.groupby(
        [
            "municipio_codigo",
            coluna_nome
        ]
    )
    .agg(
        produtividade_media_ton_ha=(
            "produtividade_ton_ha",
            "mean"
        ),
        precipitacao_media_mm=(
            "precipitacao_total_mm_ano_civil",
            "mean"
        ),
        total_produzido_historico_ton=(
            "quantidade_produzida_ton",
            "sum"
        ),
    )
    .reset_index()
)


# TABELA PARA GRÁFICO DE DISPERSÃO

df_dispersao = df[
    [
        "municipio_codigo",
        coluna_nome,
        "ano",
        "precipitacao_total_mm_ano_civil",
        "produtividade_ton_ha",
        "quantidade_produzida_ton",
        "area_colhida_ha",
    ]
].dropna(
    subset=[
        "precipitacao_total_mm_ano_civil",
        "produtividade_ton_ha"
    ]
)


# TABELA PARA RANKINGS

df_ranking_produtividade = (
    df_por_municipio
    .sort_values(
        by="produtividade_media_ton_ha",
        ascending=False
    )
    .reset_index(drop=True)
)


df_ranking_precipitacao = (
    df_por_municipio
    .sort_values(
        by="precipitacao_media_mm",
        ascending=False
    )
    .reset_index(drop=True)
)


# DADOS UTILIZADOS PELOS GRÁFICOS

graficos = {
    "evolucao_anual": df_por_ano,
    "resumo_municipios": df_por_municipio,
    "dados_dispersao": df_dispersao,
    "ranking_produtividade": df_ranking_produtividade,
    "ranking_precipitacao": df_ranking_precipitacao,
}


# APLICAR FILTROS

def aplicar_filtros(
    df,
    cultura,
    de,
    ate,
    municipios=None
):
    """
    Aplica os filtros de cultura, período e municípios
    sobre a base de dados.
    """

    # PREPARAR BASE PARA ANÁLISE
    df_filtrado = preparar_base(df)

    # Filtro por cultura
    if "cultura" in df_filtrado.columns:
        df_filtrado = df_filtrado[
            df_filtrado["cultura"] == cultura
        ]

    elif "produto" in df_filtrado.columns:
        df_filtrado = df_filtrado[
            df_filtrado["produto"] == cultura
        ]

    # Filtro por período
    df_filtrado = df_filtrado[
        (df_filtrado["ano"] >= de)
        &
        (df_filtrado["ano"] <= ate)
    ]

    # Filtro por municípios
    if municipios:
        df_filtrado = df_filtrado[
            df_filtrado["municipio_codigo"].isin(
                municipios
            )
        ]

    return df_filtrado


# SOLICITAR FIGURA

def solicitar_figura(
    df_filtrado,
    cultura,
    de,
    ate
):
    """
    Retorna os dados necessários para a construção
    dos gráficos.
    """

    # PREPARAR BASE PARA ANÁLISE
    df_filtrado = preparar_base(df_filtrado)

    dados = {
        "evolucao_anual": (
            df_filtrado
            .groupby("ano")
            .agg(
                produtividade_media_ton_ha=(
                    "produtividade_ton_ha",
                    "mean"
                ),
                precipitacao_media_mm=(
                    "precipitacao_total_mm_ano_civil",
                    "mean"
                ),
            )
            .reset_index()
            .to_dict(orient="records")
        ),

        "dados_dispersao": (
            df_filtrado[
                [
                    "municipio_codigo",
                    "ano",
                    "precipitacao_total_mm_ano_civil",
                    "produtividade_ton_ha",
                ]
            ]
            .dropna()
            .to_dict(orient="records")
        ),
    }

    return dados


# SOLICITAR KPIs

def solicitar_kpis(
    df_filtrado,
    perfil
):
    """
    Calcula e retorna os KPIs de acordo com o perfil
    solicitado.
    """

    # PREPARAR BASE PARA ANÁLISE
    df_filtrado = preparar_base(df_filtrado)

    kpis = {}

    # Produtividade média
    if "produtividade_ton_ha" in df_filtrado.columns:
        produtividade_media = (
            df_filtrado[
                "produtividade_ton_ha"
            ].mean()
        )

        kpis["produtividade_media_ton_ha"] = (
            round(
                produtividade_media,
                2
            )
            if pd.notna(produtividade_media)
            else None
        )

    # Precipitação média
    if "precipitacao_total_mm_ano_civil" in df_filtrado.columns:
        precipitacao_media = (
            df_filtrado[
                "precipitacao_total_mm_ano_civil"
            ].mean()
        )

        kpis["precipitacao_media_mm"] = (
            round(
                precipitacao_media,
                2
            )
            if pd.notna(precipitacao_media)
            else None
        )

    # Total produzido
    if "quantidade_produzida_ton" in df_filtrado.columns:
        kpis["total_produzido_ton"] = round(
            df_filtrado[
                "quantidade_produzida_ton"
            ].sum(),
            2
        )

    # PRODUTOR
    if perfil == "PRODUTOR":
        return kpis

    # Total de municípios
    if "municipio_codigo" in df_filtrado.columns:
        kpis["total_municipios"] = int(
            df_filtrado[
                "municipio_codigo"
            ].nunique()
        )

    # TECNICO
    if perfil == "TECNICO":
        tabela = (
            df_filtrado
            .groupby(
                ["municipio_codigo", "nome"],
                dropna=False
            )
            .agg(
                produtividade_media_ton_ha=(
                    "produtividade_ton_ha",
                    "mean"
                ),
                precipitacao_media_mm=(
                    "precipitacao_total_mm_ano_civil",
                    "mean"
                ),
            )
            .reset_index()
        )

        kpis["tabela"] = tabela.to_dict(
            orient="records"
        )

        return kpis

    # GESTOR
    if perfil == "GESTOR":

        ranking = (
            df_filtrado
            .groupby(
                ["municipio_codigo", "nome"],
                dropna=False
            )
            .agg(
                produtividade_media_ton_ha=(
                    "produtividade_ton_ha",
                    "mean"
                )
            )
            .reset_index()
            .sort_values(
                by="produtividade_media_ton_ha",
                ascending=False
            )
            .reset_index(drop=True)
        )

        ranking["ranking"] = (
            ranking.index + 1
        )

        media_produtividade = (
            ranking[
                "produtividade_media_ton_ha"
            ].mean()
        )

        municipios_risco = ranking[
            ranking[
                "produtividade_media_ton_ha"
            ] < media_produtividade
        ]

        kpis["municipios_risco"] = (
            municipios_risco[
                "nome"
            ]
            .dropna()
            .tolist()
        )

        kpis["ranking"] = ranking.to_dict(
            orient="records"
        )

        return kpis

    return kpis