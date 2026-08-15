from fastapi import APIRouter, HTTPException
from get_db.get_db import get_db

router = APIRouter(prefix="/culturas", tags=["culturas"])


@router.get("/")
def listar_culturas():
    try:
        df = get_db()
        culturas = (
            df["produto"]
            .dropna()
            .str.strip()
            .str.lower()
            .unique()
            .tolist()
        )
        culturas = sorted([c for c in culturas if c != ""])
        return culturas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar culturas: {str(e)}")