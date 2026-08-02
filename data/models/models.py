from sqlalchemy import Column, Integer, String, Float, Date, UniqueConstraint
from database.db import Base

class MunicipioCoordenada(Base):
    __tablename__ = "municipio_coordenada"

    municipio_codigo = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)


class ClimaDiario(Base):
    __tablename__ = "clima_diario"

    id = Column(Integer, primary_key=True, autoincrement=True)

    municipio_codigo = Column(Integer, nullable=False)
    data = Column(Date, nullable=False)

    precipitacao_mm = Column(Float, nullable=True)
    temperatura_max_c = Column(Float, nullable=True)

    __table_args__ = (
        UniqueConstraint("municipio_codigo", "data", name="uq_municipio_data"),
    )


class ProducaoAgricola(Base):
    __tablename__ = "producao_agricola"

    id = Column(Integer, primary_key=True, autoincrement=True)

    municipio_codigo = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False)
    produto = Column(String, nullable=False)

    area_plantada_ha = Column(Float, nullable=True)
    area_colhida_ha = Column(Float, nullable=True)
    quantidade_produzida_ton = Column(Float, nullable=True)
    rendimento_medio_kg_ha = Column(Float, nullable=True)
    valor_producao_mil_reais = Column(Float, nullable=True)

    # Garante que não existam duas linhas com o mesmo município + ano + produto
    __table_args__ = (
        UniqueConstraint("municipio_codigo", "ano", "produto", name="uq_municipio_ano_produto"),
    )