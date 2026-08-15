// back/src/services/graficoService.js
//
// RESPONSABILIDADE: Montar os parâmetros corretos por perfil
// e buscar os dados do gráfico no FastAPI.
//
// ESTE ARQUIVO:
// • Recebe perfil, municipios, cultura, de, ate
// • Monta URLSearchParams baseado no perfil
// • Chama o FastAPI via axios (ou retorna mock se USE_MOCK=true)
// • Trata erros de conectividade e timeout
// • NÃO conhece req, res, next
// • NÃO acessa o banco de dados
//
// SEGURANÇA CRÍTICA:
// perfil e municipios vêm do TOKEN JWT (passados pelo controller)
// Esses valores NUNCA vêm do frontend diretamente

const axios = require("axios");
const mockPorPerfil = require("../mocks/graficoMock");

// ─────────────────────────────────────────────────────────────
// montarParams
// ─────────────────────────────────────────────────────────────

function montarParams({ perfil, municipios, cultura, de, ate }) {
  const params = new URLSearchParams({
    perfil,
    cultura: cultura || "milho",
    de: de || "2015",
    ate: ate || "2022",
  });

  // PRODUTOR e TECNICO:
  // envia somente os municípios permitidos pelo token.
  //
  // GESTOR:
  // não envia municipios, pois representa o estado inteiro.
  if (perfil !== "GESTOR" && municipios && municipios.length > 0) {
    municipios.forEach((codigo) => {
      params.append("municipios", codigo);
    });
  }

  return params;
}

// ─────────────────────────────────────────────────────────────
// filtrarSeriePorPeriodo
//
// Filtra somente séries cujo eixo X representa anos.
//
// Exemplo:
// x: [2015, 2016, 2017, 2018]
// y: [100, 200, 300, 400]
//
// Se período = 2016–2017:
// x: [2016, 2017]
// y: [200, 300]
// ─────────────────────────────────────────────────────────────

function filtrarSeriePorPeriodo(serie, anoInicial, anoFinal) {
  const x = Array.isArray(serie.x) ? serie.x : [];

  const y = Array.isArray(serie.y) ? serie.y : [];

  if (x.length === 0) {
    return serie;
  }

  // Descobre se o eixo X realmente parece ser uma série de anos.
  //
  // Isso evita quebrar o gráfico do TECNICO, cujo eixo X pode ser:
  // chuva acumulada = [650, 820, 480...]
  //
  // Esses valores NÃO são anos.
  const eixoRepresentaAnos = x.every((valor) => {
    const numero = Number(valor);

    return !Number.isNaN(numero) && numero >= 1900 && numero <= 2100;
  });

  if (!eixoRepresentaAnos) {
    return serie;
  }

  const pontos = x
    .map((valorX, index) => ({
      x: valorX,
      y: y[index],
    }))
    .filter((ponto) => {
      const ano = Number(ponto.x);

      return ano >= anoInicial && ano <= anoFinal;
    });

  return {
    ...serie,

    x: pontos.map((ponto) => ponto.x),

    y: pontos.map((ponto) => ponto.y),
  };
}

// ─────────────────────────────────────────────────────────────
// montarMock
//
// Simula a resposta que futuramente virá do FastAPI.
//
// Estrutura esperada do mock:
//
// mockPorPerfil = {
//   PRODUTOR: {
//     milho: {...},
//     feijao: {...},
//     mandioca: {...},
//     caju: {...},
//     banana: {...},
//   },
//   TECNICO: {
//     milho: {...},
//   },
//   GESTOR: {
//     milho: {...},
//   },
// }
// ─────────────────────────────────────────────────────────────

