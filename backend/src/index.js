const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ERROS = require("./config/erros");
const authRoutes = require("./routes/auth");
const { autenticar, exigirPerfil } = require("./middlewares/authenticate");
const graficoRoutes = require('./routes/grafico');

const app = express();

// Middlewares
app.use(cors({origin: process.env.FRONTEND_URL || "http://localhost:3000",credentials: true,}));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ROTAs aqui 

app.use("/auth", authRoutes);
app.use('/api', graficoRoutes);

// Rotas temporárias para testar o Error Handler

app.get("/teste-auth", autenticar, (req, res) => {
  res.json({
    mensagem: "Autenticado!",
    usuario: req.usuario,
  });
});

app.get(
  "/teste-gestor",
  autenticar,
  exigirPerfil("GESTOR"),
  (req, res) => {
    res.json({
      mensagem: "Acesso de Gestor confirmado!",
    });
  }
);


app.get("/teste/erro-mapeado", (req, res, next) => {
  try {
    throw new Error("EMAIL_DUPLICADO");
  } catch (erro) {
    next(erro);
  }
});

app.get("/teste/erro-nao-mapeado", (req, res, next) => {
  try {
    throw new Error("QUALQUER_COISA");
  } catch (erro) {
    next(erro);
  }
});

app.get("/teste/token-expirado", (req, res, next) => {
  try {
    throw new Error("TOKEN_EXPIRADO");
  } catch (erro) {
    next(erro);
  }
});

// ERROR HANDLER GLOBAL Deve ficar depois das rotas


app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.message}`);

  const erroMapeado = ERROS[err.message];

  if (erroMapeado) {
    return res.status(erroMapeado.status).json({
      erro: erroMapeado.mensagem,
      ...(erroMapeado.expirado && {
        expirado: true,
      }),
    });
  }

  return res.status(500).json({
    erro: "Erro interno do servidor",

    // Stack aparece somente em desenvolvimento
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});