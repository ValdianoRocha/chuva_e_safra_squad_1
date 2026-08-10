"""
dependencias.py

Orquestrador do pipeline completo de limpeza do projeto Chuva & Safra.

O arquivo não implementa regras de limpeza.
Ele apenas chama as funções existentes em cada módulo.

Fluxo:

ENTRADA
    ↓
carregar_dados.py
    ↓
Card 1 - Validar geocoding
    ↓
Card 2 - Tratar municípios não encontrados
    ↓
Card 3 - Validar estrutura SIDRA
    ↓
Card 4 - Padronizar tipos
    ↓
Card 5 - Tratar valores nulos
    ↓
Card 6 - Remover duplicados
    ↓
Card 7 - Padronizar municípios
    ↓
Card 8 - Gerar relatório
    ↓
DADOS LIMPOS
    ↓
Cruzamento / Merge
"""

import pandas as pd

# ============================================================
# ENTRADA - CARREGAMENTO DOS DADOS
# ============================================================

from .carregar_dados import (
    carregar_municipio_coordenada,
    carregar_producao_agricola,
    carregar_clima_diario,
)

# ============================================================
# CARD 1 - VALIDAR GEOCODING
# ============================================================

from .validar_geocoding import (
    validar_geocoding,
    municipios_nao_encontrados,
)

# ============================================================
# CARD 2 - TRATAR MUNICÍPIOS NÃO ENCONTRADOS
# ============================================================

from .tratar_nao_encontrados import (
    tratar_nao_encontrados,
)

# ============================================================
# CARD 3 - VALIDAR ESTRUTURA SIDRA
# ============================================================

from .validar_estrutura_sidra import (
    validar_estrutura_sidra,
)

# ============================================================
# CARD 4 - PADRONIZAR TIPOS
# ============================================================

from .padronizar_tipos import (
    padronizar_tipos,
)

# ============================================================
# CARD 5 - TRATAR NULOS
# ============================================================

from .tratar_nulos import (
    tratar_nulos,
)

# ============================================================
# CARD 6 - REMOVER DUPLICADOS
# ============================================================

from .remover_duplicados import (
    remover_duplicados,
)

# ============================================================
# CARD 7 - PADRONIZAR MUNICÍPIOS
# ============================================================

from .padronizar_municipios import (
    padronizar_municipios,
)

# ============================================================
# CARD 8 - GERAR RELATÓRIO
# ============================================================

from .gerar_relatorio import (
    gerar_relatorio,
)


# ============================================================
# PIPELINE COMPLETO
# ============================================================

