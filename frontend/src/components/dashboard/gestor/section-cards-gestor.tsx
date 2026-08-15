"use client";

import type { KpisGestor } from "@/types/dashboard";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  CloudRainIcon,
  SproutIcon,
  MapPinnedIcon,
  TriangleAlertIcon,
} from "lucide-react";

type SectionCardsGestorProps = {
  kpis: KpisGestor;
};

export function SectionCardsGestor({
  kpis,
}: SectionCardsGestorProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">

      {/* Produtividade */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>
              Produtividade média
            </CardDescription>

            <SproutIcon className="size-5 text-muted-foreground" />
          </div>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {kpis.produtividade_media ?? "Sem dados"}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">
            Média estadual
          </div>

          <div className="text-muted-foreground">
            Produtividade no período analisado
          </div>
        </CardFooter>
      </Card>

      {/* Chuva */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>
              Chuva total
            </CardDescription>

            <CloudRainIcon className="size-5 text-muted-foreground" />
          </div>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {kpis.chuva_total ?? "Sem dados"}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">
            Acumulado estadual
          </div>

          <div className="text-muted-foreground">
            Precipitação no período analisado
          </div>
        </CardFooter>
      </Card>

      {/* Municípios */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>
              Municípios analisados
            </CardDescription>

            <MapPinnedIcon className="size-5 text-muted-foreground" />
          </div>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {kpis.total_municipios}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">
            Cobertura estadual
          </div>

          <div className="text-muted-foreground">
            Municípios incluídos na análise
          </div>
        </CardFooter>
      </Card>

      {/* Risco */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>
              Municípios em risco
            </CardDescription>

            <TriangleAlertIcon className="size-5 text-muted-foreground" />
          </div>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {kpis.municipios_risco.length}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">
            Atenção necessária
          </div>

          <div className="text-muted-foreground">
            Municípios que exigem acompanhamento
          </div>
        </CardFooter>
      </Card>

    </div>
  );
}