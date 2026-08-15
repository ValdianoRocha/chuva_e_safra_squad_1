"use client";

import { useCallback, useEffect, useState } from "react";

import { AppSidebarTecnico } from "@/components/layout/app-sidebar-tecnico";
import { DashboardChart } from "@/components/dashboard/shared/dashboard-chart";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";
import { SiteHeader } from "@/components/layout/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { buscarGraficoTecnico } from "@/services/dashboard.service";

import type { GraficoResponseTecnico } from "@/types/dashboard";

export function AnalisesTecnicoContent() {
  const [cultura, setCultura] = useState("milho");
  const [anoInicial, setAnoInicial] = useState("2015");
  const [anoFinal, setAnoFinal] = useState("2022");

  const [municipiosSelecionados, setMunicipiosSelecionados] = useState<
    string[]
  >([]);

  const [dados, setDados] = useState<GraficoResponseTecnico | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // ==============================
  // CARREGAR DADOS
  // ==============================

  const carregarAnalises = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resultado = await buscarGraficoTecnico({
        cultura,
        de: anoInicial,
        ate: anoFinal,
      });

      setDados(resultado);

      // ==============================
      // MUNICÍPIOS DISPONÍVEIS
      // ==============================

      const tabela = Array.isArray(resultado.kpis?.tabela)
        ? resultado.kpis.tabela
        : [];

      const codigosDisponiveis = tabela.map((item) => item.codigo);

      setMunicipiosSelecionados((atuais) => {
        // Mantém apenas municípios que ainda existem
        // na nova resposta da API.
        const aindaValidos = atuais.filter((codigo) =>
          codigosDisponiveis.includes(codigo),
        );

        // Se ainda temos seleção válida, mantém.
        if (aindaValidos.length > 0) {
          return aindaValidos;
        }

        // Primeira carga ou mudança de cultura:
        // seleciona todos.
        return codigosDisponiveis;
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
  }, [cultura, anoInicial, anoFinal]);

  // ==============================
  // CARREGA AO ALTERAR FILTROS
  // ==============================

  useEffect(() => {
    carregarAnalises();
  }, [carregarAnalises]);

  // ==============================
  // TABELA SEGURA
  // ==============================

  const tabela =
    dados && Array.isArray(dados.kpis?.tabela) ? dados.kpis.tabela : [];

  const tabelaFiltrada = tabela.filter((item) =>
    municipiosSelecionados.includes(item.codigo),
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
  // KPIs
  // ==============================

  const produtividadeMedia =
    tabelaFiltrada.length > 0
      ? tabelaFiltrada.reduce(
          (total, item) => total + extrairNumero(item.produtividade_media),
          0,
        ) / tabelaFiltrada.length
      : 0;

  const chuvaMedia =
    tabelaFiltrada.length > 0
      ? tabelaFiltrada.reduce(
          (total, item) => total + extrairNumero(item.chuva_total),
          0,
        ) / tabelaFiltrada.length
      : 0;

  // ==============================
  // MUNICÍPIOS SELECIONADOS
  // ==============================

  const nomesMunicipiosSelecionados = tabelaFiltrada.map(
    (item) => item.municipio,
  );

  // ==============================
  // FILTRO DO GRÁFICO
  // ==============================

  const figuraFiltrada = dados
    ? {
        ...dados.figura,

        data: Array.isArray(dados.figura?.data)
          ? dados.figura.data.map((serie) => {
              const x = Array.isArray(serie.x) ? serie.x : [];
              const y = Array.isArray(serie.y) ? serie.y : [];
              const text = Array.isArray(serie.text) ? serie.text : [];

              // Se a série não possuir municípios,
              // mantém como veio do backend.
              if (text.length === 0) {
                return serie;
              }

              const pontos = text
                .map((municipio, index) => ({
                  municipio: String(municipio),
                  x: x[index],
                  y: y[index],
                }))
                .filter((ponto) =>
                  nomesMunicipiosSelecionados.includes(ponto.municipio),
                );

              return {
                ...serie,

                x: pontos.map((ponto) => ponto.x),

                y: pontos.map((ponto) => ponto.y),

                text: pontos.map((ponto) => ponto.municipio),
              };
            })
          : [],

        layout: {
          ...dados.figura.layout,

          title: {
            text: "Chuva × produtividade por município",
          },

          hovermode: "closest",

          margin: {
            t: 80,
            r: 50,
            b: 70,
            l: 70,
          },
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
      <AppSidebarTecnico
        cultura={cultura}
        anoInicial={anoInicial}
        anoFinal={anoFinal}
        municipiosSelecionados={municipiosSelecionados}
        onCulturaChange={setCultura}
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

              {!carregando && !erro && dados && (
                <>
                  {/* CABEÇALHO */}

                  <div>
                    <h1 className="text-2xl font-bold">Análises</h1>

                    <p className="text-sm text-muted-foreground">
                      Analise a relação entre chuva e produtividade nos
                      municípios acompanhados.
                    </p>
                  </div>

                  {/* KPIs */}

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Produtividade média
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {tabelaFiltrada.length > 0
                          ? `${Math.round(produtividadeMedia).toLocaleString(
                              "pt-BR",
                            )} kg/ha`
                          : "Sem dados"}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Chuva média
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {tabelaFiltrada.length > 0
                          ? `${Math.round(chuvaMedia).toLocaleString(
                              "pt-BR",
                            )} mm`
                          : "Sem dados"}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Municípios analisados
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {tabelaFiltrada.length}
                      </p>
                    </div>
                  </div>

                  {/* GRÁFICO */}

                  {municipiosSelecionados.length > 0 && figuraFiltrada ? (
                    <DashboardChart figura={figuraFiltrada} />
                  ) : (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                      <h2 className="font-semibold">
                        Nenhum município selecionado
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Selecione pelo menos um município para visualizar a
                        análise.
                      </p>
                    </div>
                  )}

                  {/* TABELA */}

                  <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="border-b px-6 py-4">
                      <h2 className="font-semibold">
                        Comparativo dos municípios
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        Resumo dos municípios selecionados.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr className="border-b">
                            <th className="px-6 py-3 text-left font-medium">
                              Município
                            </th>

                            <th className="px-6 py-3 text-left font-medium">
                              Código IBGE
                            </th>

                            <th className="px-6 py-3 text-right font-medium">
                              Produtividade média
                            </th>

                            <th className="px-6 py-3 text-right font-medium">
                              Chuva
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {tabelaFiltrada.map((item) => (
                            <tr
                              key={item.codigo}
                              className="border-b last:border-0"
                            >
                              <td className="px-6 py-4 font-medium">
                                {item.municipio}
                              </td>

                              <td className="px-6 py-4 text-muted-foreground">
                                {item.codigo}
                              </td>

                              <td className="px-6 py-4 text-right">
                                {item.produtividade_media ?? "Sem dados"}
                              </td>

                              <td className="px-6 py-4 text-right">
                                {item.chuva_total ?? "Sem dados"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {tabelaFiltrada.length === 0 && (
                      <div className="p-10 text-center">
                        <p className="font-medium">
                          Nenhum município selecionado
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Selecione municípios na barra lateral.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
