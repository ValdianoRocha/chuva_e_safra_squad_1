import pandas as pd

# Caixa geográfica aproximada do Ceará (mesma referência usada na ingestão,
# em montar_dados_coordenadas / verificar_coordenadas_suspeitas).
# Como a Open-Meteo (buscar_coordenadas) não devolve país/UF junto com a
# coordenada, usamos essa faixa como validação indireta de
# "país = Brasil, UF = Ceará": se a coordenada cair fora dela, o geocoding
# provavelmente "casou" com um lugar errado (nome duplicado em outro estado
# ou país).
CE_LAT_MIN, CE_LAT_MAX = -7.9, -2.8
CE_LON_MIN, CE_LON_MAX = -41.4, -37.0


def validar_geocoding(df):
    """
    Card 1 - Valida se o município retornado pelo geocoding (Open-Meteo)
    de fato corresponde ao município consultado no IBGE, para o Ceará.

    Regras aplicadas (nessa ordem):
      1. latitude e longitude precisam estar preenchidas
      2. municipio_codigo precisa começar com "23" -> código de UF do IBGE
         para o Ceará (a lista de municípios já vem filtrada por
         estado_codigo=23 na ingestão, então isso confirma que o registro
         é realmente do Ceará e não foi corrompido/misturado)
      3. a coordenada precisa cair dentro da faixa geográfica aproximada
         do Ceará -> validação indireta de país=Brasil / UF=Ceará

    Retorna (df_validos, df_inconsistencias). Em caso de colunas faltando,
    devolve dois DataFrames vazios e imprime um aviso (não derruba o
    pipeline).
    """
    colunas_necessarias = ["municipio_codigo", "nome", "latitude", "longitude"]

    faltando = [c for c in colunas_necessarias if c not in df.columns]
    if faltando:
        print(f"[validar_geocoding] AVISO: colunas ausentes no DataFrame: {faltando}")
        return pd.DataFrame(), pd.DataFrame()

    validos = []
    inconsistencias = []

    for _, linha in df.iterrows():
        erro = None

        if pd.isna(linha["latitude"]):
            erro = "latitude_ausente"
        elif pd.isna(linha["longitude"]):
            erro = "longitude_ausente"
        elif not str(linha["municipio_codigo"]).startswith("23"):
            erro = "codigo_ibge_fora_do_ceara"
        elif not (CE_LAT_MIN <= float(linha["latitude"]) <= CE_LAT_MAX):
            erro = "latitude_fora_da_faixa_esperada_ce"
        elif not (CE_LON_MIN <= float(linha["longitude"]) <= CE_LON_MAX):
            erro = "longitude_fora_da_faixa_esperada_ce"

        if erro:
            inconsistencias.append({
                "municipio_codigo": linha["municipio_codigo"],
                "nome": linha["nome"],
                "erro": erro,
            })
        else:
            validos.append(linha.to_dict())

    return pd.DataFrame(validos), pd.DataFrame(inconsistencias)


def municipios_nao_encontrados(df):
    """
    Card 2 (passo 1 do checklist) - identifica municípios sem coordenada
    (latitude ou longitude nula), para depois entrarem na estratégia de
    nova tentativa.
    """
    colunas_necessarias = ["latitude", "longitude"]
    faltando = [c for c in colunas_necessarias if c not in df.columns]
    if faltando:
        print(f"[municipios_nao_encontrados] AVISO: colunas ausentes no DataFrame: {faltando}")
        return pd.DataFrame()

    return df[df["latitude"].isna() | df["longitude"].isna()].copy()