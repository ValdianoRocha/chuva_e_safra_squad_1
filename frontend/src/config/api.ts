export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    cadastro: "/auth/register",
  },

  dashboard: {
    grafico: "/api/grafico",
  },

  tecnicos: {
    listar: "/api/tecnicos",
    criar: "/api/tecnicos",

    buscarPorId: (id: string) => `/api/tecnicos/${id}`,

    atualizar: (id: string) => `/api/tecnicos/${id}`,

    excluir: (id: string) => `/api/tecnicos/${id}`,
  },
} as const;
