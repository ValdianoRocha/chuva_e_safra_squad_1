# Limpeza de dados — chuva_e_safra_squad_1

Este módulo cobre os 8 cards de limpeza do board, cobrindo os dados de
geocoding (Open-Meteo), produção agrícola e clima (SIDRA/IBGE).

## Chaves para o Cruzamento (Merge)

| Junção | Coluna(s) de chave |
|---|---|
| `producao` ↔ `geocoding` | `municipio_codigo` |
| `clima` ↔ `geocoding` | `municipio_codigo` |
| `producao` ↔ `clima` | `municipio_codigo` (+ `ano`/`data`, se for cruzar por período) |

`municipio_codigo` já sai padronizado como **string** nas três bases, todos
os códigos do Ceará começando com `23`.

## O que já foi tratado em cada base

### Geocoding

- Só município com coordenadas válidas
- Municípios sem latitude ou longitude são identificados
- Registro de inconsistências
- Nomes padronizados (sem espaço extra, sem acentos, capitalização correta)

### Produção Agrícola

- Estrutura validada conforme o SIDRA
- Tipos corretos:
  - `ano` → inteiro
  - `municipio_codigo` → string
  - colunas de produção → numéricas
- Valores ausentes tratados
- Duplicidades removidas

### Clima Diário

- Tipos padronizados
- Valores ausentes tratados
- Duplicidades removidas
- Coordenadas e códigos preservados para cruzamento

## Relatórios disponíveis

### Geocoding

- Municípios inconsistentes
- Municípios sem coordenadas

### Produção

- Erros de estrutura SIDRA
- Valores ausentes encontrados
- Duplicidades removidas
- Relatório de qualidade

### Clima

- Valores ausentes encontrados
- Duplicidades removidas
- Relatório de qualidade

## Cards atendidos

| Card | Descrição |
|---|---|
| Card 1 | Validar municípios retornados pelo Geocoding |
| Card 2 | Tratar municípios não encontrados |
| Card 3 | Limpar dados do SIDRA |
| Card 4 | Padronizar tipos de dados |
| Card 5 | Tratar valores ausentes |
| Card 6 | Remover duplicidades |
| Card 7 | Padronizar nomes dos municípios |
| Card 8 | Validar consistência dos dados |

## Atenção antes do merge

- Municípios sem coordenadas devem ser analisados antes do cruzamento.
- Conferir relatórios de inconsistências.
- Conferir códigos IBGE nulos ou inválidos.
- Conferir anos inválidos.
- Garantir que as bases estejam sem duplicidades.

## Resultado final

Ao final da etapa de limpeza:

✅ Dados do SIDRA estruturados e padronizados  
✅ Dados da Open-Meteo validados para municípios do Ceará  
✅ Tipos de dados corretos  
✅ Valores ausentes tratados  
✅ Duplicidades removidas  
✅ Municípios sem coordenadas identificados e documentados  
✅ Base pronta para a etapa de Cruzamento (Merge)