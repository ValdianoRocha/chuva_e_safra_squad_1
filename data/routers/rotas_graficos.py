from fastapi import APIRouter, Query, HTTPException
from get_db.get_db import get_db
from analise.analise import aplicar_filtros, solicitar_figura, solicitar_kpis
from enum import Enum
import traceback


# PERFIS DISPONÍVEIS
class PerfilEnum(str, Enum):
    PRODUTOR = "PRODUTOR"
    TECNICO = "TECNICO"
    GESTOR = "GESTOR"


# CULTURAS DISPONÍVEIS
class CulturaEnum(str, Enum):
    milho = "milho"
    feijao = "feijao"
    mandioca = "mandioca"
    caju = "caju"
    banana = "banana"



router = APIRouter()


# ENDPOINT DE GRÁFICOS E KPIs
@router.get(
    "/grafico",
    summary="Consultar gráficos e KPIs",
    description="""
    Retorna os dados dos gráficos e os KPIs calculados
    de acordo com o perfil, cultura, período e município informado.

    Perfis disponíveis:
    - PRODUTOR: retorna KPIs gerais da produção.
    - TECNICO: retorna KPIs e informações por município.
    - GESTOR: retorna KPIs, ranking e municípios em situação de risco.
    """,
    responses={
        200: {
            "description": "Dados dos gráficos e KPIs retornados com sucesso."
        },
        400: {
            "description": "Parâmetros inválidos."
        },
        404: {
            "description": "Nenhum dado encontrado para os filtros informados."
        },
        500: {
            "description": "Erro interno ao processar a solicitação."
        },
    },
)
def obter_grafico(
    perfil: PerfilEnum = Query(
        ...,
        description="Perfil do usuário: PRODUTOR, TECNICO ou GESTOR."
    ),
    cultura: str = Query(
        ..., 
        description="Cultura agrícola (consulte GET /culturas/ para ver as disponíveis)."
        ),
    de: int = Query(
        ...,
        ge=2015,
        le=2022,
        description="Ano inicial do período de análise."
    ),
    ate: int = Query(
        ...,
        ge=2015,
        le=2022,
        description="Ano final do período de análise."
    ),
    municipio_codigo: int | None = Query(
        None,
        description="Código IBGE do município (obtido em GET /municipios/). Obrigatório para PRODUTOR e TECNICO."
    ),
):
    # PERFIS VÁLIDOS
    perfis_validos = {
        "PRODUTOR",
        "TECNICO",
        "GESTOR"
    }
    try:
        df = get_db()

        culturas_validas = set(df["produto"].dropna().str.lower().unique())
        if cultura.lower() not in culturas_validas:
            raise HTTPException(status_code=404, detail="cultura_inexistente")

        cultura = cultura.lower()

        # CONVERTE ENUM PARA VALOR
        perfil = perfil.value

        # VALIDA PERFIL
        if perfil not in perfis_validos:
            raise HTTPException(
                status_code=400,
                detail="Perfil inválido. Use PRODUTOR, TECNICO ou GESTOR."
            )

        # VALIDA CULTURA
        if cultura not in culturas_validas:
            raise HTTPException(
                status_code=400,
                detail="Cultura inválida."
            )

        # VALIDA PERÍODO
        if de > ate:
            raise HTTPException(
                status_code=400,
                detail="O ano inicial não pode ser maior que o ano final."
            )

        # VALIDA MUNICÍPIO
        if perfil != "GESTOR" and not municipio_codigo:
            raise HTTPException(status_code=400, detail="Informe um município (municipio_codigo).")


        # --- Valida se o código de município existe na base ---
        if municipio_codigo is not None:
            if municipio_codigo not in df["municipio_codigo"].values:
                raise HTTPException(
                    status_code=404,
                    detail="municipio_inexistente"
                )

        municipios_int = [municipio_codigo] if municipio_codigo else None

        df_filtrado = aplicar_filtros(df, cultura, de, ate, municipios_int)

        if df_filtrado.empty:
            raise HTTPException(status_code=404, detail="Nenhum dado encontrado para os filtros informados.")

        figura = solicitar_figura(df_filtrado, cultura, de, ate, perfil)

        kpis = solicitar_kpis(
            df_filtrado,
            perfil,
            df_completo=df,
            cultura=cultura,
            ate=ate,
            municipios=municipios_int,
        )

        return {"figura": figura, "kpis": kpis}

    except HTTPException:
        raise
    except Exception as erro:
        print("ERRO:", erro)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Erro interno ao processar a solicitação.")
    