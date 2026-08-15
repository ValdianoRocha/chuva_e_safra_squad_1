// src/services/dashboard.service.ts

import { API_ROUTES } from "@/config/api";
import { apiFetch } from "@/services/api";

import type {
  GraficoResponseProdutor,
  GraficoResponseTecnico,
  GraficoResponseGestor,
} from "@/types/dashboard";

type BuscarGraficoParams = {
  cultura: string;
  de: string;
  ate: string;
};

function montarQuery({ cultura, de, ate }: BuscarGraficoParams) {
  return new URLSearchParams({
    cultura,
    de,
    ate,
  }).toString();
}

export function buscarGraficoProdutor(params: BuscarGraficoParams) {
  const query = montarQuery(params);

  return apiFetch<GraficoResponseProdutor>(
    `${API_ROUTES.dashboard.grafico}?${query}`,
  );
}

export function buscarGraficoTecnico(params: BuscarGraficoParams) {
  const query = montarQuery(params);

  return apiFetch<GraficoResponseTecnico>(
    `${API_ROUTES.dashboard.grafico}?${query}`,
  );
}

export function buscarGraficoGestor(params: BuscarGraficoParams) {
  const query = montarQuery(params);

  return apiFetch<GraficoResponseGestor>(
    `${API_ROUTES.dashboard.grafico}?${query}`,
  );
}
