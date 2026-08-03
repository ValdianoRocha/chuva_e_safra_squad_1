// back/src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Health check — usado no deploy para confirmar que o servidor subiu
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ROTAS SERÃO ADICIONADAS AQUI NAS PRÓXIMAS TASKS

// Error handler global — expandido na FS-004
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.message}`);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});