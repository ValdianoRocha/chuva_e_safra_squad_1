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

const axios = require('axios');
const mockPorPerfil = require('../mocks/graficoMock');

// ─────────────────────────────────────────────────────────────
// montarParams
//
// Monta os parâmetros que serão enviados ao FastAPI.
// A lógica de perfil vive AQUI — não no controller.
//
// Parâmetros:
//   perfil     — string: PRODUTOR | TECNICO | GESTOR (DO TOKEN)
//   municipios — string[]: códigos IBGE (DO TOKEN)
//   cultura    — string: milho | feijao | etc (do req.query)
//   de         — string: ano inicial (do req.query)
//   ate        — string: ano final (do req.query)
//
// Retorna:
//   URLSearchParams pronto para uso na URL do FastAPI
// ─────────────────────────────────────────────────────────────
function montarParams({ perfil, municipios, cultura, de, ate }) {
  const params = new URLSearchParams({
    perfil,
    cultura: cultura || 'milho',
    de: de || '2015',
    ate: ate || '2022',
  });

  // REGRA DE AUTORIZAÇÃO:
  // PRODUTOR e TECNICO → filtrar pelos municípios do token
  // GESTOR → sem filtro → FastAPI retorna dados do estado inteiro
  //
  // Por que não enviar municipios para o GESTOR?
  // O array do GESTOR é [] (vazio) — cadastrado assim no banco.
  // Se enviássemos [], o FastAPI receberia uma lista vazia
  // e poderia interpretar como "nenhum município" em vez de "todos".
  // Omitir o parâmetro é a forma mais clara de dizer "sem filtro".
  if (perfil !== 'GESTOR' && municipios && municipios.length > 0) {
    municipios.forEach(cod => params.append('municipios', cod));
  }

  return params;
}

// ─────────────────────────────────────────────────────────────
// buscar
//
// Busca os dados do gráfico no FastAPI (ou no mock).
//
// Parâmetros:
//   { perfil, municipios, cultura, de, ate }
//   perfil e municipios vêm do token JWT (via controller)
//   cultura, de, ate vêm do req.query (filtros do frontend)
//
// Retorna:
//   { figura: { data, layout }, kpis: { ... } }
//
// Lança:
//   'FASTAPI_INDISPONIVEL' — FastAPI offline ou recusou conexão
//   'FASTAPI_TIMEOUT'      — FastAPI não respondeu no tempo limite
// ─────────────────────────────────────────────────────────────
async function buscar({ perfil, municipios, cultura, de, ate }) {

  // MODO MOCK — retorna dados locais sem chamar o FastAPI
  // Ativar com USE_MOCK=true no .env durante o desenvolvimento
  if (process.env.USE_MOCK === 'true') {
    console.log(`[GraficoService] Modo mock ativo — perfil: ${perfil}`);

    // Simular delay para testar o loading no frontend
    await new Promise(resolve => setTimeout(resolve, 500));

    const dadosMock = mockPorPerfil[perfil];

    if (!dadosMock) {
      throw new Error('PERFIL_INVALIDO');
    }

    return dadosMock;
  }

  // MODO REAL — chama o FastAPI
  const params = montarParams({ perfil, municipios, cultura, de, ate });
  const url = `${process.env.FASTAPI_URL}/grafico?${params.toString()}`;
  const timeout = parseInt(process.env.FASTAPI_TIMEOUT_MS) || 10000;

  console.log(`[GraficoService] Chamando FastAPI: ${url}`);

  try {
    const resposta = await axios.get(url, { timeout });
    return resposta.data;

  } catch (erro) {

    // Timeout — FastAPI não respondeu no tempo limite
    if (erro.code === 'ECONNABORTED') {
      console.error(`[GraficoService] Timeout após ${timeout}ms`);
      throw new Error('FASTAPI_TIMEOUT');
    }

    // Conexão recusada ou FastAPI offline
    if (
      erro.code === 'ECONNREFUSED' ||
      erro.code === 'ENOTFOUND' ||
      !erro.response
    ) {
      console.error(`[GraficoService] FastAPI indisponível: ${erro.code}`);
      throw new Error('FASTAPI_INDISPONIVEL');
    }

    // FastAPI respondeu com erro HTTP (4xx, 5xx)
    // Repassar o erro com detalhes para o controller logar
    console.error(`[GraficoService] FastAPI retornou ${erro.response.status}`);

    const err = new Error('FASTAPI_INDISPONIVEL');
    err.detalhes = erro.response.data;
    throw err;
  }
}

module.exports = { buscar };