from fastapi import APIRouter, Query, HTTPException
from get_db.get_db import get_db
from analise.analise import aplicar_filtros, solicitar_figura, solicitar_kpis

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

    # --- Buscar dados (módulo get_db) ---
    df = get_db()

    # --- Validar municípios existentes ---
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

    # --- Integrar módulo de análise: aplicar filtros ---
    df_filtrado = aplicar_filtros(df, cultura, de, ate, municipios_int)

    if df_filtrado.empty:
        raise HTTPException(
            status_code=404,
            detail="Nenhum dado encontrado para os filtros informados."
        )


    # --- Integrar módulo de análise: solicitar figura --- #
    figura = solicitar_figura(df_filtrado, cultura, de, ate)

    # KPIs básicos

    produtividade_media = df_filtrado["rendimento_medio_kg_ha"].mean()

    colunas_chuva = [
        "precipitacao_total_mm_T1",
        "precipitacao_total_mm_T2",
        "precipitacao_total_mm_T3",
        "precipitacao_total_mm_T4",
    ]

    chuva_total = (
        df_filtrado[colunas_chuva]
        .sum()
        .sum()
    )


# Tendência da produtividade

    produtividade_por_ano = (
        df_filtrado
        .groupby("ano")["rendimento_medio_kg_ha"]
        .mean()
        .sort_index()
   )

    if len(produtividade_por_ano) >= 2:
       primeira = produtividade_por_ano.iloc[0]
       ultima = produtividade_por_ano.iloc[-1]

       if ultima > primeira:
           tendencia = "crescente"
       elif ultima < primeira:
            tendencia = "decrescente"
       else:
            tendencia = "estável"
    else:
        tendencia = "estável"


    kpis = {
        "produtividade_media": f"{produtividade_media:.0f} kg/ha",
        "chuva_total": f"{chuva_total:.0f} mm",
        "tendencia": tendencia,
    }


    # PRODUTOR


    if perfil == "PRODUTOR":
        return {
            "figura": figura,
            "kpis": kpis,
       }


    # TABELA POR MUNICÍPIO

    tabela_municipios = (
        df_filtrado
        .groupby(["municipio_codigo", "nome"], dropna=False)
        .agg(
            produtividade_media=("rendimento_medio_kg_ha", "mean"),
            chuva_total=("precipitacao_total_mm_T1", "sum"),
        )
        .reset_index()
    )



# TECNICO

    if perfil == "TECNICO":
        tabela = []
        for _, linha in tabela_municipios.iterrows():
            tabela.append({
                "municipio": linha["nome"],
                "codigo": str(int(linha["municipio_codigo"])),
                "produtividade_media": f"{linha['produtividade_media']:.0f} kg/ha",
                "chuva_total": f"{linha['chuva_total']:.0f} mm",
            })

        kpis["tabela"] = tabela

        return {
            "figura": figura,
            "kpis": kpis
        }


# GESTOR 


    # Ranking dos municípios por produtividade
    tabela_municipios = tabela_municipios.sort_values(
        by="produtividade_media", ascending=False
    ).reset_index(drop=True)

    tabela_municipios["ranking"] = tabela_municipios.index + 1

    # Municípios abaixo da média são considerados em risco
    media_produtividade = tabela_municipios["produtividade_media"].mean()
    municipios_risco = tabela_municipios[
        tabela_municipios["produtividade_media"] < media_produtividade
    ]

    tabela_gestor = []
    for _, linha in tabela_municipios.iterrows():
        tabela_gestor.append({
            "municipio": linha["nome"],
            "codigo": str(int(linha["municipio_codigo"])),
            "produtividade_media": f"{linha['produtividade_media']:.0f} kg/ha",
            "ranking": int(linha["ranking"]),
        })

    kpis["total_municipios"] = int(tabela_municipios["municipio_codigo"].nunique())
    kpis["municipios_risco"] = municipios_risco["nome"].dropna().tolist()
    kpis["tabela"] = tabela_gestor

    return {"figura": figura, "kpis": kpis}

      