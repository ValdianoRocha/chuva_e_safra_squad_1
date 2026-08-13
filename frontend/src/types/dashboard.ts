export type Perfil = "PRODUTOR" | "TECNICO" | "GESTOR"

export type Cultura =
  | "milho"
  | "feijao"
  | "mandioca"
  | "caju"
  | "banana"


// ======================================================
// FRONTEND → EXPRESS
// ======================================================

export type DashboardFiltros = {
  cultura: Cultura
  de: number
  ate: number
}


// ======================================================
// EXPRESS → FASTAPI
// ======================================================

export type GraficoRequest = {
  perfil: Perfil
  cultura: Cultura
  de: number
  ate: number
  municipios?: string[]
}


// ======================================================
// FIGURA / GRÁFICO
// ======================================================

export type Figura = {
  data: Record<string, unknown>[]
  layout: Record<string, unknown>
}


// ======================================================
// PRODUTOR
// ======================================================

export type KpisProdutor = {
  produtividade_media: string | null
  chuva_total: string | null
  tendencia: string | null
}

export type GraficoResponseProdutor = {
  figura: Figura
  kpis: KpisProdutor
}


// ======================================================
// TÉCNICO
// ======================================================

export type TabelaTecnicoItem = {
  municipio: string
  codigo: string
  produtividade_media: string | null
  chuva_total: string | null
}

export type KpisTecnico = {
  produtividade_media: string | null
  chuva_total: string | null
  tendencia: string | null
  tabela: TabelaTecnicoItem[]
}

export type GraficoResponseTecnico = {
  figura: Figura
  kpis: KpisTecnico
}


// ======================================================
// GESTOR
// ======================================================

export type TabelaGestorItem = {
  municipio: string
  codigo: string
  produtividade_media: string | null
  ranking: number
}

export type KpisGestor = {
  produtividade_media: string | null
  chuva_total: string | null
  total_municipios: number
  municipios_risco: string[]
  tabela: TabelaGestorItem[]
}

export type GraficoResponseGestor = {
  figura: Figura
  kpis: KpisGestor
}


// ======================================================
// RESPOSTA GERAL
// ======================================================

export type GraficoResponse =
  | GraficoResponseProdutor
  | GraficoResponseTecnico
  | GraficoResponseGestor