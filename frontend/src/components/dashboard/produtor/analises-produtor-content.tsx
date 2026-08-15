"use client";

import { useState } from "react";

import { AppSidebarProdutor } from "@/components/layout/app-sidebar-produtor";
import { DashboardChart } from "@/components/dashboard/shared/dashboard-chart";
import { SiteHeader } from "@/components/layout/site-header";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const anos = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];

const produtividade = [
  1650,
  1780,
  1520,
  1920,
  1810,
  2050,
  2180,
  1960,
];

const chuva = [
  620,
  710,
  540,
  830,
  760,
  910,
  980,
  820,
];

export function AnalisesProdutorContent() {
  const [cultura, setCultura] = useState("milho");
  const [anoInicial, setAnoInicial] = useState("2015");
  const [anoFinal, setAnoFinal] = useState("2022");

  const pontosFiltrados = anos
    .map((ano, index) => ({
      ano,
      produtividade: produtividade[index],
      chuva: chuva[index],
    }))
    .filter(
      (item) =>
        item.ano >= Number(anoInicial) &&
        item.ano <= Number(anoFinal),
    );

  const produtividadeMedia =
    pontosFiltrados.length > 0
      ? pontosFiltrados.reduce(
          (total, item) => total + item.produtividade,
          0,
        ) / pontosFiltrados.length
      : 0;

  const chuvaMedia =
    pontosFiltrados.length > 0
      ? pontosFiltrados.reduce(
          (total, item) => total + item.chuva,
          0,
        ) / pontosFiltrados.length
      : 0;

  const melhorAno =
    pontosFiltrados.length > 0
      ? pontosFiltrados.reduce((melhor, atual) =>
          atual.produtividade > melhor.produtividade
            ? atual
            : melhor,
        )
      : null;

  const figura = {
    data: [
      {
        x: pontosFiltrados.map((item) => item.ano),
        y: pontosFiltrados.map((item) => item.produtividade),

        type: "scatter",
        mode: "lines+markers",

        name: "Produtividade",

        line: {
          width: 3,
        },

        marker: {
          size: 7,
        },

        yaxis: "y",
      },

      {
        x: pontosFiltrados.map((item) => item.ano),
        y: pontosFiltrados.map((item) => item.chuva),

        type: "bar",

        name: "Chuva",

        opacity: 0.35,

        yaxis: "y2",
      },
    ],

    layout: {
      title: {
        text: "Chuva × produtividade",
      },

      xaxis: {
        title: {
          text: "Ano",
        },
      },

      yaxis: {
        title: {
          text: "Produtividade (kg/ha)",
        },
      },

      yaxis2: {
        title: {
          text: "Chuva (mm)",
        },

        overlaying: "y",
        side: "right",
      },

      hovermode: "x unified",

      legend: {
        orientation: "h",
        x: 0,
        y: 1.15,
      },

      margin: {
        t: 90,
        r: 70,
        b: 60,
        l: 70,
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
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-6 p-4 md:p-6">

              <div>
                <h1 className="text-2xl font-bold">
                  Análises
                </h1>

                <p className="text-sm text-muted-foreground">
                  Acompanhe a relação entre chuva e produtividade da sua safra.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {cultura.charAt(0).toUpperCase() + cultura.slice(1)}
                </span>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  Amontada
                </span>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {anoInicial} — {anoFinal}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-5">
                  <p className="text-sm text-muted-foreground">
                    Produtividade média
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {pontosFiltrados.length > 0
                      ? `${Math.round(
                          produtividadeMedia,
                        ).toLocaleString("pt-BR")} kg/ha`
                      : "Sem dados"}
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-5">
                  <p className="text-sm text-muted-foreground">
                    Chuva média
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {pontosFiltrados.length > 0
                      ? `${Math.round(
                          chuvaMedia,
                        ).toLocaleString("pt-BR")} mm`
                      : "Sem dados"}
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-5">
                  <p className="text-sm text-muted-foreground">
                    Melhor ano
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {melhorAno
                      ? melhorAno.ano
                      : "Sem dados"}
                  </p>

                  {melhorAno && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {melhorAno.produtividade.toLocaleString("pt-BR")} kg/ha
                    </p>
                  )}
                </div>
              </div>

              <DashboardChart figura={figura} />

              <div className="overflow-hidden rounded-xl border bg-card">
                <div className="border-b px-6 py-4">
                  <h2 className="font-semibold">
                    Histórico analisado
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Valores utilizados na comparação entre chuva e produtividade.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="px-6 py-3 text-left font-medium">
                          Ano
                        </th>

                        <th className="px-6 py-3 text-right font-medium">
                          Produtividade
                        </th>

                        <th className="px-6 py-3 text-right font-medium">
                          Chuva
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {pontosFiltrados.map((item) => (
                        <tr
                          key={item.ano}
                          className="border-b last:border-0"
                        >
                          <td className="px-6 py-4 font-medium">
                            {item.ano}
                          </td>

                          <td className="px-6 py-4 text-right">
                            {item.produtividade.toLocaleString("pt-BR")} kg/ha
                          </td>

                          <td className="px-6 py-4 text-right">
                            {item.chuva.toLocaleString("pt-BR")} mm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}