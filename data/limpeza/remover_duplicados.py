def remover_duplicados(df, colunas_chave=None):
    """
    Card 6 - Remove registros duplicados.

    Por padrão (colunas_chave=None) compara todas as colunas, igual antes.
    Se você passar colunas_chave (ex: ["municipio_codigo", "ano", "produto"]),
    remove duplicatas considerando só essas colunas como identificador do
    registro - útil se duas linhas representam o mesmo registro mas com
    algum campo secundário diferente.
    """
    quantidade_inicial = len(df)

    df = df.drop_duplicates(subset=colunas_chave).reset_index(drop=True)

    quantidade_final = len(df)

    relatorio = {
        "colunas_chave": colunas_chave if colunas_chave else "todas as colunas",
        "antes": quantidade_inicial,
        "depois": quantidade_final,
        "removidos": quantidade_inicial - quantidade_final,
    }

    return df, relatorio