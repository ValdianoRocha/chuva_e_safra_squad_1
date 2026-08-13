"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartData = [
  { ano: "2015", produtividade: 1650, chuva: 620 },
  { ano: "2016", produtividade: 1780, chuva: 710 },
  { ano: "2017", produtividade: 1520, chuva: 540 },
  { ano: "2018", produtividade: 1920, chuva: 830 },
  { ano: "2019", produtividade: 1810, chuva: 760 },
  { ano: "2020", produtividade: 2050, chuva: 910 },
  { ano: "2021", produtividade: 2180, chuva: 980 },
  { ano: "2022", produtividade: 1960, chuva: 820 },
];

const chartConfig = {
  produtividade: {
    label: "Produtividade",
    color: "var(--primary)",
  },

  chuva: {
    label: "Chuva",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Chuva e produtividade</CardTitle>

        <CardDescription>
          Evolução da chuva e da produtividade entre 2015 e 2022
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-75 w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id="fillProdutividade"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-produtividade)"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-produtividade)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillChuva" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chuva)"
                  stopOpacity={0.6}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-chuva)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="ano"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <YAxis
              yAxisId="produtividade"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={45}
            />

            <YAxis
              yAxisId="chuva"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={45}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Area
              yAxisId="produtividade"
              dataKey="produtividade"
              type="natural"
              fill="url(#fillProdutividade)"
              stroke="var(--color-produtividade)"
              strokeWidth={2}
            />

            <Area
              yAxisId="chuva"
              dataKey="chuva"
              type="natural"
              fill="url(#fillChuva)"
              stroke="var(--color-chuva)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-primary" />
            Produtividade (kg/ha)
          </div>

          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-chart-2" />
            Chuva (mm)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
