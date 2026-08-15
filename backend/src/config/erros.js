/*
 * PADRÃO DE USO:
 *
 * NOS SERVICES — lançar usando um código existente no mapa:
 * throw new Error("CREDENCIAIS_INVALIDAS");
 *
 * NOS CONTROLLERS — sempre delegar o erro:
 * try {
 *   // código
 * } catch (erro) {
 *   next(erro);
 * }
 *
 * NUNCA responder com res.status(...).json(...) dentro do catch
 * de um controller.
 *
 * NUNCA lançar mensagens livres nos services:
 * throw new Error("Usuário não encontrado"); // errado
 */

const ERROS = Object.freeze({
  // ==============================
  // VALIDAÇÃO
  // ==============================

  CAMPOS_OBRIGATORIOS: {
    status: 400,
    mensagem: "Campos obrigatórios faltando.",
  },

  // ==============================
  // AUTENTICAÇÃO
  // ==============================

  EMAIL_DUPLICADO: {
    status: 409,
    mensagem: "Este e-mail já está cadastrado.",
  },

  CREDENCIAIS_INVALIDAS: {
    status: 401,
    mensagem: "E-mail ou senha incorretos.",
  },

  // ==============================
  // JWT / AUTORIZAÇÃO
  // ==============================

  TOKEN_AUSENTE: {
    status: 401,
    mensagem: "Autenticação necessária.",
  },

  TOKEN_INVALIDO: {
    status: 401,
    mensagem: "Token inválido.",
  },

  TOKEN_EXPIRADO: {
    status: 401,
    mensagem: "Sessão expirada. Faça login novamente.",
    expirado: true,
  },

  ACESSO_NEGADO: {
    status: 403,
    mensagem: "Seu perfil não tem acesso a este recurso.",
  },

  // ==============================
  // TÉCNICOS
  // ==============================

  TECNICO_NAO_ENCONTRADO: {
    status: 404,
    mensagem: "Técnico não encontrado.",
  },

  // ==============================
  // FASTAPI
  // ==============================

  FASTAPI_INDISPONIVEL: {
    status: 503,
    mensagem: "Serviço de dados indisponível. Tente novamente.",
  },

  FASTAPI_TIMEOUT: {
    status: 504,
    mensagem: "O serviço de dados demorou demais. Tente novamente.",
  },
});

module.exports = ERROS;