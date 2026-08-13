import type { GraficoResponseProdutor } from "@/types/dashboard";

export const dashboardProdutorMock: GraficoResponseProdutor = {
  figura: {
    data: [
      {
        x: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
        y: [1650, 1780, 1520, 1920, 1810, 2050, 2180, 1960],
        type: "scatter",
        mode: "lines+markers",
        name: "Produtividade (kg/ha)",
        line: {
          width: 3,
        },
        marker: {
          size: 7,
        },
      },
      {
        x: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
        y: [620, 710, 540, 830, 760, 910, 980, 820],
        type: "scatter",
        mode: "lines+markers",
        name: "Chuva (mm)",
        yaxis: "y2",
        line: {
          width: 2,
          dash: "dot",
        },
        marker: {
          size: 6,
        },
      },
    ],

    layout: {
      title: {
        text: "Chuva e produtividade",
      },

      hovermode: "x unified",

      xaxis: {
        title: {
          text: "Ano",
        },
      },

      yaxis: {
        title: {
          text: "Produtividade (kg/ha)",
        },
        showgrid: true,
      },

      yaxis2: {
        title: {
          text: "Chuva (mm)",
        },
        overlaying: "y",
        side: "right",
        showgrid: false,
      },

      legend: {
        orientation: "h",
        x: 0.5,
        xanchor: "center",
        y: -0.2,
      },

      hoverlabel: {
        namelength: -1,
      },
    },
  },

  kpis: {
    produtividade_media: "1.842 kg/ha",
    chuva_total: "6.430 mm",
    tendencia: "crescente",
  },
};
