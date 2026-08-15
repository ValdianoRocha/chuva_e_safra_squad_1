"use client";

import { useCallback, useEffect, useState } from "react";

import { AppSidebarGestor } from "@/components/layout/app-sidebar-gestor";
import { DashboardChart } from "@/components/dashboard/shared/dashboard-chart";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";
import { SiteHeader } from "@/components/layout/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { buscarGraficoGestor } from "@/services/dashboard.service";

import type { GraficoResponseGestor } from "@/types/dashboard";

export function AnalisesGestorContent() {
  const [anoInicial, setAnoInicial] = useState("2015");
  const [anoFinal, setAnoFinal] = useState("2022");

  const [municipiosSelecionados, setMunicipiosSelecionados] = useState<
    string[]
  >([]);

  const [dados, setDados] = useState<GraficoResponseGestor | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // ==============================
  // CARREGAR DADOS
  // ==============================

  const carregarAnalises = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resultado = await buscarGraficoGestor({
        cultura: "milho",
        de: anoInicial,
        ate: anoFinal,
      });

      setDados(resultado);

      const tabela = Array.isArray(resultado.kpis?.tabela)
        ? resultado.kpis.tabela
        : [];

      const codigos = tabela.map((item) => item.codigo);

      setMunicipiosSelecionados((atuais) => {
        const aindaValidos = atuais.filter((codigo) =>
          codigos.includes(codigo),
        );

        if (aindaValidos.length > 0) {
          return aindaValidos;
        }

        return codigos;
      });
    } catch (error) {
      setDados(null);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível carregar os dados.");
      }
    } finally {
      setCarregando(false);
    }
  }, [anoInicial, anoFinal]);

  // ==============================
  // CARREGA AO ALTERAR PERÍODO
  // ==============================

  useEffect(() => {
    carregarAnalises();
  }, [carregarAnalises]);

  // ==============================
  // TABELA
  // ==============================

  const tabela =
    dados && Array.isArray(dados.kpis?.tabela) ? dados.kpis.tabela : [];

  const tabelaFiltrada = tabela.filter((item) =>
    municipiosSelecionados.includes(item.codigo),
  );

  const nomesMunicipiosSelecionados = tabelaFiltrada.map(
    (item) => item.municipio,
  );

  // ==============================
  // CONVERSÃO DE VALORES
  // ==============================

  function extrairNumero(valor: string | null) {
    if (!valor) return 0;

    return Number(
      valor
        .replace(/[^\d.,]/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    );
  }

  // ==============================
  // MAIOR / MENOR PRODUTIVIDADE
  // ==============================

  const municipiosOrdenados = [...tabelaFiltrada].sort(
    (a, b) =>
      extrairNumero(b.produtividade_media) -
      extrairNumero(a.produtividade_media),
  );

  const maiorProdutividade =
    municipiosOrdenados.length > 0 ? municipiosOrdenados[0] : null;

  const menorProdutividade =
    municipiosOrdenados.length > 0
      ? municipiosOrdenados[municipiosOrdenados.length - 1]
      : null;

  const diferencaProdutividade =
    maiorProdutividade && menorProdutividade
      ? extrairNumero(maiorProdutividade.produtividade_media) -
        extrairNumero(menorProdutividade.produtividade_media)
      : 0;

  // ==============================
  // GRÁFICO
  // ==============================

  const figuraFiltrada = dados
    ? {
        ...dados.figura,

        data: Array.isArray(dados.figura?.data)
          ? dados.figura.data.map((serie) => {
              const x = Array.isArray(serie.x) ? serie.x : [];
              const y = Array.isArray(serie.y) ? serie.y : [];

              // ==============================
              // GRÁFICO POR MUNICÍPIO
              // ==============================

              const eixoXTemMunicipios = x.some((valor) =>
                nomesMunicipiosSelecionados.includes(String(valor)),
              );

              if (eixoXTemMunicipios) {
                const pontos = x
                  .map((municipio, index) => ({
                    municipio: String(municipio),
                    valor: y[index],
                  }))
                  .filter((ponto) =>
                    nomesMunicipiosSelecionados.includes(ponto.municipio),
                  );

                return {
                  ...serie,
                  x: pontos.map((ponto) => ponto.municipio),
                  y: pontos.map((ponto) => ponto.valor),
                };
              }

              // ==============================
              // GRÁFICO TEMPORAL
              // ==============================

              const eixoRepresentaAnos =
                x.length > 0 &&
                x.every((valor) => {
                  const numero = Number(valor);

                  return (
                    !Number.isNaN(numero) && numero >= 1900 && numero <= 2100
                  );
                });

              if (eixoRepresentaAnos) {
                const pontos = x
                  .map((ano, index) => ({
                    ano: Number(ano),
                    valor: y[index],
                  }))
                  .filter(
                    (ponto) =>
                      ponto.ano >= Number(anoInicial) &&
                      ponto.ano <= Number(anoFinal),
                  );

                return {
                  ...serie,
                  x: pontos.map((ponto) => ponto.ano),
                  y: pontos.map((ponto) => ponto.valor),
                };
              }

              return serie;
            })
          : [],

        layout: {
          ...dados.figura.layout,

          title: {
            text:
              tabelaFiltrada.length > 1
                ? "Comparação da produtividade entre municípios"
                : tabelaFiltrada.length === 1
                  ? `Análise de produtividade — ${tabelaFiltrada[0].municipio}`
                  : "Selecione pelo menos um município",
          },

          showlegend: true,
          hovermode: "x unified",
        },
      }
    : null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebarGestor
        anoInicial={anoInicial}
        anoFinal={anoFinal}
        municipiosSelecionados={municipiosSelecionados}
        onAnoInicialChange={setAnoInicial}
        onAnoFinalChange={setAnoFinal}
        onMunicipiosChange={setMunicipiosSelecionados}
      />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-6 p-4 md:p-6">
              {/* LOADING */}

              {carregando && <DashboardLoading />}

              {/* ERRO */}

              {!carregando && erro && (
                <DashboardError message={erro} onRetry={carregarAnalises} />
              )}

              {/* CONTEÚDO */}

              {!carregando && !erro && dados && figuraFiltrada && (
                <>
                  {/* CABEÇALHO */}

                  <div>
                    <h1 className="text-2xl font-bold">
                      Análises comparativas
                    </h1>

                    <p className="text-sm text-muted-foreground">
                      Compare a evolução da produtividade entre os municípios
                      selecionados.
                    </p>
                  </div>

                  {/* KPIs */}

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Municípios comparados
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {tabelaFiltrada.length}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Período analisado
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {anoInicial}–{anoFinal}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Diferença de produtividade
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {diferencaProdutividade.toLocaleString("pt-BR")} kg/ha
                      </p>
                    </div>
                  </div>

                  {/* GRÁFICO */}

                  {tabelaFiltrada.length > 0 ? (
                    <DashboardChart figura={figuraFiltrada} />
                  ) : (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                      <h2 className="font-semibold">
                        Nenhum município selecionado
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Pesquise e selecione pelo menos um município para
                        comparar.
                      </p>
                    </div>
                  )}

                  {/* MAIOR / MENOR */}

                  {maiorProdutividade && menorProdutividade && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">
                          Maior produtividade
                        </p>

                        <p className="mt-2 text-xl font-bold">
                          {maiorProdutividade.municipio}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {maiorProdutividade.produtividade_media}
                        </p>
                      </div>

                      <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">
                          Menor produtividade
                        </p>

                        <p className="mt-2 text-xl font-bold">
                          {menorProdutividade.municipio}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {menorProdutividade.produtividade_media}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
