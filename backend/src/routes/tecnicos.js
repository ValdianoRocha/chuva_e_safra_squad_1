const express = require("express");

const {
  autenticar,
  exigirPerfil,
} = require(
  "../middlewares/authenticate",
);

const tecnicoController = require(
  "../controllers/tecnicoController",
);

const router = express.Router();

router.get(
  "/tecnicos",
  autenticar,
  exigirPerfil("GESTOR"),
  tecnicoController.listar,
);

router.post(
  "/tecnicos",
  autenticar,
  exigirPerfil("GESTOR"),
  tecnicoController.criar,
);

router.get(
  "/tecnicos/:id",
  autenticar,
  exigirPerfil("GESTOR"),
  tecnicoController.buscarPorId,
);

router.put(
  "/tecnicos/:id",
  autenticar,
  exigirPerfil("GESTOR"),
  tecnicoController.atualizar,
);

router.delete(
  "/tecnicos/:id",
  autenticar,
  exigirPerfil("GESTOR"),
  tecnicoController.excluir,
);

module.exports = router;