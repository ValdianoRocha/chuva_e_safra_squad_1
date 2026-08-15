// back/src/routes/grafico.js
//
// RESPONSABILIDADE: Definir o endpoint de gráfico.
//
// ORDEM DOS MIDDLEWARES:
// 1. autenticar → verifica JWT, preenche req.usuario
// 2. graficoController.buscarGrafico → chama o service e responde

const express = require('express');
const { autenticar } = require('../middlewares/authenticate.js');
const graficoController = require('../controllers/graficoController');

const router = express.Router();

// GET /api/grafico
// Rota protegida — requer JWT válido
// Query params permitidos: cultura, de, ate
// Query params ignorados: perfil, municipios (vêm do token)
router.get('/grafico', autenticar, graficoController.buscarGrafico);

module.exports = router;