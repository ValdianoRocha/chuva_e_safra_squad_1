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


if __name__ == "__main__":
    import pandas as pd

    df_teste = pd.DataFrame([
        {"municipio_codigo": "2300101", "ano": 2020, "produto": "milho", "valor_producao_mil_reais": 900},
        {"municipio_codigo": "2300101", "ano": 2020, "produto": "milho", "valor_producao_mil_reais": 900},
        {"municipio_codigo": "2300150", "ano": 2020, "produto": "feijao", "valor_producao_mil_reais": 300},
    ])

    print("--- Antes de remover duplicatas ---")
    print(df_teste)

    df_sem_dup, relatorio = remover_duplicados(df_teste, colunas_chave=["municipio_codigo", "ano", "produto"])

    print("\n--- Card 6: remover_duplicados ---")
    print(df_sem_dup)
    print(f"\nrelatório: {relatorio}")