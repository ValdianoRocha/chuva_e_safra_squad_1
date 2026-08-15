import { API_ROUTES } from "@/config/api";
import { apiFetch } from "@/services/api";

export type Perfil = "PRODUTOR" | "TECNICO" | "GESTOR";

export type UsuarioAutenticado = {
  nome: string;
  perfil: Perfil;
  municipios: string[];
};

type LoginRequest = {
  email: string;
  senha: string;
};

type LoginResponse = {
  token: string;
  usuario: UsuarioAutenticado;
};

type CadastroRequest = {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
  municipios?: string[];
};

type CadastroResponse = {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  criadoEm: string;
};

export function login(dados: LoginRequest) {
  return apiFetch<LoginResponse>(
    API_ROUTES.auth.login,
    {
      method: "POST",
      body: JSON.stringify(dados),
    },
  );
}

export function cadastrar(
  dados: CadastroRequest,
) {
  return apiFetch<CadastroResponse>(
    API_ROUTES.auth.cadastro,
    {
      method: "POST",
      body: JSON.stringify(dados),
    },
  );
}