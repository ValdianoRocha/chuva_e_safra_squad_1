# import numpy as np
# import pandas as pd

# from get_db.get_db import get_db

# df = get_db()

# #so pra identificar se o arquivo e csv ou xlsx
# def processar_base_analitica(caminho_entrada: str, caminho_saida: str):

#     if caminho_entrada.endswith(".csv"):
#         df = pd.read_csv(caminho_entrada)
#     else:
#         df = pd.read_excel(caminho_entrada)

# #colhida e nula igual ou <0, ou a quantidade produzida e nula ou <0
#     condicao_invalida = (
#         df["area_colhida"].isna()
#         | (df["area_colhida"] <= 0)
#         | df["quantidade_produzida"].isna()
#         | (df["quantidade_produzida"] < 0)
#     )
# #Caso o registro seja invaido e prenchido como valor nulo
#     df_invalidos = df[condicao_invalida].copy()
#     caminho_invalidos = caminho_saida.replace(".", "_invalidos.")
#     df_invalidos.to_csv(caminho_invalidos, index=False)
#     print(
#         f"{len(df_invalidos)} registros invalidos salvos em: {caminho_invalidos}"
#     )
# #Gera a coluna produtividade
#     df["produtividade"] = np.where(
#         (df["area_colhida"] > 0) & (df["quantidade_produzida"] >= 0),
#         df["quantidade_produzida"] / df["area_colhida"],
#         np.nan,
#     )

#     df.to_csv(caminho_saida, index=False)
#     print(f"Base processada com sucesso e salva em: {caminho_saida}")

# if _name_ == "_main_":

#     ARQUIVO_ENTRADA = "dados_originais.csv"
#     ARQUIVO_SAIDA = "base_analitica.csv"

#     processar_base_analitica(ARQUIVO_ENTRADA, ARQUIVO_SAIDA)


# caucula o volume acumulado de precipitacao nos meses

import numpy as np
import pandas as pd
import json
import plotly.express as px
import plotly.graph_objects as go
import math

from get_db.get_db import get_db


def _soma_segura(series_valores):
    if series_valores.isna().all():
        return None
    return float(series_valores.sum(skipna=True))


