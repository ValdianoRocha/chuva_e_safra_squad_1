"""
carregar_dados.py

NÃO faz parte dos 8 cards de limpeza - é só a "ponte" entre o banco de
dados (preenchido pela ingestão) e as funções de limpeza, que esperam
receber DataFrames prontos.

Uso típico:
    from carregar_dados import carregar_municipio_coordenada, carregar_producao_agricola, carregar_clima_diario

    df_geo = carregar_municipio_coordenada()
    df_producao = carregar_producao_agricola()
    df_clima = carregar_clima_diario()
"""

import pandas as pd

from database.db import SessionLocal, engine
from models.models import MunicipioCoordenada, ProducaoAgricola, ClimaDiario


def carregar_municipio_coordenada():
    """
    Lê a tabela municipio_coordenada e devolve um DataFrame com as colunas:
    municipio_codigo, nome, latitude, longitude.

    Serve de entrada para validar_geocoding() e municipios_nao_encontrados()
    (Cards 1 e 2).
    """
    db = SessionLocal()
    try:
        query = db.query(MunicipioCoordenada).statement
        df = pd.read_sql(query, engine)
        return df
    finally:
        # fecha a sessão mesmo se pd.read_sql der erro no meio do caminho
        db.close()


def carregar_producao_agricola():
    """
    Lê a tabela producao_agricola e devolve um DataFrame com as colunas:
    municipio_codigo, ano, produto, area_plantada_ha, area_colhida_ha,
    quantidade_produzida_ton, rendimento_medio_kg_ha, valor_producao_mil_reais.

    Serve de entrada para validar_estrutura_sidra(), padronizar_tipos(),
    tratar_nulos() e remover_duplicados() (Cards 3 a 6).
    """
    db = SessionLocal()
    try:
        query = db.query(ProducaoAgricola).statement
        df = pd.read_sql(query, engine)
        return df
    finally:
        db.close()


def carregar_clima_diario():
    """
    Lê a tabela clima_diario e devolve um DataFrame com as colunas:
    municipio_codigo, data, precipitacao_mm, temperatura_max_c.

    Serve de entrada para padronizar_tipos(), tratar_nulos() e
    gerar_relatorio() (valida "chuva possui data válida" do Card 8).
    """
    db = SessionLocal()
    try:
        query = db.query(ClimaDiario).statement
        df = pd.read_sql(query, engine)
        return df
    finally:
        db.close()


if __name__ == "__main__":
    df_geo = carregar_municipio_coordenada()
    print(f"municipio_coordenada: {len(df_geo)} linhas")
    print(df_geo.head())

    df_producao = carregar_producao_agricola()
    print(f"\nproducao_agricola: {len(df_producao)} linhas")
    print(df_producao.head())

    df_clima = carregar_clima_diario()
    print(f"\nclima_diario: {len(df_clima)} linhas")
    print(df_clima.head())