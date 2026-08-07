from database.db import engine, Base
from models.models import MunicipioCoordenada, ProducaoAgricola, ClimaDiario

# Cria todas as tabelas registradas na Base (se ainda não existirem)
Base.metadata.create_all(bind=engine)

print("Tabelas criadas com sucesso:")
print("- municipio_coordenada")
print("- producao_agricola")
print("- clima_diario")