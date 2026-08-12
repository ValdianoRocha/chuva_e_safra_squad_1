import pandas as pd
from database.db import SessionLocal, engine
from models.models import ChuvaSafraMerge


def get_db():
    """
    Lê a tabela ChuvaSafraMerge e devolve um DataFrame com colunas:

    """
    db = SessionLocal()
    try:
        query = db.query(ChuvaSafraMerge).statement
        df = pd.read_sql(query, engine)
        return df
    finally:
        # fecha a sessão mesmo se pd.read_sql der erro no meio do caminho
        db.close()
        
        
# print(get_db().head(20).to_string())