def executar_limpeza():
    """
    Executa todo o pipeline de limpeza.

    Retorna:

        {
            "df_geocoding": DataFrame,
            "df_producao": DataFrame,
            "df_clima": DataFrame,
            "relatorios": dict
        }
    """

    # --------------------------------------------------------
    # CARREGAMENTO
    # --------------------------------------------------------

    df_geo_bruto = carregar_municipio_coordenada()
    df_producao = carregar_producao_agricola()
    df_clima = carregar_clima_diario()

    # --------------------------------------------------------
    # CARD 1 - VALIDAR GEOCODING
    # --------------------------------------------------------

    (
        df_geocoding,
        geocoding_inconsistencias,
    ) = validar_geocoding(df_geo_bruto)

    geocoding_faltantes = municipios_nao_encontrados(
        df_geo_bruto
    )

    # --------------------------------------------------------
    # CARD 2 - TRATAR MUNICÍPIOS NÃO ENCONTRADOS
    # --------------------------------------------------------

    municipios_resolvidos = pd.DataFrame()
    relatorio_nao_encontrados = pd.DataFrame()

    try:
        from external_apis.openmeteo_api import buscar_coordenadas

        (
            municipios_resolvidos,
            relatorio_nao_encontrados,
        ) = tratar_nao_encontrados(
            geocoding_faltantes,
            buscar_coordenadas,
        )

        if not municipios_resolvidos.empty:
            df_geocoding = pd.concat(
                [
                    df_geocoding,
                    municipios_resolvidos,
                ],
                ignore_index=True,
            )

    except ImportError:
        relatorio_nao_encontrados = (
            geocoding_faltantes.copy()
        )

    # --------------------------------------------------------
    # REVALIDAÇÃO DO GEOCODING
    # --------------------------------------------------------

    if not municipios_resolvidos.empty:

        (
            df_geocoding_validado,
            novas_inconsistencias,
        ) = validar_geocoding(df_geocoding)

        df_geocoding = df_geocoding_validado

        if not novas_inconsistencias.empty:
            geocoding_inconsistencias = pd.concat(
                [
                    geocoding_inconsistencias,
                    novas_inconsistencias,
                ],
                ignore_index=True,
            )

    # --------------------------------------------------------
    # CARD 3 - VALIDAR ESTRUTURA SIDRA
    # --------------------------------------------------------

    erros_estrutura_sidra = validar_estrutura_sidra(
        df_producao
    )

    # --------------------------------------------------------
    # CARD 4 - PADRONIZAR TIPOS
    # --------------------------------------------------------

    df_geocoding = padronizar_tipos(df_geocoding)
    df_producao = padronizar_tipos(df_producao)
    df_clima = padronizar_tipos(df_clima)

    # --------------------------------------------------------
    # CARD 5 - TRATAR NULOS
    # --------------------------------------------------------

    (
        df_producao,
        log_nulos_producao,
    ) = tratar_nulos(df_producao)

    (
        df_clima,
        log_nulos_clima,
    ) = tratar_nulos(df_clima)

    (
        df_geocoding,
        log_nulos_geocoding,
    ) = tratar_nulos(df_geocoding)

    # --------------------------------------------------------
    # CARD 6 - REMOVER DUPLICADOS
    # --------------------------------------------------------

    (
        df_producao,
        duplicatas_producao,
    ) = remover_duplicados(
        df_producao,
        colunas_chave=[
            "municipio_codigo",
            "ano",
            "produto",
        ],
    )

    (
        df_clima,
        duplicatas_clima,
    ) = remover_duplicados(
        df_clima,
        colunas_chave=[
            "municipio_codigo",
            "data",
        ],
    )

    (
        df_geocoding,
        duplicatas_geocoding,
    ) = remover_duplicados(
        df_geocoding,
        colunas_chave=[
            "municipio_codigo",
        ],
    )

    # --------------------------------------------------------
    # CARD 7 - PADRONIZAR MUNICÍPIOS
    # --------------------------------------------------------

    df_geocoding = padronizar_municipios(
        df_geocoding
    )

    # --------------------------------------------------------
    # CARD 8 - GERAR RELATÓRIOS
    # --------------------------------------------------------

    qualidade_geocoding = gerar_relatorio(
        df_geocoding
    )

    qualidade_producao = gerar_relatorio(
        df_producao
    )

    qualidade_clima = gerar_relatorio(
        df_clima
    )

    # --------------------------------------------------------
    # RELATÓRIOS
    # --------------------------------------------------------

    relatorios = {
        "geocoding_inconsistencias":
            geocoding_inconsistencias,

        "geocoding_faltantes":
            geocoding_faltantes,

        "municipios_resolvidos":
            municipios_resolvidos,

        "relatorio_nao_encontrados":
            relatorio_nao_encontrados,

        "erros_estrutura_sidra":
            erros_estrutura_sidra,

        "log_nulos_producao":
            log_nulos_producao,

        "log_nulos_clima":
            log_nulos_clima,

        "log_nulos_geocoding":
            log_nulos_geocoding,

        "duplicatas_producao":
            duplicatas_producao,

        "duplicatas_clima":
            duplicatas_clima,

        "duplicatas_geocoding":
            duplicatas_geocoding,

        "qualidade_geocoding":
            qualidade_geocoding,

        "qualidade_producao":
            qualidade_producao,

        "qualidade_clima":
            qualidade_clima,
    }

    # --------------------------------------------------------
    # RESULTADO
    # --------------------------------------------------------

    return {
        "df_geocoding": df_geocoding,
        "df_producao": df_producao,
        "df_clima": df_clima,
        "relatorios": relatorios,
    }


# ============================================================
# EXECUÇÃO DIRETA
# ============================================================

if __name__ == "__main__":

    resultado = executar_limpeza()

    print("\n=== LIMPEZA CONCLUÍDA ===")

    print(
        f"Produção: {len(resultado['df_producao'])} registros"
    )

    print(
        f"Clima: {len(resultado['df_clima'])} registros"
    )

    print(
        f"Geocoding: {len(resultado['df_geocoding'])} municípios"
    )

    erros = resultado["relatorios"]["erros_estrutura_sidra"]

    if erros:
        print("\n⚠️ AVISOS SIDRA:")
        for erro in erros:
            print(f"- {erro}")

    print("\n=== QUALIDADE ===")

    print(
        "Produção:",
        resultado["relatorios"]["qualidade_producao"]
    )

    print(
        "Clima:",
        resultado["relatorios"]["qualidade_clima"]
    )

    print(
        "Geocoding:",
        resultado["relatorios"]["qualidade_geocoding"]
    )