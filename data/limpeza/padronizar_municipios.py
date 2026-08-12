import re
import unicodedata

PREPOSICOES = {"de", "da", "do", "das", "dos", "e"}


def remover_acentos(texto):
    """Mantida para quem precisar de uma versão sem acento (ex: comparação de nomes)."""
    if not isinstance(texto, str):
        return texto
    texto = unicodedata.normalize("NFKD", texto)
    return "".join(c for c in texto if not unicodedata.combining(c))


def _limpar_espacos_e_invisiveis(texto):
    # remove caracteres invisíveis comuns (zero-width space, BOM, nbsp)
    # que às vezes vêm em nomes raspados de API/HTML
    texto = re.sub(r"[\u200b\u200c\u200d\ufeff\xa0]", " ", texto)
    # colapsa espaços duplos e remove espaço nas bordas
    return re.sub(r"\s+", " ", texto).strip()


def _capitalizar_com_preposicoes(nome):
    # str.title() do pandas deixa "do"/"da"/"dos" com inicial maiúscula
    # (ex: "São Gonçalo Do Amarante"), o que não é o padrão correto em
    # português. Aqui tratamos preposição à parte.
    palavras = nome.split(" ")
    resultado = []
    for i, palavra in enumerate(palavras):
        palavra_lower = palavra.lower()
        if i > 0 and palavra_lower in PREPOSICOES:
            resultado.append(palavra_lower)
        else:
            resultado.append(palavra_lower.capitalize())
    return " ".join(resultado)


def padronizar_municipios(df):
    """
    Card 7 - Padroniza a coluna "nome":
      - remove espaços extras e caracteres invisíveis
      - padroniza maiúsculas/minúsculas (Title Case, preposições em minúsculo)
      - mantém os acentos (o card pede para "padronizar" acentuação, não
        removê-la - remover deixaria o nome errado para exibição/relatório)
    """
    if "nome" not in df.columns:
        return df

    df = df.copy()
    df["nome"] = (
        df["nome"]
        .astype(str)
        .apply(_limpar_espacos_e_invisiveis)
        .apply(_capitalizar_com_preposicoes)
    )
    return df


if __name__ == "__main__":
    import pandas as pd

    df_teste = pd.DataFrame([
        {"nome": "  são   gonçalo do amarante "},
        {"nome": "ACARAPE"},
        {"nome": "barro"},
    ])

    print("--- Antes da padronização ---")
    print(df_teste)

    df_padronizado = padronizar_municipios(df_teste)

    print("\n--- Card 7: padronizar_municipios ---")
    print(df_padronizado)