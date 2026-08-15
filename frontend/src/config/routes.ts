// src/config/routes.ts

export const APP_ROUTES = {
  login: "/login",
  cadastro: "/cadastro",

  dashboard: {
    PRODUTOR: "/dashboard",
    TECNICO: "/dashboard/tecnico",
    GESTOR: "/dashboard/gestor",
  },

  gestor: {
    tecnicos: "/dashboard/gestor/tecnicos",
    novoTecnico:
      "/dashboard/gestor/tecnicos/novo",
  },
} as const;