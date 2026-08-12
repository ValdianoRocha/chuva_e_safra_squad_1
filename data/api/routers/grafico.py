import pandas as pd
import plotly.graph_objects as go
from fastapi import APIRouter, Query, HTTPException
from get_db.get_db import get_db

router = APIRouter()


@router.get("/grafico")
def obter_grafico(
    perfil: str = Query(...),
    cultura: str = Query(...),
    de: int = Query(..., ge=2015, le=2022),
    ate: int = Query(..., ge=2015, le=2022),
    municipios: list[str] | None = Query(None),
):
    perfis_validos = {"PRODUTOR", "TECNICO", "GESTOR"}
    culturas_validas = {"milho", "feijao", "mandioca", "caju", "banana"}

    perfil = perfil.upper()
    cultura = cultura.lower()

    if perfil not in perfis_validos:
        raise HTTPException(
            status_code=400,
            detail="Perfil inválido. Use PRODUTOR, TECNICO ou GESTOR."
        )

    if cultura not in culturas_validas:
        raise HTTPException(
            status_code=400,
            detail="Cultura inválida."
        )

    if de > ate:
        raise HTTPException(
            status_code=400,
            detail="O ano inicial não pode ser maior que o ano final."
        )

    if perfil != "GESTOR" and not municipios:
        raise HTTPException(
            status_code=400,
            detail="Informe pelo menos um município."
        )

    # --- Consulta os dados do banco ---
    df = get_db()

    # --- Valida se os municípios informados existem ---
    municipios_int = None
    if municipios:
        try:
            municipios_int = [int(m) for m in municipios]
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Código de município inválido. Use apenas números (código IBGE)."
            )

        municipios_existentes = set(df["municipio_codigo"].unique())
        municipios_invalidos = [m for m in municipios_int if m not in municipios_existentes]

        if municipios_invalidos:
            raise HTTPException(
                status_code=404,
                detail=f"Município(s) não encontrado(s): {municipios_invalidos}"
            )

    # --- Filtra os dados ---
    df_filtrado = df[
        (df["produto"] == cultura) &
        (df["ano"] >= de) &
        (df["ano"] <= ate)
    ]

    if municipios_int:
        df_filtrado = df_filtrado[df_filtrado["municipio_codigo"].isin(municipios_int)]

    if df_filtrado.empty:
        raise HTTPException(
            status_code=404,
            detail="Nenhum dado encontrado para os filtros informados."
        )

    # --- Agrega produção por ano ---
    resumo_ano = df_filtrado.groupby("ano").agg(
        producao_total_ton=("quantidade_produzida_ton", "sum"),
        precipitacao_media_mm=("precipitacao_total_mm_T1", "mean"),
    ).reset_index()

    # --- Monta o gráfico ---
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

    # --- KPIs ---
    kpis = {
        "producao_total_ton": float(df_filtrado["quantidade_produzida_ton"].sum()),
        "rendimento_medio_kg_ha": float(df_filtrado["rendimento_medio_kg_ha"].mean()),
        "area_plantada_total_ha": float(df_filtrado["area_plantada_ha"].sum()),
    }

    return {
        "figura": fig.to_dict(),
        "kpis": kpis
    }