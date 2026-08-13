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

    # --- Integrar módulo de análise: solicitar figura e KPIs ---
    figura = solicitar_figura(df_filtrado, cultura, de, ate)
    kpis = solicitar_kpis(df_filtrado)

    return {
        "figura": figura,
        "kpis": kpis
    }