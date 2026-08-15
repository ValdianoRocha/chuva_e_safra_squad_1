import { API_ROUTES } from "@/config/api";
import { apiFetch } from "@/services/api";

// ==============================
// TIPOS
// ==============================

export type Tecnico = {
  id: string;
  nome: string;
  email: string;
  perfil?: "TECNICO";
  municipios: string[];
  criadoEm: string;
};

type CriarTecnicoRequest = {
  nome: string;
  email: string;
  senha: string;
  municipios: string[];
};

type AtualizarTecnicoRequest = {
  nome: string;
  email: string;
  municipios: string[];
};

type ExcluirTecnicoResponse = {
  mensagem: string;
};

// ==============================
// LISTAR TÉCNICOS
// ==============================

export function listarTecnicos() {
  return apiFetch<Tecnico[]>(API_ROUTES.tecnicos.listar);
}

// ==============================
// CRIAR TÉCNICO
// ==============================

export function criarTecnico(dados: CriarTecnicoRequest) {
  return apiFetch<Tecnico>(API_ROUTES.tecnicos.criar, {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

// ==============================
// BUSCAR TÉCNICO POR ID
// ==============================

export function buscarTecnicoPorId(id: string) {
  return apiFetch<Tecnico>(API_ROUTES.tecnicos.buscarPorId(id));
}

// ==============================
// ATUALIZAR TÉCNICO
// ==============================

export function atualizarTecnico(id: string, dados: AtualizarTecnicoRequest) {
  return apiFetch<Tecnico>(API_ROUTES.tecnicos.atualizar(id), {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

// ==============================
// EXCLUIR TÉCNICO
// ==============================

export function excluirTecnico(id: string) {
  return apiFetch<ExcluirTecnicoResponse>(API_ROUTES.tecnicos.excluir(id), {
    method: "DELETE",
  });
}
