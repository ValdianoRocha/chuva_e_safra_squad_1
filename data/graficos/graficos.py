"""
graficos.py da lays

Funções para geração dos gráficos do projeto Chuva & Safra.

Perfis:
    1. produtor
    2. tecnico
    3. gestor

Bibliotecas:
    pandas
    plotly.express
    plotly.graph_objects
"""

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


# ============================================================
# CONFIGURAÇÕES
# ============================================================

TRIMESTRES = ["T1", "T2", "T3", "T4"]

COLUNAS_CHUVA = [
    "precipitacao_total_mm_T1",
    "precipitacao_total_mm_T2",
    "precipitacao_total_mm_T3",
    "precipitacao_total_mm_T4",
]


# ============================================================
# PREPARAÇÃO DO DATAFRAME
# ============================================================

def preparar_dataframe(df):
    """
    Prepara o DataFrame vindo do PostgreSQL.

    Calcula a produtividade em kg/ha:

        quantidade_produzida_ton * 1000
        --------------------------------
              area_colhida_ha

    Retorna uma cópia do DataFrame original.
    """

    if df is None or df.empty:
        raise ValueError("O DataFrame está vazio.")

    df = df.copy()

    colunas_obrigatorias = [
        "municipio_codigo",
        "ano",
        "produto",
        "area_colhida_ha",
        "quantidade_produzida_ton",
    ]

    faltantes = [
        coluna
        for coluna in colunas_obrigatorias
        if coluna not in df.columns
    ]

    if faltantes:
        raise ValueError(
            f"Colunas obrigatórias ausentes: {faltantes}"
        )

    # Converte os campos numéricos
    df["ano"] = pd.to_numeric(
        df["ano"],
        errors="coerce"
    )

    df["area_colhida_ha"] = pd.to_numeric(
        df["area_colhida_ha"],
        errors="coerce"
    )

    df["quantidade_produzida_ton"] = pd.to_numeric(
        df["quantidade_produzida_ton"],
        errors="coerce"
    )

    # Evita divisão por zero
    df["produtividade_kg_ha"] = (
        df["quantidade_produzida_ton"] * 1000
    ).div(
        df["area_colhida_ha"].replace(0, pd.NA)
    )

    return df


# ============================================================
# FILTROS
# ============================================================

def filtrar_dados(
    df,
    municipio_codigo=None,
    municipios=None,
    produto=None,
    ano_inicio=None,
    ano_fim=None,
):
    """
    Aplica filtros opcionais ao DataFrame.

    Parâmetros:
        municipio_codigo:
            Código de um único município.

        municipios:
            Lista de códigos de municípios.

        produto:
            Nome da cultura/produto.

        ano_inicio:
            Primeiro ano do período.

        ano_fim:
            Último ano do período.
    """

    df = preparar_dataframe(df)

    if municipio_codigo is not None:
        df = df[
            df["municipio_codigo"] == municipio_codigo
        ]

    if municipios is not None:
        df = df[
            df["municipio_codigo"].isin(municipios)
        ]

    if produto is not None:
        df = df[
            df["produto"].str.lower() == produto.lower()
        ]

    if ano_inicio is not None:
        df = df[
            df["ano"] >= ano_inicio
        ]

    if ano_fim is not None:
        df = df[
            df["ano"] <= ano_fim
        ]

    return df


# ============================================================
# PERFIL 1 — PRODUTOR RURAL
# ============================================================

def grafico_produtor_produtividade(
    df,
    municipio_codigo,
    produto=None,
    ano_inicio=None,
    ano_fim=None,
):
    """
    Gráfico de linha mostrando a produtividade
    do produtor ao longo dos anos.
    """

    dados = filtrar_dados(
        df,
        municipio_codigo=municipio_codigo,
        produto=produto,
        ano_inicio=ano_inicio,
        ano_fim=ano_fim,
    )

    dados = (
        dados
        .groupby("ano", as_index=False)
        ["produtividade_kg_ha"]
        .mean()
        .sort_values("ano")
    )

    fig = px.line(
        dados,
        x="ano",
        y="produtividade_kg_ha",
        markers=True,
        title="Evolução da produtividade",
        labels={
            "ano": "Ano",
            "produtividade_kg_ha": "Produtividade (kg/ha)",
        },
    )

    fig.update_layout(
        template="plotly_white",
        hovermode="x unified",
    )

    return fig


