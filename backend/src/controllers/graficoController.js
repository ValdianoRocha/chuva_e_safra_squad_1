// back/src/controllers/graficoController.js
//
// RESPONSABILIDADE: Ponte entre a rota HTTP e o GraficoService.
//
// SEPARAÇÃO CRÍTICA:
//   req.usuario → vem do token JWT (middleware autenticar)
//     • perfil     → determina o que o usuário pode ver
//     • municipios → determina quais municípios o usuário pode consultar
//
//   req.query → vem do frontend (filtros permitidos)
//     • cultura → qual cultura analisar (milho, feijao, etc)
//     • de      → ano inicial
//     • ate     → ano final
//
// O frontend NUNCA envia perfil ou municipios.
// Mesmo que envie, o controller IGNORA — usa sempre o token.

const graficoService = require('../services/graficoService');

async function buscarGrafico(req, res, next) {
  try {

    // DO TOKEN JWT — preenchido pelo middleware autenticar
    const { perfil, municipios } = req.usuario;

    // DO FRONTEND — filtros permitidos
    const { cultura, de, ate } = req.query;

    const dados = await graficoService.buscar({
      perfil,
      municipios,
      cultura,
      de,
      ate,
    });

    res.json(dados);

  } catch (erro) {
    next(erro);
  }
}

module.exports = { buscarGrafico };