"use client";

import { useCallback, useEffect, useState } from "react";

import { TabelaMunicipios } from "@/components/dashboard/tecnico/tabela-municipios";
import { AppSidebarTecnico } from "@/components/layout/app-sidebar-tecnico";
import { DashboardChart } from "@/components/dashboard/shared/dashboard-chart";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";
import { SectionCardsTecnico } from "@/components/dashboard/tecnico/section-cards-tecnico";
import { SiteHeader } from "@/components/layout/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { buscarGraficoTecnico } from "@/services/dashboard.service";

import type { GraficoResponseTecnico } from "@/types/dashboard";

export function DashboardTecnicoContent() {
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
  // CARREGAR DASHBOARD
  // ==============================

  const carregarDashboard = useCallback(async () => {
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
        const aindaValidos = atuais.filter((codigo) =>
          codigosDisponiveis.includes(codigo),
        );

        if (aindaValidos.length > 0) {
          return aindaValidos;
        }

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
    carregarDashboard();
  }, [carregarDashboard]);

  // ==============================
  // TABELA
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

  const chuvaTotal = tabelaFiltrada.reduce(
    (total, item) => total + extrairNumero(item.chuva_total),
    0,
  );

  const kpisFiltrados = dados
    ? {
        ...dados.kpis,

        produtividade_media:
          tabelaFiltrada.length > 0
            ? `${Math.round(produtividadeMedia).toLocaleString("pt-BR")} kg/ha`
            : null,

        chuva_total:
          tabelaFiltrada.length > 0
            ? `${Math.round(chuvaTotal).toLocaleString("pt-BR")} mm`
            : null,
      }
    : null;

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

              // ==============================
              // CASO 1
              // MUNICÍPIOS EM "text"
              // ==============================

              if (text.length > 0) {
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
              }

              // ==============================
              // CASO 2
              // MUNICÍPIOS NO EIXO X
              // ==============================

              const eixoXTemMunicipios = x.some((valor) =>
                nomesMunicipiosSelecionados.includes(String(valor)),
              );

              if (eixoXTemMunicipios) {
                const pontos = x
                  .map((municipio, index) => ({
                    municipio: String(municipio),
                    y: y[index],
                  }))
                  .filter((ponto) =>
                    nomesMunicipiosSelecionados.includes(ponto.municipio),
                  );

                return {
                  ...serie,

                  x: pontos.map((ponto) => ponto.municipio),

                  y: pontos.map((ponto) => ponto.y),
                };
              }

              return serie;
            })
          : [],
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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* ==============================
                  LOADING
              ============================== */}

              {carregando && <DashboardLoading />}

              {/* ==============================
                  ERRO
              ============================== */}

              {!carregando && erro && (
                <DashboardError message={erro} onRetry={carregarDashboard} />
              )}

              {/* ==============================
                  DADOS
              ============================== */}

              {!carregando &&
                !erro &&
                dados &&
                kpisFiltrados &&
                figuraFiltrada && (
                  <>
                    <SectionCardsTecnico kpis={kpisFiltrados} />

                    <div className="px-4 lg:px-6">
                      {municipiosSelecionados.length > 0 ? (
                        <DashboardChart figura={figuraFiltrada} />
                      ) : (
                        <div className="rounded-xl border border-dashed p-10 text-center">
                          <p className="font-medium">
                            Nenhum município selecionado
                          </p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Selecione pelo menos um município para visualizar o
                            gráfico.
                          </p>
                        </div>
                      )}
                    </div>

                    <TabelaMunicipios dados={tabelaFiltrada} />
                  </>
                )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}