def _limpar_nan(obj):
    if isinstance(obj, dict):
        return {k: _limpar_nan(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_limpar_nan(v) for v in obj]
    if isinstance(obj, float) and math.isnan(obj):
        return None
    try:
        if pd.isna(obj):
            return None
    except (TypeError, ValueError):
        pass
    return obj


# CARREGAR BASE DE DADOS

df = get_db()


# PREPARAR BASE PARA ANÁLISE

def preparar_base(df):
    # Cria uma cópia da base para não alterar o DataFrame original
    df = df.copy()

    # GERA A COLUNA DE PRODUTIVIDADE

    df["produtividade_ton_ha"] = np.where(
        (df["area_colhida_ha"] > 0)
        & (df["quantidade_produzida_ton"].notna()),
        df["quantidade_produzida_ton"] / df["area_colhida_ha"],
        np.nan,
    )

    # CALCULA A PRECIPITAÇÃO TOTAL DO ANO CIVIL

    # Usamos o ano civil porque ele captura o ciclo agrícola completo
    # e vai considerar chuvas atipicas que estão fora da quadra

    df["precipitacao_total_mm_ano_civil"] = (
        df["precipitacao_total_mm_T1"]
        + df["precipitacao_total_mm_T2"]
        + df["precipitacao_total_mm_T3"]
        + df["precipitacao_total_mm_T4"]
    )

    return df


# PREPARAR BASE ORIGINAL

df = preparar_base(df)


# IDENTIFICA REGISTROS SEM PRODUTIVIDADE

invalidos = df["produtividade_ton_ha"].isna().sum()

print(
    f"Registros sem produtividade calculada "
    f"(inválidos/zerados): {invalidos}"
)


# ESTATÍSTICAS DESCRITIVAS

colunas_interesse = [
    # Produção e Área
    "area_plantada_ha",
    "area_colhida_ha",
    "quantidade_produzida_ton",
    "produtividade_ton_ha",

    # Chuva por Trimestre e Ano Civil
    "precipitacao_total_mm_T1",
    "precipitacao_total_mm_T2",
    "precipitacao_total_mm_T3",
    "precipitacao_total_mm_T4",
    "precipitacao_total_mm_ano_civil",
]

tabela_estatisticas = df[colunas_interesse].agg(
    ["mean", "median", "max", "min", "std"]
)

# print("\n--- Estatísticas Descritivas ---")
# print(tabela_estatisticas)


# CORRELAÇÃO ENTRE CHUVA E PRODUTIVIDADE

colunas_chuva = [
    "precipitacao_total_mm_T1",
    "precipitacao_total_mm_T2",
    "precipitacao_total_mm_T3",
    "precipitacao_total_mm_T4",
]

correlacoes_chuva = df[colunas_chuva].corrwith(
    df["produtividade_ton_ha"]
)

# print(
#     "\n--- Correlação da Produtividade com Chuva "
#     "(Por Trimestre) ---"
# )

# print(correlacoes_chuva)


def interpretar_correlacao(
    r: float,
    nome_variavel: str
) -> str:
    """Classifica a força e a direção da correlação e retorna um texto interpretativo."""

    if pd.isna(r):
        return (
            f"{nome_variavel}: Não foi possível calcular "
            f"a correlação (dados insuficientes)."
        )

    abs_r = abs(r)

    if abs_r < 0.3:
        forca = "fraca"

    elif abs_r < 0.7:
        forca = "moderada"

    else:
        forca = "forte"

    if abs_r < 0.05:
        return (
            f"{nome_variavel} (r = {r:.4f}): "
            f"Correlação praticamente nula. "
            f"Não se observa padrão claro nesta amostra."
        )

    if r > 0:
        return (
            f"{nome_variavel} (r = {r:.4f}): "
            f"Correlação positiva {forca}. "
            f"Nos períodos mais chuvosos, observou-se "
            f"tendência de maior produtividade nesta amostra."
        )

    else:
        return (
            f"{nome_variavel} (r = {r:.4f}): "
            f"Correlação negativa {forca}. "
            f"Nos períodos mais chuvosos, observou-se "
            f"tendência de menor produtividade nesta amostra."
        )


# print(
#     "\n--- Interpretação das Correlações "
#     "(Sem Relação de Causa e Efeito) ---"
# )

# for col in colunas_chuva:
#     r_val = correlacoes_chuva[col]

#     print(
#         interpretar_correlacao(
#             r_val,
#             col
#         )
#     )


# IDENTIFICA COMPORTAMENTOS ATÍPICOS

media_chuva = df[
    "precipitacao_total_mm_ano_civil"
].mean()

media_produtividade = df[
    "produtividade_ton_ha"
].mean()


condicao_muita_chuva_baixa_prod = (
    (df["precipitacao_total_mm_ano_civil"] > media_chuva)
    &
    (df["produtividade_ton_ha"] < media_produtividade)
)


condicao_pouca_chuva_alta_prod = (
    (df["precipitacao_total_mm_ano_civil"] < media_chuva)
    &
    (df["produtividade_ton_ha"] > media_produtividade)
)


df["comportamento_atipico"] = np.select(
    [
        condicao_muita_chuva_baixa_prod,
        condicao_pouca_chuva_alta_prod
    ],
    [
        "Muita Chuva e Baixa Produtividade",
        "Pouca Chuva e Alta Produtividade"
    ],
    default="Padrão Esperado/Intermediário"
)


# TABELA DE MUNICÍPIOS ATÍPICOS

colunas_entregavel = [
    "municipio_codigo",
    "nome" if "nome" in df.columns else "municipio_codigo",
    "ano",
    "produto"
    if "produto" in df.columns
    else "quantidade_produzida_ton",
    "precipitacao_total_mm_ano_civil",
    "produtividade_ton_ha",
    "comportamento_atipico"
]


colunas_existentes = [
    col
    for col in colunas_entregavel
    if col in df.columns
]


tabela_municipios_atipicos = df[
    df["comportamento_atipico"]
    != "Padrão Esperado/Intermediário"
][colunas_existentes].sort_values(
    by="comportamento_atipico"
)


# print("\n--- Tabela de Municípios Atípicos ---")
# print(tabela_municipios_atipicos)


# PRODUTIVIDADE E CHUVA POR ANO

df_por_ano = (
    df.groupby("ano")
    .agg(
        produtividade_media_ton_ha=(
            "produtividade_ton_ha",
            "mean"
        ),
        produtividade_mediana_ton_ha=(
            "produtividade_ton_ha",
            "median"
        ),
        precipitacao_media_mm=(
            "precipitacao_total_mm_ano_civil",
            "mean"
        ),
        total_produzido_ton=(
            "quantidade_produzida_ton",
            "sum"
        ),
        area_colhida_total_ha=(
            "area_colhida_ha",
            "sum"
        ),
    )
    .reset_index()
)


# PRODUTIVIDADE E CHUVA POR MUNICÍPIO

coluna_nome = (
    "nome"
    if "nome" in df.columns
    else "municipio_codigo"
)


df_por_municipio = (
    df.groupby(
        [
            "municipio_codigo",
            coluna_nome
        ]
    )
    .agg(
        produtividade_media_ton_ha=(
            "produtividade_ton_ha",
            "mean"
        ),
        precipitacao_media_mm=(
            "precipitacao_total_mm_ano_civil",
            "mean"
        ),
        total_produzido_historico_ton=(
            "quantidade_produzida_ton",
            "sum"
        ),
    )
    .reset_index()
)


# TABELA PARA GRÁFICO DE DISPERSÃO

df_dispersao = df[
    [
        "municipio_codigo",
        coluna_nome,
        "ano",
        "precipitacao_total_mm_ano_civil",
        "produtividade_ton_ha",
        "quantidade_produzida_ton",
        "area_colhida_ha",
    ]
].dropna(
    subset=[
        "precipitacao_total_mm_ano_civil",
        "produtividade_ton_ha"
    ]
)


# TABELA PARA RANKINGS

df_ranking_produtividade = (
    df_por_municipio
    .sort_values(
        by="produtividade_media_ton_ha",
        ascending=False
    )
    .reset_index(drop=True)
)


df_ranking_precipitacao = (
    df_por_municipio
    .sort_values(
        by="precipitacao_media_mm",
        ascending=False
    )
    .reset_index(drop=True)
)


# DADOS UTILIZADOS PELOS GRÁFICOS

graficos = {
    "evolucao_anual": df_por_ano,
    "resumo_municipios": df_por_municipio,
    "dados_dispersao": df_dispersao,
    "ranking_produtividade": df_ranking_produtividade,
    "ranking_precipitacao": df_ranking_precipitacao,
}


# APLICAR FILTROS

def aplicar_filtros(
    df,
    cultura,
    de,
    ate,
    municipios=None
):
    """
    Aplica os filtros de cultura, período e municípios
    sobre a base de dados.
    """

    # PREPARAR BASE PARA ANÁLISE
    df_filtrado = preparar_base(df)

    # Filtro por cultura
    if "cultura" in df_filtrado.columns:
        df_filtrado = df_filtrado[
            df_filtrado["cultura"] == cultura
        ]

    elif "produto" in df_filtrado.columns:
        df_filtrado = df_filtrado[
            df_filtrado["produto"] == cultura
        ]

    # Filtro por período
    df_filtrado = df_filtrado[
        (df_filtrado["ano"] >= de)
        &
        (df_filtrado["ano"] <= ate)
    ]

    # Filtro por municípios
    if municipios:
        df_filtrado = df_filtrado[
            df_filtrado["municipio_codigo"].isin(
                municipios
            )
        ]

    return df_filtrado


# SOLICITAR FIGURA


def solicitar_figura(df_filtrado, cultura, de, ate, perfil):
    """
    Gera a figura Plotly correspondente ao perfil do usuário
    e devolve como dict JSON-safe (fig.to_plotly_json()).
    """
    df_filtrado = preparar_base(df_filtrado)

    if perfil == "PRODUTOR":
        dados = (
            df_filtrado
            .groupby("ano", as_index=False)
            .agg(produtividade_media_ton_ha=("produtividade_ton_ha", "mean"))
            .sort_values("ano")
        )
        fig = px.line(
            dados, x="ano", y="produtividade_media_ton_ha", markers=True,
            title=f"Evolução da produtividade — {cultura.capitalize()} ({de}-{ate})",
            labels={"ano": "Ano", "produtividade_media_ton_ha": "Produtividade (ton/ha)"},
        )

    elif perfil == "TECNICO":
        dados = (
            df_filtrado
            .groupby(["municipio_codigo", "nome"], as_index=False)
            .agg(produtividade_media_ton_ha=("produtividade_ton_ha", "mean"))
            .sort_values("produtividade_media_ton_ha", ascending=False)
        )
        fig = px.bar(
            dados, x="produtividade_media_ton_ha", y="nome", orientation="h",
            title=f"Ranking de produtividade — {cultura.capitalize()} ({de}-{ate})",
            labels={"produtividade_media_ton_ha": "Produtividade (ton/ha)", "nome": "Município"},
        )
        fig.update_layout(yaxis={"categoryorder": "total ascending"})

    elif perfil == "GESTOR":
        dados = (
            df_filtrado
            .groupby("ano", as_index=False)
            .agg(produtividade_media_ton_ha=("produtividade_ton_ha", "mean"))
            .sort_values("ano")
        )
        fig = px.line(
            dados, x="ano", y="produtividade_media_ton_ha", markers=True,
            title=f"Evolução estadual da produtividade — {cultura.capitalize()} ({de}-{ate})",
        )

    else:
        fig = go.Figure()

    fig.update_layout(template="plotly_white", hovermode="x unified")

    return json.loads(fig.to_json())


# SOLICITAR KPIs da eveline

def solicitar_kpis(df_filtrado, perfil, df_completo, cultura, ate, municipios=None):
    """
    Calcula KPIs ricos por perfil, usando df_filtrado (já recortado por
    cultura/período/municípios) e df_completo (para comparar com o ano
    anterior, que pode estar fora do período filtrado).

    ano de referência = 'ate' (último ano do filtro).
    """
    df_filtrado = preparar_base(df_filtrado)
    df_completo = preparar_base(df_completo)

    colunas_chuva = [
        "precipitacao_total_mm_T1",
        "precipitacao_total_mm_T2",
        "precipitacao_total_mm_T3",
        "precipitacao_total_mm_T4",
    ]

    # ---------------- PRODUTOR ----------------
    if perfil == "PRODUTOR":
        municipio_codigo = municipios[0] if municipios else None
        if municipio_codigo is None:
            raise ValueError("PRODUTOR exige um município.")

        atual = df_filtrado[
            (df_filtrado["municipio_codigo"] == municipio_codigo)
            & (df_filtrado["ano"] == ate)
        ]
        if atual.empty:
            raise ValueError("Sem dados para o município/ano informados.")
        registro = atual.iloc[0]

        chuva_acumulada = _soma_segura(registro[colunas_chuva])

        anterior = df_completo[
            (df_completo["municipio_codigo"] == municipio_codigo)
            & (df_completo["produto"] == cultura)
            & (df_completo["ano"] == ate - 1)
        ]

        variacao_pct = None
        if not anterior.empty:
            prod_ant = anterior.iloc[0]["rendimento_medio_kg_ha"] if "rendimento_medio_kg_ha" in anterior.columns else None
            prod_atu = registro.get("rendimento_medio_kg_ha")
            if pd.notna(prod_ant) and pd.notna(prod_atu) and prod_ant != 0:
                variacao_pct = (prod_atu - prod_ant) / prod_ant * 100

        resultado = {
            "perfil": "PRODUTOR",
            "producao_total": registro.get("quantidade_produzida_ton"),
            "produtividade_media": registro.get("produtividade_ton_ha"),
            "chuva_acumulada": chuva_acumulada,
            "correlacao": None,
            "detalhes": {
                "municipio_codigo": municipio_codigo,
                "municipio_nome": registro.get("nome"),
                "produto": cultura,
                "ano": ate,
                "variacao_produtividade_pct": variacao_pct,
            },
        }
        return _limpar_nan(resultado)

    # ---------------- TECNICO ----------------
    if perfil == "TECNICO":
        df_regiao = df_filtrado.copy()
        df_regiao["chuva_acumulada_mm"] = df_regiao[colunas_chuva].apply(_soma_segura, axis=1)

        media_regional = df_regiao["produtividade_ton_ha"].mean(skipna=True)

        df_valido = df_regiao.dropna(subset=["produtividade_ton_ha"])
        mais_produtivo = menos_produtivo = None
        if not df_valido.empty:
            linha_max = df_valido.loc[df_valido["produtividade_ton_ha"].idxmax()]
            linha_min = df_valido.loc[df_valido["produtividade_ton_ha"].idxmin()]
            mais_produtivo = {
                "municipio_codigo": int(linha_max["municipio_codigo"]),
                "municipio_nome": linha_max.get("nome"),
                "produtividade_ton_ha": linha_max["produtividade_ton_ha"],
            }
            menos_produtivo = {
                "municipio_codigo": int(linha_min["municipio_codigo"]),
                "municipio_nome": linha_min.get("nome"),
                "produtividade_ton_ha": linha_min["produtividade_ton_ha"],
            }

        correlacao = None
        df_corr = df_regiao.dropna(subset=["chuva_acumulada_mm", "produtividade_ton_ha"])
        if len(df_corr) >= 2:
            correlacao = df_corr["chuva_acumulada_mm"].corr(df_corr["produtividade_ton_ha"])

        num_municipios = df_regiao["municipio_codigo"].nunique()

        resultado = {
            "perfil": "TECNICO",
            "producao_total": None,
            "produtividade_media": media_regional,
            "chuva_acumulada": None,
            "correlacao": correlacao,
            "correlacao_confiavel": num_municipios >= 5,
            "detalhes": {
                "produto": cultura,
                "ano_referencia": ate,
                "num_municipios": num_municipios,
                "municipio_mais_produtivo": mais_produtivo,
                "municipio_menos_produtivo": menos_produtivo,
            },
        }
        return _limpar_nan(resultado)

    # ---------------- GESTOR ----------------
    if perfil == "GESTOR":
        df_atual = df_filtrado[df_filtrado["ano"] == ate].copy()
        if df_atual.empty:
            raise ValueError("Sem dados para o ano informado.")
        df_atual["chuva_acumulada_mm"] = df_atual[colunas_chuva].apply(_soma_segura, axis=1)

        producao_total = df_atual["quantidade_produzida_ton"].sum(skipna=True)
        produtividade_media = df_atual["produtividade_ton_ha"].mean(skipna=True)
        num_municipios = df_atual["municipio_codigo"].nunique()

        df_anterior = df_completo[
            (df_completo["produto"] == cultura) & (df_completo["ano"] == ate - 1)
        ].copy()
        df_anterior["chuva_acumulada_mm"] = df_anterior[colunas_chuva].apply(_soma_segura, axis=1)

        queda_produtividade, reducao_chuva = [], []
        if not df_anterior.empty:
            comparativo = df_atual.merge(
                df_anterior[["municipio_codigo", "produtividade_ton_ha", "chuva_acumulada_mm"]],
                on="municipio_codigo",
                suffixes=("_atual", "_anterior"),
            )
            queda = comparativo[
                comparativo["produtividade_ton_ha_atual"] < comparativo["produtividade_ton_ha_anterior"]
            ]
            queda_produtividade = [
                {
                    "municipio_codigo": int(r["municipio_codigo"]),
                    "municipio_nome": r.get("nome"),
                    "produtividade_atual": r["produtividade_ton_ha_atual"],
                    "produtividade_anterior": r["produtividade_ton_ha_anterior"],
                }
                for _, r in queda.iterrows()
            ]
            chuva_menor = comparativo[
                comparativo["chuva_acumulada_mm_atual"] < comparativo["chuva_acumulada_mm_anterior"]
            ]
            reducao_chuva = [
                {
                    "municipio_codigo": int(r["municipio_codigo"]),
                    "municipio_nome": r.get("nome"),
                    "chuva_atual_mm": r["chuva_acumulada_mm_atual"],
                    "chuva_anterior_mm": r["chuva_acumulada_mm_anterior"],
                }
                for _, r in chuva_menor.iterrows()
            ]

        # ranking + municípios em risco (mantido do que já existia)
        ranking = (
            df_atual.groupby(["municipio_codigo", "nome"], dropna=False, as_index=False)
            .agg(produtividade_media_ton_ha=("produtividade_ton_ha", "mean"))
            .sort_values("produtividade_media_ton_ha", ascending=False)
            .reset_index(drop=True)
        )
        ranking["ranking"] = ranking.index + 1
        media_geral = ranking["produtividade_media_ton_ha"].mean()
        municipios_risco = ranking[ranking["produtividade_media_ton_ha"] < media_geral]["nome"].dropna().tolist()

        resultado = {
            "perfil": "GESTOR",
            "producao_total": producao_total,
            "produtividade_media": produtividade_media,
            "chuva_acumulada": None,
            "correlacao": None,
            "detalhes": {
                "produto": cultura,
                "ano": ate,
                "num_municipios_analisados": num_municipios,
                "municipios_com_queda_produtividade": queda_produtividade,
                "municipios_com_reducao_chuva": reducao_chuva,
                "municipios_risco": municipios_risco,
                "ranking": ranking.to_dict(orient="records"),
            },
        }
        return _limpar_nan(resultado)

    raise ValueError("Perfil inválido")