def grafico_produtor_chuva_trimestre(
    df,
    municipio_codigo,
    produto=None,
    ano=None,
):
    """
    Mostra a precipitação total em cada trimestre.

    T1 = primeiro trimestre
    T2 = segundo trimestre
    T3 = terceiro trimestre
    T4 = quarto trimestre
    """

    dados = filtrar_dados(
        df,
        municipio_codigo=municipio_codigo,
        produto=produto,
    )

    if ano is not None:
        dados = dados[dados["ano"] == ano]

    if dados.empty:
        return go.Figure()

    colunas = [
        coluna
        for coluna in COLUNAS_CHUVA
        if coluna in dados.columns
    ]

    chuva = dados[colunas].mean()

    tabela = pd.DataFrame({
        "trimestre": TRIMESTRES[:len(chuva)],
        "precipitacao_mm": chuva.values,
    })

    fig = px.bar(
        tabela,
        x="trimestre",
        y="precipitacao_mm",
        title="Precipitação por trimestre",
        labels={
            "trimestre": "Trimestre",
            "precipitacao_mm": "Precipitação (mm)",
        },
        text_auto=".1f",
    )

    fig.update_layout(
        template="plotly_white",
    )

    return fig


def grafico_produtor_chuva_produtividade(
    df,
    municipio_codigo,
    produto=None,
    ano_inicio=None,
    ano_fim=None,
):
    """
    Gráfico de dispersão:

        chuva acumulada × produtividade

    Cada ponto representa um ano.
    """

    dados = filtrar_dados(
        df,
        municipio_codigo=municipio_codigo,
        produto=produto,
        ano_inicio=ano_inicio,
        ano_fim=ano_fim,
    )

    colunas = [
        coluna
        for coluna in COLUNAS_CHUVA
        if coluna in dados.columns
    ]

    if not colunas:
        raise ValueError(
            "Nenhuma coluna de precipitação encontrada."
        )

    dados["chuva_total_mm"] = (
        dados[colunas]
        .sum(axis=1, skipna=True)
    )

    dados = dados.dropna(
        subset=[
            "chuva_total_mm",
            "produtividade_kg_ha",
        ]
    )

    fig = px.scatter(
        dados,
        x="chuva_total_mm",
        y="produtividade_kg_ha",
        hover_data=["ano"],
        title="Chuva × produtividade",
        labels={
            "chuva_total_mm": "Chuva acumulada (mm)",
            "produtividade_kg_ha": "Produtividade (kg/ha)",
        },
    )

    fig.update_layout(
        template="plotly_white",
    )

    return fig


# ============================================================
# PERFIL 2 — TÉCNICO DE COOPERATIVA
# ============================================================

def grafico_tecnico_ranking_municipios(
    df,
    municipios=None,
    produto=None,
    ano=None,
    top_n=10,
):
    """
    Ranking de produtividade dos municípios.
    """

    dados = filtrar_dados(
        df,
        municipios=municipios,
        produto=produto,
    )

    if ano is not None:
        dados = dados[
            dados["ano"] == ano
        ]

    dados = (
        dados
        .groupby(
            ["municipio_codigo", "nome"],
            as_index=False,
        )
        ["produtividade_kg_ha"]
        .mean()
        .sort_values(
            "produtividade_kg_ha",
            ascending=False,
        )
        .head(top_n)
    )

    fig = px.bar(
        dados,
        x="produtividade_kg_ha",
        y="nome",
        orientation="h",
        title="Ranking de produtividade dos municípios",
        labels={
            "produtividade_kg_ha": "Produtividade (kg/ha)",
            "nome": "Município",
        },
        text_auto=".0f",
    )

    fig.update_layout(
        template="plotly_white",
        yaxis={
            "categoryorder": "total ascending"
        },
    )

    return fig


