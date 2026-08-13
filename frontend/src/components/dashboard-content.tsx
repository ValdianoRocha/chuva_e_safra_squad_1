"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardChart } from "@/components/dashboard-chart";
import { DashboardContext } from "@/components/dashboard-context";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

import { dashboardProdutorMock } from "@/mocks/dashboard-produtor.mock";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function DashboardContent() {
  const [cultura, setCultura] = useState("milho");
  const [anoInicial, setAnoInicial] = useState("2015");
  const [anoFinal, setAnoFinal] = useState("2022");

  const dados = dashboardProdutorMock;

  // Filtra os dados do gráfico pelo período selecionado
  const dadosFiltrados = {
    ...dados,

    figura: {
      ...dados.figura,

      data: dados.figura.data.map((serie) => {
        const x = Array.isArray(serie.x) ? serie.x : [];
        const y = Array.isArray(serie.y) ? serie.y : [];

        const pontosFiltrados = x
          .map((ano, index) => ({
            ano: Number(ano),
            valor: y[index],
          }))
          .filter(
            (ponto) =>
              ponto.ano >= Number(anoInicial) && ponto.ano <= Number(anoFinal),
          );

        return {
          ...serie,
          x: pontosFiltrados.map((ponto) => ponto.ano),
          y: pontosFiltrados.map((ponto) => ponto.valor),
        };
      }),

      layout: {
        ...dados.figura.layout,

        title: {
          text: "Chuva e produtividade",
        },
      },
    },
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
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
                municipio="Amontada"
                anoInicial={anoInicial}
                anoFinal={anoFinal}
              />

              <SectionCards kpis={dados.kpis} />

              <div className="px-4 lg:px-6">
                <DashboardChart figura={dadosFiltrados.figura} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
