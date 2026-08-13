import { api } from "@/services/api"
import type {
  DashboardFiltros,
  GraficoResponseProdutor,
} from "@/types/dashboard"

export async function buscarDashboardProdutor(
  filtros: DashboardFiltros
): Promise<GraficoResponseProdutor> {
  const response = await api.get<GraficoResponseProdutor>(
    "/api/dashboard",
    {
      params: filtros,
    }
  )

  return response.data
}