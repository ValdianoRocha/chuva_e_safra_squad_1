const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");

// ==============================
// LISTAR TÉCNICOS
// ==============================

async function listarTecnicos() {
  return prisma.usuario.findMany({
    where: {
      perfil: "TECNICO",
    },

    select: {
      id: true,
      nome: true,
      email: true,
      municipios: true,
      criadoEm: true,
    },

    orderBy: {
      nome: "asc",
    },
  });
}

// ==============================
// CRIAR TÉCNICO
// ==============================

async function criarTecnico({
  nome,
  email,
  senha,
  municipios,
}) {
  if (
    !nome ||
    !email ||
    !senha ||
    !Array.isArray(municipios) ||
    municipios.length === 0
  ) {
    throw new Error("CAMPOS_OBRIGATORIOS");
  }

  const existente = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  if (existente) {
    throw new Error("EMAIL_DUPLICADO");
  }

  const senhaHash = await bcrypt.hash(
    senha,
    12,
  );

  return prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,

      // O backend força o perfil.
      // O frontend não decide isso.
      perfil: "TECNICO",

      municipios,
    },

    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      municipios: true,
      criadoEm: true,
    },
  });
}

// ==============================
// BUSCAR TÉCNICO POR ID
// ==============================

async function buscarTecnicoPorId(id) {
  const tecnico = await prisma.usuario.findFirst({
    where: {
      id,
      perfil: "TECNICO",
    },

    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      municipios: true,
      criadoEm: true,
    },
  });

  if (!tecnico) {
    throw new Error(
      "TECNICO_NAO_ENCONTRADO",
    );
  }

  return tecnico;
}

// ==============================
// ATUALIZAR TÉCNICO
// ==============================

async function atualizarTecnico({
  id,
  nome,
  email,
  municipios,
}) {
  // ==============================
  // VALIDAÇÃO
  // ==============================

  if (
    !id ||
    !nome ||
    !email ||
    !Array.isArray(municipios) ||
    municipios.length === 0
  ) {
    throw new Error(
      "CAMPOS_OBRIGATORIOS",
    );
  }

  // ==============================
  // CONFIRMAR QUE É UM TÉCNICO
  // ==============================

  const tecnico =
    await prisma.usuario.findFirst({
      where: {
        id,
        perfil: "TECNICO",
      },
    });

  if (!tecnico) {
    throw new Error(
      "TECNICO_NAO_ENCONTRADO",
    );
  }

  // ==============================
  // VERIFICAR EMAIL DUPLICADO
  // ==============================

  const emailEmUso =
    await prisma.usuario.findFirst({
      where: {
        email,

        NOT: {
          id,
        },
      },
    });

  if (emailEmUso) {
    throw new Error(
      "EMAIL_DUPLICADO",
    );
  }

  // ==============================
  // ATUALIZAR
  // ==============================

  return prisma.usuario.update({
    where: {
      id,
    },

    data: {
      nome,
      email,
      municipios,
    },

    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      municipios: true,
      criadoEm: true,
    },
  });
}

// ==============================
// EXCLUIR TÉCNICO
// ==============================

async function excluirTecnico(id) {
  if (!id) {
    throw new Error(
      "CAMPOS_OBRIGATORIOS",
    );
  }

  // ==============================
  // CONFIRMAR QUE É UM TÉCNICO
  // ==============================

  const tecnico =
    await prisma.usuario.findFirst({
      where: {
        id,
        perfil: "TECNICO",
      },
    });

  if (!tecnico) {
    throw new Error(
      "TECNICO_NAO_ENCONTRADO",
    );
  }

  // ==============================
  // EXCLUIR
  // ==============================

  await prisma.usuario.delete({
    where: {
      id,
    },
  });

  return {
    mensagem:
      "Técnico excluído com sucesso.",
  };
}

// ==============================
// EXPORTS
// ==============================

module.exports = {
  listarTecnicos,
  criarTecnico,
  buscarTecnicoPorId,
  atualizarTecnico,
  excluirTecnico,
};