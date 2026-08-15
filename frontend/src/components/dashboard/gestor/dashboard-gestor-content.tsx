"use client";

import { useCallback, useEffect, useState } from "react";

import { SectionCardsGestor } from "@/components/dashboard/gestor/section-cards-gestor";
import { AppSidebarGestor } from "@/components/layout/app-sidebar-gestor";
import { DashboardChart } from "@/components/dashboard/shared/dashboard-chart";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";
import { SiteHeader } from "@/components/layout/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { TabelaRanking } from "./tabela-ranking";
import { MunicipiosRisco } from "./municipios-risco";

import { buscarGraficoGestor } from "@/services/dashboard.service";

import type { GraficoResponseGestor } from "@/types/dashboard";

export function DashboardGestorContent() {
  const [anoInicial, setAnoInicial] = useState("2015");
  const [anoFinal, setAnoFinal] = useState("2022");

  const [municipiosSelecionados, setMunicipiosSelecionados] = useState<
    string[]
  >([]);

  const [dados, setDados] = useState<GraficoResponseGestor | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDashboard = useCallback(async () => {
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

  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  const tabela =
    dados && Array.isArray(dados.kpis?.tabela) ? dados.kpis.tabela : [];

  const tabelaFiltrada = tabela.filter((item) =>
    municipiosSelecionados.includes(item.codigo),
  );

  const semMunicipiosSelecionados = tabelaFiltrada.length === 0;

  const top3Ranking = [...tabelaFiltrada]
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, 3);

  const nomesMunicipiosSelecionados = tabelaFiltrada.map(
    (item) => item.municipio,
  );

  function extrairNumero(valor: string | null) {
    if (!valor) return 0;

    return Number(
      valor
        .replace(/[^\d.,]/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    );
  }

  const produtividadeMedia =
    tabelaFiltrada.length > 0
      ? tabelaFiltrada.reduce(
          (total, item) => total + extrairNumero(item.produtividade_media),
          0,
        ) / tabelaFiltrada.length
      : 0;

  const municipiosRisco =
    dados && Array.isArray(dados.kpis?.municipios_risco)
      ? dados.kpis.municipios_risco
      : [];

  const municipiosRiscoFiltrados = municipiosRisco.filter((municipio) =>
    nomesMunicipiosSelecionados.includes(municipio),
  );

  const todosSelecionados =
    tabela.length > 0 && tabelaFiltrada.length === tabela.length;

  const kpisFiltrados = dados
    ? {
        ...dados.kpis,

        produtividade_media:
          tabelaFiltrada.length > 0
            ? `${Math.round(produtividadeMedia).toLocaleString("pt-BR")} kg/ha`
            : null,

        chuva_total: todosSelecionados ? dados.kpis.chuva_total : null,

        total_municipios: tabelaFiltrada.length,

        municipios_risco: municipiosRiscoFiltrados,
      }
    : null;

  const figuraFiltrada = dados
    ? {
        ...dados.figura,

        data: Array.isArray(dados.figura?.data)
          ? dados.figura.data.map((serie) => {
              const x = Array.isArray(serie.x) ? serie.x : [];
              const y = Array.isArray(serie.y) ? serie.y : [];

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
                ? "Visão geral da produtividade estadual"
                : tabelaFiltrada.length === 1
                  ? `Produtividade — ${tabelaFiltrada[0].municipio}`
                  : "Visão geral da produtividade estadual",
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
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {carregando && <DashboardLoading />}

              {!carregando && erro && (
                <DashboardError message={erro} onRetry={carregarDashboard} />
              )}

              {!carregando &&
                !erro &&
                dados &&
                kpisFiltrados &&
                figuraFiltrada && (
                  <>
                    <SectionCardsGestor kpis={kpisFiltrados} />

                    <div className="px-4 lg:px-6">
                      <DashboardChart figura={figuraFiltrada} />
                    </div>

                    {!semMunicipiosSelecionados && (
                      <>
                        <MunicipiosRisco
                          municipios={kpisFiltrados.municipios_risco}
                        />

                        <TabelaRanking
                          dados={top3Ranking}
                          municipiosRisco={kpisFiltrados.municipios_risco}
                        />
                      </>
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
