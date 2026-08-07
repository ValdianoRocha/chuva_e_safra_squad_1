from sqlalchemy.dialects.postgresql import insert as pg_insert

from database.db import SessionLocal
from models.models import ProducaoAgricola
from external_apis.ibge_api import buscar_producao_bruta, PRODUTOS
from ingestao.tratar_ibge import tratar_producao


def gravar_producao(dados_tratados):
    """
    Recebe a lista de dicionários já tratados e grava todos de uma vez no
    banco (inserção em lote). Se a combinação (município, ano, produto) já
    existir, aquela linha é ignorada silenciosamente (ON CONFLICT DO NOTHING),
    sem quebrar o restante do lote.
    """
    db = SessionLocal()

    stmt = pg_insert(ProducaoAgricola).values(dados_tratados)
    stmt = stmt.on_conflict_do_nothing(constraint="uq_municipio_ano_produto")

    resultado = db.execute(stmt)
    db.commit()
    db.close()

    print(f"Linhas efetivamente inseridas: {resultado.rowcount}")
    print(f"Linhas ignoradas (já existiam): {len(dados_tratados) - resultado.rowcount}")


if __name__ == "__main__":
    estado_codigo = 23  # Ceará
    anos = list(range(2015, 2023))  # 2015 a 2022

    dados_brutos = buscar_producao_bruta(
        agregado=1612,
        estado_codigo=estado_codigo,
        anos=anos,
        produtos_codigos=list(PRODUTOS.values()),
    )

    dados_tratados = tratar_producao(dados_brutos)

    print(f"Total de linhas a gravar: {len(dados_tratados)}\n")

    gravar_producao(dados_tratados)