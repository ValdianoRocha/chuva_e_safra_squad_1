# Contrato de API — FastAPI × Express

**Versão:** 1.0
**Acordado em:** [data]
**Partes:** Turma Fullstack · Turma de Dados

---

## Endpoint

GET /grafico

---

## Parâmetros

| Parâmetro  | Tipo   | Obrigatório | Descrição |
|------------|--------|-------------|-----------|
| perfil     | string | Sim         | PRODUTOR, TECNICO ou GESTOR |
| cultura    | string | Sim         | milho, feijao, mandioca, caju, banana |
| de         | number | Sim         | Ano inicial (2015 a 2022) |
| ate        | number | Sim         | Ano final (2015 a 2022) |
| municipios | string | Condicional | Código IBGE. Múltiplos via &municipios=x&municipios=y. Não enviado para GESTOR. |

---

## Resposta — PRODUTOR

{
  "figura": { "data": [...], "layout": {...} },
  "kpis": {
    "produtividade_media": "1.842 kg/ha",
    "chuva_total": "6.430 mm",
    "tendencia": "crescente"
  }
}

---

## Resposta — TECNICO

{
  "figura": { "data": [...], "layout": {...} },
  "kpis": {
    "produtividade_media": "2.100 kg/ha",
    "chuva_total": "7.200 mm",
    "tendencia": "estável",
    "tabela": [
      {
        "municipio": "Amontada",
        "codigo": "2300101",
        "produtividade_media": "2.100 kg/ha",
        "chuva_total": "7.200 mm"
      }
    ]
  }
}

---

## Resposta — GESTOR

{
  "figura": { "data": [...], "layout": {...} },
  "kpis": {
    "produtividade_media": "1.950 kg/ha",
    "chuva_total": "6.800 mm",
    "total_municipios": 184,
    "municipios_risco": ["Parambu", "Aiuaba"],
    "tabela": [
      {
        "municipio": "Amontada",
        "codigo": "2300101",
        "produtividade_media": "2.100 kg/ha",
        "ranking": 1
      }
    ]
  }
}

---

## Município sem dado climático

[Definir com a turma de Dados: retorna 200 com campos null, ou omite o município?]

---

## URLs

Mock (desenvolvimento): [URL a preencher]
Produção: [URL a preencher]

---

## Changelog

| Data | Versão | Mudança |
|------|--------|---------|
| [data] | 1.0 | Versão inicial |

