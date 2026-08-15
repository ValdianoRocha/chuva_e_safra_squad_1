"use client"

import dynamic from "next/dynamic"

import type { Data, Layout } from "plotly.js"
import type { Figura } from "@/types/dashboard"

const Plot = dynamic(
  () => import("react-plotly.js").then((mod) => mod.default),
  {
    ssr: false,
  }
)

type DashboardChartProps = {
  figura: Figura
}

export function DashboardChart({
  figura,
}: DashboardChartProps) {
  return (
    <div className="relative h-112.5 w-full overflow-hidden rounded-xl border bg-card">
      <Plot
        data={figura.data as Data[]}
        layout={
          {
            ...figura.layout,

            autosize: true,

            margin: {
              l: 60,
              r: 60,
              t: 60,
              b: 70,
            },

            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
          } as Partial<Layout>
        }
        config={{
          responsive: true,
          displaylogo: false,
          displayModeBar: false,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        useResizeHandler
      />
    </div>
  )
}