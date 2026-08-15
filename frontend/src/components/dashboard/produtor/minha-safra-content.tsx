"use client";

import { useState } from "react";

import { AppSidebarProdutor } from "@/components/layout/app-sidebar-produtor";
import { SiteHeader } from "@/components/layout/site-header";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  TrophyIcon,
  TrendingDownIcon,
  SproutIcon,
} from "lucide-react";

const historicoMock = [
  { ano: 2015, produtividade: 1650, chuva: 620 },
  { ano: 2016, produtividade: 1780, chuva: 710 },
  { ano: 2017, produtividade: 1520, chuva: 540 },
  { ano: 2018, produtividade: 1920, chuva: 830 },
  { ano: 2019, produtividade: 1810, chuva: 760 },
  { ano: 2020, produtividade: 2050, chuva: 910 },
  { ano: 2021, produtividade: 2180, chuva: 980 },
  { ano: 2022, produtividade: 1960, chuva: 820 },
];

export function MinhaSafraContent() {
  const [cultura, setCultura] = useState("milho");
  const [anoInicial, setAnoInicial] = useState("2015");
  const [anoFinal, setAnoFinal] = useState("2022");

  // ==============================
  // FILTRO POR PERÍODO
  // ==============================

  const historicoFiltrado = historicoMock.filter(
    (item) =>
      item.ano >= Number(anoInicial) &&
      item.ano <= Number(anoFinal),
  );

  // ==============================
  // MELHOR SAFRA
  // ==============================

  const melhorSafra =
    historicoFiltrado.length > 0
      ? historicoFiltrado.reduce((melhor, atual) =>
          atual.produtividade > melhor.produtividade
            ? atual
            : melhor,
        )
      : null;

  // ==============================
  // MENOR SAFRA
  // ==============================

  const menorSafra =
    historicoFiltrado.length > 0
      ? historicoFiltrado.reduce((menor, atual) =>
          atual.produtividade < menor.produtividade
            ? atual
            : menor,
        )
      : null;

  // ==============================
  // PRODUTIVIDADE MÉDIA
  // ==============================

  const produtividadeMedia =
    historicoFiltrado.length > 0
      ? historicoFiltrado.reduce(
          (total, item) =>
            total + item.produtividade,
          0,
        ) / historicoFiltrado.length
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
      {/* SIDEBAR DO PRODUTOR */}
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

              {/* =========================
                  CABEÇALHO
              ========================= */}

              <div>
                <h1 className="text-2xl font-bold">
                  Minha safra
                </h1>

                <p className="text-sm text-muted-foreground">
                  Histórico de produtividade e chuva da cultura selecionada.
                </p>
              </div>

              {/* =========================
                  CONTEXTO
              ========================= */}

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {cultura.charAt(0).toUpperCase() +
                    cultura.slice(1)}
                </span>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  Amontada
                </span>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {anoInicial} — {anoFinal}
                </span>
              </div>

              {/* =========================
                  KPIs
              ========================= */}

              <div className="grid gap-4 md:grid-cols-3">

                {/* MELHOR SAFRA */}

                <div className="rounded-xl border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Melhor safra
                    </p>

                    <TrophyIcon className="size-5 text-muted-foreground" />
                  </div>

                  <p className="mt-2 text-2xl font-bold">
                    {melhorSafra
                      ? `${melhorSafra.produtividade.toLocaleString(
                          "pt-BR",
                        )} kg/ha`
                      : "Sem dados"}
                  </p>

                  {melhorSafra && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ano {melhorSafra.ano}
                    </p>
                  )}
                </div>

                {/* MENOR SAFRA */}

                <div className="rounded-xl border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Menor safra
                    </p>

                    <TrendingDownIcon className="size-5 text-muted-foreground" />
                  </div>

                  <p className="mt-2 text-2xl font-bold">
                    {menorSafra
                      ? `${menorSafra.produtividade.toLocaleString(
                          "pt-BR",
                        )} kg/ha`
                      : "Sem dados"}
                  </p>

                  {menorSafra && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ano {menorSafra.ano}
                    </p>
                  )}
                </div>

                {/* MÉDIA HISTÓRICA */}

                <div className="rounded-xl border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Média histórica
                    </p>

                    <SproutIcon className="size-5 text-muted-foreground" />
                  </div>

                  <p className="mt-2 text-2xl font-bold">
                    {historicoFiltrado.length > 0
                      ? `${Math.round(
                          produtividadeMedia,
                        ).toLocaleString(
                          "pt-BR",
                        )} kg/ha`
                      : "Sem dados"}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {anoInicial} — {anoFinal}
                  </p>
                </div>
              </div>

              {/* =========================
                  HISTÓRICO
              ========================= */}

              <div className="overflow-hidden rounded-xl border bg-card">

                {/* Cabeçalho da tabela */}

                <div className="border-b px-6 py-4">
                  <h2 className="font-semibold">
                    Histórico da safra
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Produtividade e precipitação registradas por ano.
                  </p>
                </div>

                {/* Tabela */}

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
                      {historicoFiltrado.map((item) => (
                        <tr
                          key={item.ano}
                          className="border-b last:border-0"
                        >
                          <td className="px-6 py-4 font-medium">
                            {item.ano}
                          </td>

                          <td className="px-6 py-4 text-right">
                            {item.produtividade.toLocaleString(
                              "pt-BR",
                            )}{" "}
                            kg/ha
                          </td>

                          <td className="px-6 py-4 text-right">
                            {item.chuva.toLocaleString(
                              "pt-BR",
                            )}{" "}
                            mm
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

                {/* Nenhum resultado */}

                {historicoFiltrado.length === 0 && (
                  <div className="p-10 text-center">
                    <p className="font-medium">
                      Nenhum dado encontrado
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Altere o período selecionado.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}