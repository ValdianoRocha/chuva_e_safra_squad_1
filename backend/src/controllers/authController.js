// RESPONSABILIDADE:
// Fazer a ponte entre a requisição HTTP e o AuthService.
//
// ESTE ARQUIVO:
// • Conhece req, res e next
// • Extrai os dados enviados pelo cliente
// • Chama as funções do AuthService
// • Retorna a resposta HTTP
// • NÃO contém lógica de negócio
// • NÃO acessa o banco diretamente
// • NÃO usa bcrypt
// • NÃO usa jwt

const authService = require('../services/authService');

// ─────────────────────────────────────────────────────────────
// register
// Responsável por receber os dados do cadastro,
// chamar o authService.criarUsuario()
// e retornar o usuário criado com status 201.
// ─────────────────────────────────────────────────────────────

async function register(req, res, next) {
  try {

    // Extrai os dados enviados no corpo da requisição.
    // Esses dados vêm do req.body.

    const {
      nome,
      email,
      senha,
      perfil,
      municipios
    } = req.body;

    // Envia os dados para o AuthService.
    // A validação, criação do hash da senha
    // e criação no banco são responsabilidades do Service.

    const usuario = await authService.criarUsuario({
      nome,
      email,
      senha,
      perfil,
      municipios
    });

    // Cadastro realizado com sucesso.
    // O status 201 significa que um novo recurso foi criado.

    return res.status(201).json(usuario);

  } catch (erro) {

    // O Controller não trata a regra do erro.
    // Apenas envia o erro para o error handler global.

    next(erro);
  }
}


// ─────────────────────────────────────────────────────────────
// login
// Responsável por receber email e senha,
// chamar o authService.autenticar()
// e retornar o token e os dados do usuário.
// ─────────────────────────────────────────────────────────────

async function login(req, res, next) {
  try {

    // Extrai email e senha enviados no req.body.

    const {
      email,
      senha
    } = req.body;

    // Envia email e senha para o AuthService.
    // O Service é responsável por verificar a senha
    // e gerar o token JWT.

    const resultado = await authService.autenticar({
      email,
      senha
    });

    // Login realizado com sucesso.
    // res.json() usa o status 200 por padrão.

    return res.json(resultado);

  } catch (erro) {

    // Encaminha o erro para o error handler global.

    next(erro);
  }
}


// Exporta as funções para que as rotas possam utilizá-las.

module.exports = {
  register,
  login
};