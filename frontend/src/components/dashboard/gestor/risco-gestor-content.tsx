"use client";

import { useCallback, useEffect, useState } from "react";

import { AppSidebarGestor } from "@/components/layout/app-sidebar-gestor";
import { SiteHeader } from "@/components/layout/site-header";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";

import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { buscarGraficoGestor } from "@/services/dashboard.service";

import type { GraficoResponseGestor } from "@/types/dashboard";

import { TriangleAlertIcon, MapPinnedIcon, PercentIcon } from "lucide-react";

export function RiscoGestorContent() {
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

  const carregarRisco = useCallback(async () => {
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
    carregarRisco();
  }, [carregarRisco]);

  // ==============================
  // TABELA
  // ==============================

  const tabela =
    dados && Array.isArray(dados.kpis?.tabela) ? dados.kpis.tabela : [];

  const municipiosRisco =
    dados && Array.isArray(dados.kpis?.municipios_risco)
      ? dados.kpis.municipios_risco
      : [];

  const municipiosRiscoSelecionados = tabela.filter(
    (item) =>
      municipiosSelecionados.includes(item.codigo) &&
      municipiosRisco.includes(item.municipio),
  );

  // ==============================
  // PERCENTUAL DE RISCO
  // ==============================

  const percentualRisco =
    municipiosSelecionados.length > 0
      ? Math.round(
          (municipiosRiscoSelecionados.length / municipiosSelecionados.length) *
            100,
        )
      : 0;

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
                <DashboardError message={erro} onRetry={carregarRisco} />
              )}

              {/* CONTEÚDO */}

              {!carregando && !erro && dados && (
                <>
                  {/* CABEÇALHO */}

                  <div>
                    <h1 className="text-2xl font-bold">Municípios em risco</h1>

                    <p className="text-sm text-muted-foreground">
                      Municípios sinalizados para acompanhamento no período
                      selecionado.
                    </p>
                  </div>

                  {/* KPIs */}

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Municípios em risco
                        </p>

                        <TriangleAlertIcon className="size-5 text-muted-foreground" />
                      </div>

                      <p className="mt-2 text-2xl font-bold">
                        {municipiosRiscoSelecionados.length}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Municípios analisados
                        </p>

                        <MapPinnedIcon className="size-5 text-muted-foreground" />
                      </div>

                      <p className="mt-2 text-2xl font-bold">
                        {municipiosSelecionados.length}
                      </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Percentual em risco
                        </p>

                        <PercentIcon className="size-5 text-muted-foreground" />
                      </div>

                      <p className="mt-2 text-2xl font-bold">
                        {percentualRisco}%
                      </p>
                    </div>
                  </div>

                  {/* LISTA DE RISCO */}

                  <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="border-b px-6 py-4">
                      <h2 className="font-semibold">
                        Municípios que exigem atenção
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        O critério de risco será definido pela equipe de Dados.
                      </p>
                    </div>

                    {municipiosRiscoSelecionados.length > 0 ? (
                      <div className="divide-y">
                        {municipiosRiscoSelecionados.map((item) => (
                          <div
                            key={item.codigo}
                            className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{item.municipio}</p>

                                <Badge variant="destructive">Em risco</Badge>
                              </div>

                              <p className="mt-1 text-sm text-muted-foreground">
                                Código IBGE: {item.codigo}
                              </p>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-xs text-muted-foreground">
                                Produtividade média
                              </p>

                              <p className="font-medium">
                                {item.produtividade_media ?? "Sem dados"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center">
                        <h2 className="font-semibold">
                          Nenhum município em risco
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Nenhum dos municípios selecionados está sinalizado
                          como risco nos dados atuais.
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
