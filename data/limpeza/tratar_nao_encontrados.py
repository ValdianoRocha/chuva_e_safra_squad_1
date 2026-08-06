import unicodedata

import pandas as pd


def remover_acentos(texto):
    if not isinstance(texto, str):
        return texto
    texto = unicodedata.normalize("NFKD", texto)
    return "".join(c for c in texto if not unicodedata.combining(c))


def gerar_nomes_alternativos(nome):
    """
    Gera variações do nome do município para tentar de novo no geocoding:
      - sem acento
      - com hífen no lugar de espaço e vice-versa
      - com sufixo de UF/país (ajuda a Open-Meteo a desambiguar)
    """
    nome = nome.strip()
    variantes = [
        nome,
        remover_acentos(nome),
        nome.replace(" ", "-"),
        nome.replace("-", " "),
        f"{nome}, CE",
        f"{remover_acentos(nome)}, Ceara, Brasil",
    ]
    # remove duplicadas mantendo a ordem
    vistas = set()
    unicas = []
    for v in variantes:
        if v and v not in vistas:
            vistas.add(v)
            unicas.append(v)
    return unicas


def tratar_nao_encontrados(df_faltantes, funcao_geocoding, max_tentativas=3):
    """
    Card 2 - Para cada município sem coordenada, tenta de novo com nomes
    alternativos (sem acento, com sufixo de UF, etc.). O que não resolver
    em nenhuma tentativa é registrado no relatório como falha para análise
    manual.

    Parâmetros:
      df_faltantes: DataFrame com pelo menos as colunas
                    ["municipio_codigo", "nome"] (saída de
                    municipios_nao_encontrados)
      funcao_geocoding: callable(nome_str) -> dict com "latitude"/"longitude"
                        ou None se não encontrou. É a função real que chama
                        a API (ex: buscar_coordenadas da colega).

    Retorna (df_resolvidos, df_relatorio).
    """
    if df_faltantes.empty:
        return pd.DataFrame(), pd.DataFrame()

    resolvidos = []
    linhas_relatorio = []

    for _, linha in df_faltantes.iterrows():
        municipio_codigo = linha["municipio_codigo"]
        nome = linha["nome"]

        variantes = gerar_nomes_alternativos(nome)[:max_tentativas]
        status = "falha_analise_manual"
        variante_usada = None
        coordenada = None

        for variante in variantes:
            try:
                resultado = funcao_geocoding(variante)
            except Exception as erro:
                linhas_relatorio.append({
                    "municipio_codigo": municipio_codigo,
                    "nome": nome,
                    "variante_tentada": variante,
                    "status": "erro_na_chamada",
                    "detalhe": str(erro),
                })
                continue

            if resultado and resultado.get("latitude") is not None and resultado.get("longitude") is not None:
                status = "resolvido"
                variante_usada = variante
                coordenada = resultado
                break

        if status == "resolvido":
            resolvidos.append({
                "municipio_codigo": municipio_codigo,
                "nome": nome,
                "latitude": coordenada["latitude"],
                "longitude": coordenada["longitude"],
            })
            linhas_relatorio.append({
                "municipio_codigo": municipio_codigo,
                "nome": nome,
                "variante_tentada": variante_usada,
                "status": "resolvido",
                "detalhe": "encontrado em nova tentativa",
            })
        else:
            linhas_relatorio.append({
                "municipio_codigo": municipio_codigo,
                "nome": nome,
                "variante_tentada": "; ".join(variantes),
                "status": "falha_analise_manual",
                "detalhe": "nenhuma variante retornou coordenada válida",
            })

    return pd.DataFrame(resolvidos), pd.DataFrame(linhas_relatorio)