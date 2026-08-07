"""
dependencias.py

Não redefine nenhuma função - só importa (reexporta) as funções de cada
arquivo de limpeza, executa a sequência completa (1 a 9) e deixa os
resultados finais disponíveis para qualquer outro arquivo do projeto
importar, sem precisar conhecer os 9 módulos individuais.

Uso, de dentro de outro arquivo (ex: a etapa de Cruzamento/Merge):

    from limpeza.dependencias import df_geocoding, df_producao, df_clima, relatorios

Ou rodando direto no terminal, de dentro de data/:

    python -m limpeza.dependencias
"""

import pandas as pd

# ---- reexporta as funções de cada arquivo (não redefine nada aqui) ----
from carregar_dados import (
    carregar_municipio_coordenada,
    carregar_producao_agricola,
    carregar_clima_diario,
)
from validar_geocoding import validar_geocoding, municipios_nao_encontrados
from tratar_nao_encontrados import tratar_nao_encontrados, gerar_nomes_alternativos
from validar_estrutura_sidra import validar_estrutura_sidra
from padronizar_tipos import padronizar_tipos
from tratar_nulos import tratar_nulos
from remover_duplicados import remover_duplicados
from padronizar_municipios import padronizar_municipios, remover_acentos
from gerar_relatorio import gerar_relatorio

# ---- 1. carregar_dados.py ----
print("[1/9] Carregando dados do banco...")
df_geo_bruto = carregar_municipio_coordenada()
df_producao = carregar_producao_agricola()
df_clima = carregar_clima_diario()

# ---- 2. validar_geocoding.py (Card 1) ----
print("[2/9] Validando geocoding (Card 1)...")
df_geocoding, geocoding_inconsistencias = validar_geocoding(df_geo_bruto)
geocoding_faltantes = municipios_nao_encontrados(df_geo_bruto)

# ---- 3. tratar_nao_encontrados.py (Card 2) ----
print("[3/9] Tratando municípios não encontrados (Card 2)...")
try:
    from external_apis.openmeteo_api import buscar_coordenadas

    def _funcao_geocoding(nome):
        return buscar_coordenadas(nome)

    municipios_resolvidos, relatorio_nao_encontrados = tratar_nao_encontrados(
        geocoding_faltantes, _funcao_geocoding
    )
    if not municipios_resolvidos.empty:
        df_geocoding = pd.concat([df_geocoding, municipios_resolvidos], ignore_index=True)
except ImportError:
    print("  aviso: não foi possível importar buscar_coordenadas, etapa pulada")
    municipios_resolvidos = pd.DataFrame()
    relatorio_nao_encontrados = geocoding_faltantes

# ---- 4. validar_estrutura_sidra.py (Card 3) ----
print("[4/9] Validando estrutura do SIDRA (Card 3)...")
erros_estrutura_sidra = validar_estrutura_sidra(df_producao)
if erros_estrutura_sidra:
    for erro in erros_estrutura_sidra:
        print(f"  aviso: {erro}")

# ---- 5. padronizar_tipos.py (Card 4) ----
print("[5/9] Padronizando tipos (Card 4)...")
df_producao = padronizar_tipos(df_producao)
df_clima = padronizar_tipos(df_clima)

# ---- 6. tratar_nulos.py (Card 5) ----
print("[6/9] Tratando valores ausentes (Card 5)...")
df_producao, log_nulos_producao = tratar_nulos(df_producao)
df_clima, log_nulos_clima = tratar_nulos(df_clima)

# ---- 7. remover_duplicados.py (Card 6) ----
print("[7/9] Removendo duplicidades (Card 6)...")
df_producao, duplicatas_producao = remover_duplicados(
    df_producao, colunas_chave=["municipio_codigo", "ano", "produto"]
)
df_clima, duplicatas_clima = remover_duplicados(
    df_clima, colunas_chave=["municipio_codigo", "data"]
)

# ---- 8. padronizar_municipios.py (Card 7) ----
print("[8/9] Padronizando nomes de municípios (Card 7)...")
df_geocoding = padronizar_municipios(df_geocoding)

# ---- 9. gerar_relatorio.py (Card 8) ----
print("[9/9] Gerando relatório final de qualidade (Card 8)...")
qualidade_producao = gerar_relatorio(df_producao)
qualidade_clima = gerar_relatorio(df_clima)
qualidade_geocoding = gerar_relatorio(df_geocoding)

# ---- dicionário com todos os relatórios, pra quem importar não precisar
#      pegar variável por variável ----
relatorios = {
    "geocoding_inconsistencias": geocoding_inconsistencias,
    "geocoding_faltantes": geocoding_faltantes,
    "relatorio_nao_encontrados": relatorio_nao_encontrados,
    "erros_estrutura_sidra": erros_estrutura_sidra,
    "log_nulos_producao": log_nulos_producao,
    "log_nulos_clima": log_nulos_clima,
    "duplicatas_producao": duplicatas_producao,
    "duplicatas_clima": duplicatas_clima,
    "qualidade_producao": qualidade_producao,
    "qualidade_clima": qualidade_clima,
    "qualidade_geocoding": qualidade_geocoding,
}

print("\nLimpeza concluída.")
print(f"  geocoding: {len(df_geocoding)} municípios válidos")
print(f"  produção:  {len(df_producao)} linhas")
print(f"  clima:     {len(df_clima)} linhas")


if __name__ == "__main__":
    print("\n--- Relatório de qualidade: produção ---")
    print(qualidade_producao)
    print("\n--- Relatório de qualidade: clima ---")
    print(qualidade_clima)
    print("\n--- Relatório de qualidade: geocoding ---")
    print(qualidade_geocoding)