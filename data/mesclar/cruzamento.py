import pandas as pd

from limpeza.dependencias import executar_limpeza
from mesclar.salvar_merge import salvar_merge


def adicionar_trimestre(df_clima):
    df = df_clima.copy()

    if "data" not in df.columns:
        raise ValueError("A coluna 'data' não existe no DataFrame de clima.")

    df["data"] = pd.to_datetime(df["data"], errors="coerce")

    if df["data"].isna().any():
        quantidade = int(df["data"].isna().sum())
        raise ValueError(
            f"Existem {quantidade} datas inválidas no DataFrame de clima."
        )

    df["ano"] = df["data"].dt.year
    df["trimestre"] = "T" + df["data"].dt.quarter.astype(str)

    return df


def agregar_clima_trimestral(df_clima):
    df = adicionar_trimestre(df_clima)

    df["dia_com_chuva"] = (
        pd.to_numeric(df["precipitacao_mm"], errors="coerce")
        .fillna(0)
        .gt(0)
        .astype(int)
    )

    return (
        df.groupby(
            ["municipio_codigo", "ano", "trimestre"],
            as_index=False
        )
        .agg(
            precipitacao_total_mm=("precipitacao_mm", "sum"),
            precipitacao_media_mm=("precipitacao_mm", "mean"),
            dias_com_chuva=("dia_com_chuva", "sum"),
            temperatura_media_c=("temperatura_max_c", "mean"),
            temperatura_maxima_c=("temperatura_max_c", "max"),
        )
    )


def transformar_clima_em_colunas(df_clima_trimestral):
    indicadores = [
        "precipitacao_total_mm",
        "precipitacao_media_mm",
        "dias_com_chuva",
        "temperatura_media_c",
        "temperatura_maxima_c",
    ]

    df = df_clima_trimestral.pivot(
        index=["municipio_codigo", "ano"],
        columns="trimestre",
        values=indicadores,
    )

    df.columns = [
        f"{indicador}_{trimestre}"
        for indicador, trimestre in df.columns
    ]

    return df.reset_index()


def cruzar_producao_clima(df_producao, df_clima_anual):
    return pd.merge(
        df_producao,
        df_clima_anual,
        on=["municipio_codigo", "ano"],
        how="left",
        validate="many_to_one",
    )


def cruzar_geocoding(df, df_geocoding):
    colunas = [
        "municipio_codigo",
        "nome",
        "latitude",
        "longitude",
    ]

    colunas_existentes = [
        coluna
        for coluna in colunas
        if coluna in df_geocoding.columns
    ]

    df_geo = (
        df_geocoding[colunas_existentes]
        .drop_duplicates(subset=["municipio_codigo"])
    )

    return pd.merge(
        df,
        df_geo,
        on="municipio_codigo",
        how="left",
        validate="many_to_one",
    )


def validar_base_final(df):
    chave = [
        "municipio_codigo",
        "ano",
        "produto",
    ]

    faltantes = [
        coluna
        for coluna in chave
        if coluna not in df.columns
    ]

    if faltantes:
        raise ValueError(
            f"Colunas necessárias ausentes: {faltantes}"
        )

    duplicados = int(
        df.duplicated(subset=chave).sum()
    )

    if duplicados > 0:
        raise ValueError(
            f"A base final possui {duplicados} duplicados."
        )

    return {
        "total_linhas": len(df),
        "total_colunas": len(df.columns),
        "duplicados": duplicados,
        "municipios": df["municipio_codigo"].nunique(),
        "anos": df["ano"].nunique(),
        "produtos": df["produto"].nunique(),
    }


def executar_cruzamento(
    df_producao,
    df_clima,
    df_geocoding,
):
    # print("\n=== PRODUÇÃO ANTES DO MERGE ===")
    # print(df_producao.head(10).to_string())
    
    # print("\n=== PRODUTOS ANTES DO MERGE ===")
    # print(df_producao["produto"].value_counts())

    # print("\n=== PRODUTOS ÚNICOS ===")
    # print(sorted(df_producao["produto"].dropna().unique()))

    # print("\n=== TOTAL DE PRODUTOS ===")
    # print(df_producao["produto"].nunique())

    # print("\n=== TIPOS DA PRODUÇÃO ===")
    # print(df_producao.dtypes.to_string())

    df_clima_trimestral = agregar_clima_trimestral(
        df_clima
    )

    df_clima_anual = transformar_clima_em_colunas(
        df_clima_trimestral
    )

    df_merge = cruzar_producao_clima(
        df_producao,
        df_clima_anual,
    )

    df_final = cruzar_geocoding(
        df_merge,
        df_geocoding,
    )

    relatorio = validar_base_final(
        df_final
    )

    return df_final, relatorio


if __name__ == "__main__":
    resultado = executar_limpeza()

    df_geocoding = resultado["df_geocoding"]
    df_producao = resultado["df_producao"]
    df_clima = resultado["df_clima"]

    print("\nExecutando cruzamento...")

    df_final, relatorio_merge = executar_cruzamento(
        df_producao=df_producao,
        df_clima=df_clima,
        df_geocoding=df_geocoding,
    )
    # print("\n=== COLUNAS ===")
    # for i, coluna in enumerate(df_final.columns):
    #     print(i, repr(coluna))

    # print("\n=== TIPOS ===")
    # print(df_final.dtypes.to_string())
    
    # print("\n=== RELATÓRIO DO MERGE ===")
    # print(relatorio_merge)

    # print("\n=== BASE FINAL ===")
    # print(df_final.head(10).to_string())
    
    # print("\n=== PRODUTOS ===")
    # print(df_final["produto"].value_counts())
    
    print("\nCruzamento Finalizado...")
    
    # Salva a base final no banco 
    print("\nSalvando base final no banco...")
    
    quantidade_inserida = salvar_merge(df_final)
    # quantidade_inserida = 20
     
    
    print(
        f"\nProcesso concluído. " 
        f"{quantidade_inserida} registros inseridos." 
        )