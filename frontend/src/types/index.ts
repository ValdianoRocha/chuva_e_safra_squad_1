// src/types/index.ts

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────

export type Perfil =
  | "PRODUTOR"
  | "TECNICO"
  | "GESTOR";

export interface Usuario {
  nome: string;
  perfil: Perfil;
}

export interface RespostaLogin {
  token: string;
  usuario: Usuario;
}

// ─────────────────────────────────────────────────────────────
// GRÁFICO
// ─────────────────────────────────────────────────────────────

// TODO:
// A interface Figura deve ser definida de acordo com
// o contrato real retornado pelo FastAPI.

// ─────────────────────────────────────────────────────────────
// KPIs
// ─────────────────────────────────────────────────────────────

interface KpisBase {
  produtividade_media: string;
  chuva_total: string;
  tendencia: string;
}

export interface LinhaTabela {
  municipio: string;
  codigo: string;
  produtividade_media: string;
  chuva_total?: string;
  ranking?: number;
}

export interface KpisProdutor extends KpisBase {}

export interface KpisTecnico extends KpisBase {
  tabela: LinhaTabela[];
}

export interface KpisGestor extends KpisBase {
  total_municipios: number;
  municipios_risco: string[];
  tabela: LinhaTabela[];
}

export type Kpis =
  | KpisProdutor
  | KpisTecnico
  | KpisGestor;

// ─────────────────────────────────────────────────────────────
// RESPOSTA DO GRÁFICO
// ─────────────────────────────────────────────────────────────

// Temporariamente genérico até confirmarmos o contrato
// exato da resposta do FastAPI.
export interface Figura {
  data: unknown[];
  layout?: Record<string, unknown>;
}

export interface RespostaGrafico {
  figura: Figura;
  kpis: Kpis;
}

export interface RespostaGraficoProdutor {
  figura: Figura;
  kpis: KpisProdutor;
}

// ─────────────────────────────────────────────────────────────
// PARÂMETROS
// ─────────────────────────────────────────────────────────────

export type Cultura =
  | "milho"
  | "mandioca"
  | "banana";

// ─────────────────────────────────────────────────────────────
// ERROS
// ─────────────────────────────────────────────────────────────

export interface ErroApi {
  erro: string;
  expirado?: boolean;
}