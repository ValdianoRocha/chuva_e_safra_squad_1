import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Carrega as variáveis do .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada. Verifique se o arquivo .env existe e está preenchido.")

# engine: é o que sabe "falar" com o Postgres
engine = create_engine(DATABASE_URL)

# Session: cada vez que formos gravar/ler algo no banco, abrimos uma sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base: todos os nossos models vão herdar dela
Base = declarative_base()

#Abre uma sessão com o banco e garante que ela é fechada no final.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()