"""
main.py

Ponto de entrada da API FastAPI do projeto chuva_e_safra.

Rodar localmente (a partir da raiz do repositório):
    uvicorn api.main:app --reload

Docs automáticas (Card 8):
    http://127.0.0.1:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import rotas_graficos

app = FastAPI(
    title="Chuva & Safra API",
    description="API que cruza dados de clima e produção agrícola por município.",
    version="1.0.0",
)

# Libera acesso do frontend (Next.js) e do backend (Express) durante o desenvolvimento.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restringir em produção
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rotas_graficos.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "chuva_e_safra_api"}