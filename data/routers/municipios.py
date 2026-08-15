from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from get_db.get_db import get_db


router = APIRouter(
    prefix="/municipios",
    tags=["municipios"]
)


class MunicipioResponse(BaseModel):
    codigo: int
    nome: str


@router.get("/", response_model=List[MunicipioResponse])
def listar_municipios():
    try:
        df = get_db()

        municipios = (
            df[
                ["municipio_codigo", "nome"]
            ]
            .dropna()
            .drop_duplicates()
            .sort_values("nome")
        )
        municipios = municipios[municipios["nome"].str.strip() != ""]
        
        return [
            {
                "codigo": int(row["municipio_codigo"]),
                "nome": str(row["nome"])
            }
            for _, row in municipios.iterrows()
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar municípios: {str(e)}"
        )