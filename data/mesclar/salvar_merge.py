"""
salvar_merge.py

Salva o DataFrame resultante do cruzamento
na tabela chuva_safra_merge do PostgreSQL.
"""

import pandas as pd
from sqlalchemy.dialects.postgresql import insert as pg_insert

from database.db import SessionLocal
from models.models import ChuvaSafraMerge


def salvar_merge(df: pd.DataFrame) -> int:
    """
    Salva os dados mergeados no banco.

    Não insere registros duplicados considerando:
        municipio_codigo + ano + produto

    O campo 'id' original do DataFrame é ignorado,
    pois a tabela possui seu próprio ID autoincrementável.

    Os registros são inseridos em lotes para evitar
    ultrapassar o limite de parâmetros do PostgreSQL.

    Retorna:
        Quantidade de registros inseridos.
    """

    if df is None or df.empty:
        print("DataFrame mergeado está vazio.")
        return 0

    # Remove o ID original
    df = df.drop(columns=["id"], errors="ignore")

    # Remove duplicados antes de enviar para o banco
    df = df.drop_duplicates(
        subset=["municipio_codigo", "ano", "produto"]
    )

    linhas = df.to_dict(orient="records")

    TAMANHO_LOTE = 500

    total_inserido = 0

    db = SessionLocal()

    try:
        for inicio in range(0, len(linhas), TAMANHO_LOTE):

            lote = linhas[inicio:inicio + TAMANHO_LOTE]

            print(
                f"Salvando lote "
                f"{inicio + 1} até "
                f"{min(inicio + TAMANHO_LOTE, len(linhas))} "
                f"de {len(linhas)}..."
            )

            stmt = pg_insert(ChuvaSafraMerge).values(lote)

            stmt = stmt.on_conflict_do_nothing(
                constraint="uq_chuva_safra_merge"
            )

            resultado = db.execute(stmt)

            total_inserido += resultado.rowcount

        db.commit()

        print(
            f"{total_inserido} registros inseridos "
            "na tabela 'chuva_safra_merge'."
        )

        return total_inserido

    except Exception as e:

        db.rollback()

        print(
            f"Erro ao salvar tabela "
            f"'chuva_safra_merge': {e}"
        )

        raise

    finally:
        db.close()

