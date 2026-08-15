"""
main.py

Ponto de entrada da API FastAPI do projeto chuva_e_safra.

Rodar localmente (a partir da raiz do repositório):
    uvicorn main:app --reload

Docs automáticas (Card 8):
    http://127.0.0.1:8000/docs
"""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from routers import rotas_graficos
from routers.municipios import router as municipios_router
from routers.culturas import router as culturas_router


app = FastAPI(
    title="Chuva & Safra API",
    description="API que cruza dados de clima e produção agrícola por município.",
    version="1.0.0",
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    for erro in exc.errors():
        campo = erro.get("loc", [])

        if "cultura" in campo:
            return JSONResponse(
                status_code=404,
                content={
                    "erro": "cultura_inexistente",
                    "mensagem": "A cultura informada não existe."
                }
            )

        if "municipios" in campo:
            return JSONResponse(
                status_code=404,
                content={
                    "erro": "municipio_inexistente",
                    "mensagem": "O município informado não existe."
                }
            )

    return JSONResponse(
        status_code=400,
        content={
            "erro": "requisicao_invalida",
            "mensagem": "Os dados informados são inválidos."
        }
    )


# Libera acesso do frontend (Next.js) e do backend (Express) durante o desenvolvimento.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restringir em produção
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(rotas_graficos.router)
app.include_router(municipios_router)
app.include_router(culturas_router)


# @app.get("/")
# def root():
#     return {
#         "status": "ok",
#         "service": "chuva_e_safra_api"
#     }