function montarMock({ perfil, cultura, de, ate }) {
  const culturaSelecionada = cultura || "milho";

  // Primeiro verifica se o perfil existe.
  const dadosPerfil = mockPorPerfil[perfil];

  if (!dadosPerfil) {
    throw new Error("PERFIL_INVALIDO");
  }

  // Depois procura a cultura dentro daquele perfil.
  const dadosOriginais = dadosPerfil[culturaSelecionada];

  if (!dadosOriginais) {
    throw new Error("CULTURA_INVALIDA");
  }

  const anoInicial = Number(de || 2015);

  const anoFinal = Number(ate || 2022);

  // Validação básica do período.
  if (
    Number.isNaN(anoInicial) ||
    Number.isNaN(anoFinal) ||
    anoInicial > anoFinal
  ) {
    throw new Error("PERIODO_INVALIDO");
  }

  // ───────────────────────────────────────────────────────────
  // Figura
  // ───────────────────────────────────────────────────────────

  const figura = {
    ...dadosOriginais.figura,

    data: dadosOriginais.figura.data.map((serie) =>
      filtrarSeriePorPeriodo(serie, anoInicial, anoFinal),
    ),

    layout: {
      ...dadosOriginais.figura.layout,

      title:
        perfil === "PRODUTOR"
          ? `${
              culturaSelecionada.charAt(0).toUpperCase() +
              culturaSelecionada.slice(1)
            } — ${anoInicial}–${anoFinal}`
          : dadosOriginais.figura.layout.title,
    },
  };

  // ───────────────────────────────────────────────────────────
  // KPIs
  //
  // Continuam prontos no mock.
  //
  // Quando o FastAPI estiver disponível, esses cálculos serão
  // responsabilidade da API de Dados.
  // ───────────────────────────────────────────────────────────

  const kpis = {
    ...dadosOriginais.kpis,
  };

  return {
    figura,
    kpis,
  };
}

// ─────────────────────────────────────────────────────────────
// buscar
//
// Busca os dados no mock ou no FastAPI.
// ─────────────────────────────────────────────────────────────

async function buscar({ perfil, municipios, cultura, de, ate }) {
  // ==========================================================
  // MODO MOCK
  // ==========================================================

  if (process.env.USE_MOCK === "true") {
    console.log(
      `[GraficoService] Modo mock ativo — perfil: ${perfil}, cultura: ${
        cultura || "milho"
      }, período: ${de || "2015"}-${ate || "2022"}`,
    );

    // Delay proposital para testar loading no frontend.
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    return montarMock({
      perfil,
      cultura,
      de,
      ate,
    });
  }

  // ==========================================================
  // MODO REAL — FASTAPI
  // ==========================================================

  const params = montarParams({
    perfil,
    municipios,
    cultura,
    de,
    ate,
  });

  const url = `${process.env.FASTAPI_URL}/grafico?${params.toString()}`;

  const timeout = parseInt(process.env.FASTAPI_TIMEOUT_MS, 10) || 10000;

  console.log(`[GraficoService] Chamando FastAPI: ${url}`);

  try {
    const resposta = await axios.get(url, {
      timeout,
    });

    return resposta.data;
  } catch (erro) {
    // ─────────────────────────────────────────────────────────
    // TIMEOUT
    // ─────────────────────────────────────────────────────────

    if (erro.code === "ECONNABORTED") {
      console.error(`[GraficoService] Timeout após ${timeout}ms`);

      throw new Error("FASTAPI_TIMEOUT");
    }

    // ─────────────────────────────────────────────────────────
    // FASTAPI OFFLINE
    // ─────────────────────────────────────────────────────────

    if (
      erro.code === "ECONNREFUSED" ||
      erro.code === "ENOTFOUND" ||
      !erro.response
    ) {
      console.error(`[GraficoService] FastAPI indisponível: ${erro.code}`);

      throw new Error("FASTAPI_INDISPONIVEL");
    }

    // ─────────────────────────────────────────────────────────
    // FASTAPI RESPONDEU COM ERRO HTTP
    // ─────────────────────────────────────────────────────────

    console.error(`[GraficoService] FastAPI retornou ${erro.response.status}`);

    const err = new Error("FASTAPI_INDISPONIVEL");

    err.detalhes = erro.response.data;

    throw err;
  }
}

module.exports = {
  buscar,
};
