const tecnicoService = require("../services/tecnicoService");

// ==============================
// LISTAR TÉCNICOS
// ==============================

async function listar(req, res, next) {
  try {
    const tecnicos =
      await tecnicoService.listarTecnicos();

    return res.json(tecnicos);
  } catch (erro) {
    next(erro);
  }
}

// ==============================
// CRIAR TÉCNICO
// ==============================

async function criar(req, res, next) {
  try {
    const {
      nome,
      email,
      senha,
      municipios,
    } = req.body;

    const tecnico =
      await tecnicoService.criarTecnico({
        nome,
        email,
        senha,
        municipios,
      });

    return res
      .status(201)
      .json(tecnico);
  } catch (erro) {
    next(erro);
  }
}

// ==============================
// BUSCAR TÉCNICO POR ID
// ==============================

async function buscarPorId(req, res, next) {
  try {
    console.log(
      "[TecnicoController] ID recebido:",
      req.params.id,
    );

    const tecnico =
      await tecnicoService.buscarTecnicoPorId(
        req.params.id,
      );

    console.log(
      "[TecnicoController] Técnico encontrado:",
      tecnico,
    );

    return res.json(tecnico);
  } catch (erro) {
    console.error(
      "[TecnicoController] Erro ao buscar técnico:",
      erro.message,
    );

    next(erro);
  }
}

// ==============================
// ATUALIZAR TÉCNICO
// ==============================

async function atualizar(req, res, next) {
  try {
    const {
      nome,
      email,
      municipios,
    } = req.body;

    console.log(
      "[TecnicoController] Atualizando técnico:",
      req.params.id,
    );

    const tecnico =
      await tecnicoService.atualizarTecnico({
        id: req.params.id,
        nome,
        email,
        municipios,
      });

    return res.json(tecnico);
  } catch (erro) {
    console.error(
      "[TecnicoController] Erro ao atualizar técnico:",
      erro.message,
    );

    next(erro);
  }
}

// ==============================
// EXCLUIR TÉCNICO
// ==============================

async function excluir(req, res, next) {
  try {
    console.log(
      "[TecnicoController] Excluindo técnico:",
      req.params.id,
    );

    const resultado =
      await tecnicoService.excluirTecnico(
        req.params.id,
      );

    return res.json(resultado);
  } catch (erro) {
    console.error(
      "[TecnicoController] Erro ao excluir técnico:",
      erro.message,
    );

    next(erro);
  }
}

// ==============================
// EXPORTS
// ==============================

module.exports = {
  listar,
  criar,
  buscarPorId,
  atualizar,
  excluir,
};