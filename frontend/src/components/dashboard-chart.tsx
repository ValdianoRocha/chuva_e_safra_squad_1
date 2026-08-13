"use client";

import dynamic from "next/dynamic";

import type { Data, Layout } from "plotly.js";
import type { Figura } from "@/types/dashboard";

const Plot = dynamic(
  () => import("react-plotly.js").then((mod) => mod.default),
  {
    ssr: false,
  },
);

type DashboardChartProps = {
  figura: Figura;
};

export function DashboardChart({ figura }: DashboardChartProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Plot
        data={figura.data as Data[]}
        layout={
          {
            ...figura.layout,
            autosize: true,
            margin: {
              l: 50,
              r: 50,
              t: 50,
              b: 50,
            },
          } as Partial<Layout>
        }
        config={{
          responsive: true,
          displaylogo: false,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        useResizeHandler
      />
    </div>
  );
}
