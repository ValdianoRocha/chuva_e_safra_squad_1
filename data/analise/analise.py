import pandas as pd
import plotly.graph_objects as go


def aplicar_filtros(df: pd.DataFrame, cultura: str, de: int, ate: int, municipios: list[int] | None) -> pd.DataFrame:
    """Filtra o DataFrame pelos parâmetros da requisição."""
    df_filtrado = df[
        (df["produto"] == cultura) &
        (df["ano"] >= de) &
        (df["ano"] <= ate)
    ]

    if municipios:
        df_filtrado = df_filtrado[df_filtrado["municipio_codigo"].isin(municipios)]

    return df_filtrado


def solicitar_figura(df_filtrado: pd.DataFrame, cultura: str, de: int, ate: int) -> dict:
    """Monta o gráfico de produção por ano a partir dos dados filtrados."""
    resumo_ano = df_filtrado.groupby("ano").agg(
        producao_total_ton=("quantidade_produzida_ton", "sum"),
        precipitacao_media_mm=("precipitacao_total_mm_T1", "mean"),
    ).reset_index()

    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=resumo_ano["ano"],
        y=resumo_ano["producao_total_ton"],
        mode="lines+markers",
        name="Produção (ton)"
    ))
    fig.update_layout(
        title=f"Produção de {cultura} ({de}-{ate})",
        xaxis_title="Ano",
        yaxis_title="Produção (toneladas)"
    )

    return fig.to_dict()


def solicitar_kpis(df_filtrado: pd.DataFrame) -> dict:
    """Calcula os indicadores (KPIs) a partir dos dados filtrados."""
    return {
        "producao_total_ton": float(df_filtrado["quantidade_produzida_ton"].sum()),
        "rendimento_medio_kg_ha": float(df_filtrado["rendimento_medio_kg_ha"].mean()),
        "area_plantada_total_ha": float(df_filtrado["area_plantada_ha"].sum()),
    }