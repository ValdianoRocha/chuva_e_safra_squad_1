from fastapi import APIRouter, Query, HTTPException

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

    return {
        "figura": {
            "data": [],
            "layout": {}
        },
        "kpis": {}
    }