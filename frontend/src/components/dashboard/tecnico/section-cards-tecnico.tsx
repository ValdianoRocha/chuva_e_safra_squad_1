"use client"

import type { KpisTecnico } from "@/types/dashboard"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  CloudRainIcon,
  SproutIcon,
  TrendingUpIcon,
} from "lucide-react"

type SectionCardsTecnicoProps = {
  kpis: KpisTecnico
}

export function SectionCardsTecnico({
  kpis,
}: SectionCardsTecnicoProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">

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
            Média dos municípios selecionados
          </div>

          <div className="text-muted-foreground">
            Produtividade regional
          </div>
        </CardFooter>
      </Card>

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
            Acumulado da região analisada
          </div>

          <div className="text-muted-foreground">
            Precipitação no período
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>
              Tendência
            </CardDescription>

            <TrendingUpIcon className="size-5 text-muted-foreground" />
          </div>

          <CardTitle className="text-2xl font-semibold capitalize @[250px]/card:text-3xl">
            {kpis.tendencia ?? "Sem dados"}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="font-medium">
            Comportamento regional
          </div>

          <div className="text-muted-foreground">
            Tendência no período analisado
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}