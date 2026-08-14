#import numpy as np
#import pandas as pd

#from get_db.get_db import get_db

#df = get_db()

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

from get_db.get_db import get_db

df = get_db()

df["produtividade_ton_ha"] = np.where(
    (df["area_colhida_ha"] > 0) & (df["quantidade_produzida_ton"].notna()),
    df["quantidade_produzida_ton"] / df["area_colhida_ha"],
    np.nan,
)

invalidos = df["produtividade_ton_ha"].isna().sum()
print(f"Registros sem produtividade calculada (inválidos/zerados): {invalidos}")

#Usamos o ano civil porque ele captura o ciclo agrícola completo e vai considerar chuvas atipicas que estão fora da quadra
df["precipitacao_total_mm_ano_civil"] = (
    df["precipitacao_total_mm_T1"]
    + df["precipitacao_total_mm_T2"]
    + df["precipitacao_total_mm_T3"]
    + df["precipitacao_total_mm_T4"]
)

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

tabela_estatisticas = df[colunas_interesse].agg(["mean", "median", "max", "min", "std"])

print("\n--- Estatísticas Descritivas ---")
print(tabela_estatisticas)

colunas_chuva = [
    "precipitacao_total_mm_T1",
    "precipitacao_total_mm_T2",
    "precipitacao_total_mm_T3",
    "precipitacao_total_mm_T4",
]

correlacoes_chuva = df[colunas_chuva].corrwith(df["produtividade_ton_ha"])

print("\n--- Correlação da Produtividade com Chuva (Por Trimestre) ---")
print(correlacoes_chuva)

def interpretar_correlacao(r: float, nome_variavel: str) -> str:
    """Classifica a força e a direção da correlação e retorna um texto interpretativo."""
    if pd.isna(r):
        return f"{nome_variavel}: Não foi possível calcular a correlação (dados insuficientes)."

    abs_r = abs(r)

    if abs_r < 0.3:
        forca = "fraca"
    elif abs_r < 0.7:
        forca = "moderada"
    else:
        forca = "forte"

    if abs_r < 0.05:
        return f"{nome_variavel} (r = {r:.4f}): Correlação praticamente nula. Não se observa padrão claro nesta amostra."

    if r > 0:
        return (
            f"{nome_variavel} (r = {r:.4f}): Correlação positiva {forca}. "
            f"Nos períodos mais chuvosos, observou-se tendência de maior produtividade nesta amostra."
        )
    else:
        return (
            f"{nome_variavel} (r = {r:.4f}): Correlação negativa {forca}. "
            f"Nos períodos mais chuvosos, observou-se tendência de menor produtividade nesta amostra."
        )

print("\n--- Interpretação das Correlações (Sem Relação de Causa e Efeito) ---")
for col in colunas_chuva:
    r_val = correlacoes_chuva[col]
    print(interpretar_correlacao(r_val, col))

media_chuva = df["precipitacao_total_mm_ano_civil"].mean()
media_produtividade = df["produtividade_ton_ha"].mean()

condicao_muita_chuva_baixa_prod = (
    (df["precipitacao_total_mm_ano_civil"] > media_chuva) & 
    (df["produtividade_ton_ha"] < media_produtividade)
)

condicao_pouca_chuva_alta_prod = (
    (df["precipitacao_total_mm_ano_civil"] < media_chuva) & 
    (df["produtividade_ton_ha"] > media_produtividade)
)

df["comportamento_atipico"] = np.select(
    [condicao_muita_chuva_baixa_prod, condicao_pouca_chuva_alta_prod],
    ["Muita Chuva e Baixa Produtividade", "Pouca Chuva e Alta Produtividade"],
    default="Padrão Esperado/Intermediário"
)

colunas_entregavel = [
    "municipio_codigo",
    "nome" if "nome" in df.columns else "municipio_codigo",
    "ano",
    "produto" if "produto" in df.columns else "quantidade_produzida_ton",
    "precipitacao_total_mm_ano_civil",
    "produtividade_ton_ha",
    "comportamento_atipico"
]

colunas_existentes = [col for col in colunas_entregavel if col in df.columns]

tabela_municipios_atipicos = df[
    df["comportamento_atipico"] != "Padrão Esperado/Intermediário"
][colunas_existentes].sort_values(by="comportamento_atipico")

print("\n--- Tabela de Municípios Atípicos ---")
print(tabela_municipios_atipicos)

import numpy as np
import pandas as pd

#PRODUTIVIDADE E CHUVA POR ANO
df_por_ano = (
    df.groupby("ano")
    .agg(
        produtividade_media_ton_ha=("produtividade_ton_ha", "mean"),
        produtividade_mediana_ton_ha=("produtividade_ton_ha", "median"),
        precipitacao_media_mm=("precipitacao_total_mm_ano_civil", "mean"),
        total_produzido_ton=("quantidade_produzida_ton", "sum"),
        area_colhida_total_ha=("area_colhida_ha", "sum"),
    )
    .reset_index()
)

#PRODUTIVIDADE E CHUVA POR MUNICÍPIO
coluna_nome = "nome" if "nome" in df.columns else "municipio_codigo"

df_por_municipio = (
    df.groupby(["municipio_codigo", coluna_nome])
    .agg(
        produtividade_media_ton_ha=("produtividade_ton_ha", "mean"),
        precipitacao_media_mm=("precipitacao_total_mm_ano_civil", "mean"),
        total_produzido_historico_ton=("quantidade_produzida_ton", "sum"),
    )
    .reset_index()
)

#TABELA PARA GRÁFICO DE DISPERSÃO
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
].dropna(subset=["precipitacao_total_mm_ano_civil", "produtividade_ton_ha"])

#TABELA PARA RANKINGS
df_ranking_produtividade = df_por_municipio.sort_values(
    by="produtividade_media_ton_ha", ascending=False
).reset_index(drop=True)

df_ranking_precipitacao = df_por_municipio.sort_values(
    by="precipitacao_media_mm", ascending=False
).reset_index(drop=True)

graficos = {
    "evolucao_anual": df_por_ano,
    "resumo_municipios": df_por_municipio,
    "dados_dispersao": df_dispersao,
    "ranking_produtividade": df_ranking_produtividade,
    "ranking_precipitacao": df_ranking_precipitacao,
}
