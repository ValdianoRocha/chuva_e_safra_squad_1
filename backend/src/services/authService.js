// RESPONSABILIDADE: Regras de negócio de autenticação.
//
// ESTE ARQUIVO:
// • NÃO conhece req, res, next
// • NÃO conhece rotas HTTP
// • Recebe dados puros → processa → retorna dados puros ou lança erro
// • Lança erros usando APENAS os códigos do mapa em config/erros.js
//
// COMO USAR NOS CONTROLLERS:
// const authService = require('../services/authService');
// const resultado = await authService.criarUsuario({ nome, email, senha, perfil, municipios });

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

// Validar no momento que o módulo é carregado
// Se JWT_SECRET não estiver definido, o servidor não deve subir

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET não definido no .env — o servidor não pode subir sem ele",
  );
}

// Perfis aceitos pelo sistema — deve espelhar o enum do schema.prisma

const PERFIS_VALIDOS = ["PRODUTOR", "TECNICO", "GESTOR"];

// ─────────────────────────────────────────────────────────────
// criarUsuario
//
// Valida os dados, verifica duplicidade de email,
// faz hash da senha e persiste o usuário no banco.
//
// Parâmetros:
//   { nome, email, senha, perfil, municipios }
//
// Retorna:
//   { id, nome, email, perfil, criadoEm }
//   (sem o campo senha — excluído pelo select do Prisma)
//
// Lança:
//   'CAMPOS_OBRIGATORIOS' — se nome, email, senha ou perfil estiverem ausentes
//   'PERFIL_INVALIDO'     — se perfil não for PRODUTOR, TECNICO ou GESTOR
//   'EMAIL_DUPLICADO'     — se o email já estiver cadastrado
// ─────────────────────────────────────────────────────────────

async function criarUsuario({ nome, email, senha, perfil, municipios = [] }) {
  // 1. Validar presença dos campos obrigatórios

  if (!nome || !email || !senha || !perfil) {
    throw new Error("CAMPOS_OBRIGATORIOS");
  }

  // 2. Validar valor do perfil

  // Não confiar no frontend — validar sempre no backend

  if (!PERFIS_VALIDOS.includes(perfil)) {
    throw new Error("PERFIL_INVALIDO");
  }

  // 3. Verificar duplicidade de email

  const existente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (existente) throw new Error("EMAIL_DUPLICADO");

  // 4. Hash da senha
  // Custo 12: seguro para produção sem ser excessivamente lento
  // Nunca usar custo abaixo de 10 em produção
  // Nunca armazenar senha em texto puro — NUNCA

  const senhaHash = await bcrypt.hash(senha, 12);

  // 5. Persistir no banco
  // O select EXCLUI o campo senha da resposta
  // Isso garante que a senha nunca volta para o controller ou para o cliente

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
      perfil,
      municipios,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      criadoEm: true,

      // senha: false  ← omitido intencionalmente
    },
  });

  return usuario;
}

// ─────────────────────────────────────────────────────────────
// autenticar
//
// Valida credenciais e retorna o JWT com perfil e municípios.
//
// Parâmetros:
//   { email, senha }
//
// Retorna:
//   { token, usuario: { nome, perfil } }
//
// Lança:
//   'CREDENCIAIS_INVALIDAS' — se email não existir OU senha estiver errada
//   (mesma mensagem para ambos os casos — não vazar qual falhou)
// ─────────────────────────────────────────────────────────────

async function autenticar({ email, senha }) {
  // 1. Buscar usuário pelo email
  // REGRA DE SEGURANÇA: se o email não existir, retornar a MESMA mensagem
  // de erro que senha errada. Nunca dizer "email não encontrado".
  // Isso evita que atacantes descubram quais emails estão cadastrados.

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  // 2. Comparar senha com hash
  // bcrypt.compare é assíncrono e timing-safe

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  // 3. Assinar o JWT
  // O payload contém: id, perfil e municipios
  // IMPORTANTE: perfil e municipios ficam NO TOKEN
  // O backend lê esses dados do token em cada requisição protegida
  // O frontend NUNCA envia perfil ou municipios — eles vêm sempre do token

  const token = jwt.sign(
    {
      id: usuario.id,
      perfil: usuario.perfil,
      municipios: usuario.municipios,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    },
  );

  // 4. Retornar token e dados básicos do usuário
  // Não retornar municipios aqui — o frontend não precisa
  // O frontend só precisa do nome para exibir na tela

  return {
    token,
    usuario: {
      nome: usuario.nome,
      perfil: usuario.perfil,
    },
  };
}

module.exports = {
  criarUsuario,
  autenticar,
};