def grafico_tecnico_evolucao_municipios(
    df,
    municipios=None,
    produto=None,
    ano_inicio=None,
    ano_fim=None,
):
    """
    Compara a evolução da produtividade
    entre vários municípios.
    """

    dados = filtrar_dados(
        df,
        municipios=municipios,
        produto=produto,
        ano_inicio=ano_inicio,
        ano_fim=ano_fim,
    )

    dados = (
        dados
        .groupby(
            ["ano", "nome"],
            as_index=False,
        )
        ["produtividade_kg_ha"]
        .mean()
        .sort_values("ano")
    )

    fig = px.line(
        dados,
        x="ano",
        y="produtividade_kg_ha",
        color="nome",
        markers=True,
        title="Evolução da produtividade por município",
        labels={
            "ano": "Ano",
            "produtividade_kg_ha": "Produtividade (kg/ha)",
            "nome": "Município",
        },
    )

    fig.update_layout(
        template="plotly_white",
        hovermode="x unified",
    )

    return fig


def grafico_tecnico_chuva_produtividade(
    df,
    municipios=None,
    produto=None,
    ano_inicio=None,
    ano_fim=None,
):
    """
    Dispersão de chuva acumulada × produtividade.

    Cada ponto representa um município em determinado ano.
    """

    dados = filtrar_dados(
        df,
        municipios=municipios,
        produto=produto,
        ano_inicio=ano_inicio,
        ano_fim=ano_fim,
    )

    colunas = [
        coluna
        for coluna in COLUNAS_CHUVA
        if coluna in dados.columns
    ]

    dados["chuva_total_mm"] = (
        dados[colunas]
        .sum(axis=1, skipna=True)
    )

    dados = dados.dropna(
        subset=[
            "chuva_total_mm",
            "produtividade_kg_ha",
        ]
    )

    fig = px.scatter(
        dados,
        x="chuva_total_mm",
        y="produtividade_kg_ha",
        color="nome",
        hover_data=[
            "municipio_codigo",
            "ano",
        ],
        title="Relação entre chuva e produtividade",
        labels={
            "chuva_total_mm": "Chuva acumulada (mm)",
            "produtividade_kg_ha": "Produtividade (kg/ha)",
            "nome": "Município",
        },
    )

    fig.update_layout(
        template="plotly_white",
    )

    return fig


def grafico_tecnico_chuva_municipios(
    df,
    municipios=None,
    produto=None,
    ano=None,
):
    """
    Compara a chuva acumulada entre os municípios.
    """

    dados = filtrar_dados(
        df,
        municipios=municipios,
        produto=produto,
    )

    if ano is not None:
        dados = dados[
            dados["ano"] == ano
        ]

    colunas = [
        coluna
        for coluna in COLUNAS_CHUVA
        if coluna in dados.columns
    ]

    dados["chuva_total_mm"] = (
        dados[colunas]
        .sum(axis=1, skipna=True)
    )

    dados = (
        dados
        .groupby(
            ["municipio_codigo", "nome"],
            as_index=False,
        )
        ["chuva_total_mm"]
        .mean()
        .sort_values(
            "chuva_total_mm",
            ascending=False,
        )
    )

    fig = px.bar(
        dados,
        x="nome",
        y="chuva_total_mm",
        title="Chuva acumulada por município",
        labels={
            "nome": "Município",
            "chuva_total_mm": "Chuva acumulada (mm)",
        },
        text_auto=".0f",
    )

    fig.update_layout(
        template="plotly_white",
    )

    return fig


# ============================================================
# PERFIL 3 — GESTOR PÚBLICO
# ============================================================

def grafico_gestor_top_municipios(
    df,
    produto=None,
    ano=None,
    top_n=10,
):
    """
    Top municípios do estado por produtividade.
    """

    dados = filtrar_dados(
        df,
        produto=produto,
    )

    if ano is not None:
        dados = dados[
            dados["ano"] == ano
        ]

    dados = (
        dados
        .groupby(
            ["municipio_codigo", "nome"],
            as_index=False,
        )
        ["produtividade_kg_ha"]
        .mean()
        .sort_values(
            "produtividade_kg_ha",
            ascending=False,
        )
        .head(top_n)
    )

    fig = px.bar(
        dados,
        x="produtividade_kg_ha",
        y="nome",
        orientation="h",
        title="Top municípios por produtividade",
        labels={
            "produtividade_kg_ha": "Produtividade (kg/ha)",
            "nome": "Município",
        },
        text_auto=".0f",
    )

    fig.update_layout(
        template="plotly_white",
        yaxis={
            "categoryorder": "total ascending"
        },
    )

    return fig


