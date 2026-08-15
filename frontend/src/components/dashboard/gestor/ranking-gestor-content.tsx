"use client";

import { useCallback, useEffect, useState } from "react";

import { AppSidebarGestor } from "@/components/layout/app-sidebar-gestor";
import { SiteHeader } from "@/components/layout/site-header";
import { TabelaRanking } from "@/components/dashboard/gestor/tabela-ranking";

import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { buscarGraficoGestor } from "@/services/dashboard.service";

import type { GraficoResponseGestor } from "@/types/dashboard";

export function RankingGestorContent() {
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

  const carregarRanking = useCallback(async () => {
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
    carregarRanking();
  }, [carregarRanking]);

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
  // RANKING
  // ==============================

  const rankingFiltrado = [...tabelaFiltrada]
    .sort(
      (a, b) =>
        extrairNumero(b.produtividade_media) -
        extrairNumero(a.produtividade_media),
    )
    .map((item, index) => ({
      ...item,
      ranking: index + 1,
    }));

  // ==============================
  // MUNICÍPIOS EM RISCO
  // ==============================

  const municipiosRisco =
    dados && Array.isArray(dados.kpis?.municipios_risco)
      ? dados.kpis.municipios_risco
      : [];

  const municipiosRiscoFiltrados = municipiosRisco.filter((nomeMunicipio) =>
    rankingFiltrado.some((item) => item.municipio === nomeMunicipio),
  );

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
                <DashboardError message={erro} onRetry={carregarRanking} />
              )}

              {/* CONTEÚDO */}

              {!carregando && !erro && dados && (
                <>
                  {/* CABEÇALHO */}

                  <div>
                    <h1 className="text-2xl font-bold">
                      Ranking de produtividade
                    </h1>

                    <p className="text-sm text-muted-foreground">
                      Comparação da produtividade média entre os municípios
                      selecionados.
                    </p>
                  </div>

                  {/* RESUMO */}

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Municípios selecionados
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {rankingFiltrado.length}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Maior produtividade
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {rankingFiltrado.length > 0
                          ? rankingFiltrado[0].produtividade_media
                          : "Sem dados"}
                      </p>

                      {rankingFiltrado.length > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {rankingFiltrado[0].municipio}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                      <p className="text-sm text-muted-foreground">
                        Menor produtividade
                      </p>

                      <p className="mt-2 text-2xl font-bold">
                        {rankingFiltrado.length > 0
                          ? rankingFiltrado[rankingFiltrado.length - 1]
                              .produtividade_media
                          : "Sem dados"}
                      </p>

                      {rankingFiltrado.length > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {
                            rankingFiltrado[rankingFiltrado.length - 1]
                              .municipio
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RANKING */}

                  {rankingFiltrado.length > 0 ? (
                    <TabelaRanking
                      dados={rankingFiltrado}
                      municipiosRisco={municipiosRiscoFiltrados}
                    />
                  ) : (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                      <h2 className="font-semibold">
                        Nenhum município selecionado
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Selecione pelo menos um município nos filtros para
                        visualizar o ranking.
                      </p>
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