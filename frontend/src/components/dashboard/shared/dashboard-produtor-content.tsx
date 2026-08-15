"use client";

import { useCallback, useEffect, useState } from "react";

import { AppSidebarProdutor } from "@/components/layout/app-sidebar-produtor";
import { DashboardChart } from "@/components/dashboard/shared/dashboard-chart";
import { DashboardContext } from "@/components/dashboard/produtor/dashboard-context";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";
import { SectionCards } from "@/components/dashboard/produtor/section-cards";
import { SiteHeader } from "@/components/layout/site-header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { buscarGraficoProdutor } from "@/services/dashboard.service";

import type { GraficoResponseProdutor } from "@/types/dashboard";

export function DashboardContent() {
  const [cultura, setCultura] = useState("milho");
  const [anoInicial, setAnoInicial] = useState("2015");
  const [anoFinal, setAnoFinal] = useState("2022");

  const [dados, setDados] = useState<GraficoResponseProdutor | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Por enquanto continua fixo.
  // Depois pode vir dos dados do usuário autenticado.
  const municipio = "Amontada";

  // ==============================
  // CARREGAR DASHBOARD
  // ==============================

  const carregarDashboard = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resultado = await buscarGraficoProdutor({
        cultura,
        de: anoInicial,
        ate: anoFinal,
      });

      setDados(resultado);
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

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebarProdutor
        cultura={cultura}
        anoInicial={anoInicial}
        anoFinal={anoFinal}
        onCulturaChange={setCultura}
        onAnoInicialChange={setAnoInicial}
        onAnoFinalChange={setAnoFinal}
      />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DashboardContext
                cultura={cultura}
                municipio={municipio}
                anoInicial={anoInicial}
                anoFinal={anoFinal}
              />

              {/* LOADING */}
              {carregando && <DashboardLoading />}

              {/* ERRO */}
              {!carregando && erro && (
                <DashboardError message={erro} onRetry={carregarDashboard} />
              )}

              {/* DADOS */}
              {!carregando && !erro && dados && (
                <>
                  <SectionCards kpis={dados.kpis} />

                  <div className="px-4 lg:px-6">
                    <DashboardChart figura={dados.figura} />
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
