const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new Error("TOKEN_AUSENTE"));
  }

  const partes = authHeader.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer" || !partes[1]) {
    return next(new Error("TOKEN_INVALIDO"));
  }

  const token = partes[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = payload;

    next();
  } catch (erro) {
    
    if (erro.name === "TokenExpiredError") {
      return next(new Error("TOKEN_EXPIRADO"));
    }

    return next(new Error("TOKEN_INVALIDO"));
  }
}

function exigirPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new Error("TOKEN_AUSENTE"));
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return next(new Error("ACESSO_NEGADO"));
    }

    next();
  };
}

module.exports = {
  autenticar,
  exigirPerfil,
};