def grafico_gestor_evolucao_produtividade(
    df,
    produto=None,
    ano_inicio=None,
    ano_fim=None,
):
    """
    Mostra a evolução média da produtividade
    dos municípios ao longo do tempo.
    """

    dados = filtrar_dados(
        df,
        produto=produto,
        ano_inicio=ano_inicio,
        ano_fim=ano_fim,
    )

    dados = (
        dados
        .groupby("ano", as_index=False)
        ["produtividade_kg_ha"]
        .mean()
        .sort_values("ano")
    )

    fig = px.line(
        dados,
        x="ano",
        y="produtividade_kg_ha",
        markers=True,
        title="Evolução da produtividade",
        labels={
            "ano": "Ano",
            "produtividade_kg_ha": "Produtividade média (kg/ha)",
        },
    )

    fig.update_layout(
        template="plotly_white",
        hovermode="x unified",
    )

    return fig


def grafico_gestor_municipios_em_queda(
    df,
    produto=None,
    ano_inicio=None,
    ano_fim=None,
    top_n=10,
):
    """
    Identifica municípios cuja produtividade
    apresentou maior queda entre o primeiro
    e o último ano disponível.

    A variação é calculada em percentual.
    """

    dados = filtrar_dados(
        df,
        produto=produto,
        ano_inicio=ano_inicio,
        ano_fim=ano_fim,
    )

    dados = (
        dados
        .groupby(
            ["municipio_codigo", "nome", "ano"],
            as_index=False,
        )
        ["produtividade_kg_ha"]
        .mean()
    )

    primeiro_ano = dados["ano"].min()
    ultimo_ano = dados["ano"].max()

    inicial = dados[
        dados["ano"] == primeiro_ano
    ][
        [
            "municipio_codigo",
            "nome",
            "produtividade_kg_ha",
        ]
    ].rename(
        columns={
            "produtividade_kg_ha":
                "produtividade_inicial"
        }
    )

    final = dados[
        dados["ano"] == ultimo_ano
    ][
        [
            "municipio_codigo",
            "produtividade_kg_ha",
        ]
    ].rename(
        columns={
            "produtividade_kg_ha":
                "produtividade_final"
        }
    )

    comparacao = pd.merge(
        inicial,
        final,
        on="municipio_codigo",
        how="inner",
    )

    comparacao["variacao_percentual"] = (
        (
            comparacao["produtividade_final"]
            - comparacao["produtividade_inicial"]
        )
        / comparacao["produtividade_inicial"].replace(
            0,
            pd.NA,
        )
    ) * 100

    comparacao = (
        comparacao
        .dropna(
            subset=["variacao_percentual"]
        )
        .sort_values(
            "variacao_percentual"
        )
        .head(top_n)
    )

    fig = px.bar(
        comparacao,
        x="variacao_percentual",
        y="nome",
        orientation="h",
        title=(
            "Municípios com maior queda "
            "de produtividade"
        ),
        labels={
            "variacao_percentual":
                "Variação da produtividade (%)",
            "nome":
                "Município",
        },
        text_auto=".1f",
    )

    fig.update_layout(
        template="plotly_white",
    )

    return fig


def grafico_gestor_chuva_produtividade(
    df,
    produto=None,
    ano_inicio=None,
    ano_fim=None,
):
    """
    Relação entre chuva acumulada e produtividade
    considerando os municípios do estado.
    """

    dados = filtrar_dados(
        df,
        produto=produto,
        ano_inicio=ano_inicio,
        ano_fim=ano_fim,
    )

    colunas = [
        coluna
        for coluna in COLUNAS_CHUVA
        if coluna in dados.columns
    ]

    dados["chuva_total_mm"] = (
        dados[colunas]
        .sum(axis=1, skipna=True)
    )

    dados = dados.dropna(
        subset=[
            "chuva_total_mm",
            "produtividade_kg_ha",
        ]
    )

    fig = px.scatter(
        dados,
        x="chuva_total_mm",
        y="produtividade_kg_ha",
        hover_data=[
            "nome",
            "ano",
            "produto",
        ],
        title="Chuva × produtividade no estado",
        labels={
            "chuva_total_mm": "Chuva acumulada (mm)",
            "produtividade_kg_ha": "Produtividade (kg/ha)",
        },
    )

    fig.update_layout(
        template="plotly_white",
    )

    return fig


print(grafico_gestor_chuva_produtividade())