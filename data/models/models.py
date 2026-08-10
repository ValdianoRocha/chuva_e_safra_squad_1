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


class ChuvaSafraMerge(Base):
    __tablename__ = "chuva_safra_merge"

    id = Column(Integer, primary_key=True, autoincrement=True)

    municipio_codigo = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False)
    produto = Column(String, nullable=False)

    area_plantada_ha = Column(Float)
    area_colhida_ha = Column(Float)
    quantidade_produzida_ton = Column(Float)
    rendimento_medio_kg_ha = Column(Float)
    valor_producao_mil_reais = Column(Float)

    precipitacao_total_mm_T1 = Column(Float)
    precipitacao_total_mm_T2 = Column(Float)
    precipitacao_total_mm_T3 = Column(Float)
    precipitacao_total_mm_T4 = Column(Float)

    precipitacao_media_mm_T1 = Column(Float)
    precipitacao_media_mm_T2 = Column(Float)
    precipitacao_media_mm_T3 = Column(Float)
    precipitacao_media_mm_T4 = Column(Float)

    dias_com_chuva_T1 = Column(Integer)
    dias_com_chuva_T2 = Column(Integer)
    dias_com_chuva_T3 = Column(Integer)
    dias_com_chuva_T4 = Column(Integer)

    temperatura_media_c_T1 = Column(Float)
    temperatura_media_c_T2 = Column(Float)
    temperatura_media_c_T3 = Column(Float)
    temperatura_media_c_T4 = Column(Float)

    temperatura_maxima_c_T1 = Column(Float)
    temperatura_maxima_c_T2 = Column(Float)
    temperatura_maxima_c_T3 = Column(Float)
    temperatura_maxima_c_T4 = Column(Float)

    nome = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

    __table_args__ = (
        UniqueConstraint(
            "municipio_codigo",
            "ano",
            "produto",
            name="uq_chuva_safra_merge"
        ),
    )

