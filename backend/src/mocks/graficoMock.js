const anos = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];

const mockPorPerfil = {
  PRODUTOR: {
    milho: {
      figura: {
        data: [
          {
            x: anos,
            y: [1800, 2100, 1650, 2300, 1900, 2450, 2100, 2200],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade (kg/ha)",
          },
          {
            x: anos,
            y: [650, 820, 480, 910, 700, 1050, 780, 890],
            type: "bar",
            name: "Chuva (mm)",
            yaxis: "y2",
          },
        ],

        layout: {
          title: "Milho — Amontada",
          xaxis: {
            title: "Ano",
          },
          yaxis: {
            title: "Produtividade (kg/ha)",
          },
          yaxis2: {
            title: "Chuva (mm)",
            overlaying: "y",
            side: "right",
          },
        },
      },

      kpis: {
        produtividade_media: "2.062 kg/ha",
        chuva_total: "6.280 mm",
        tendencia: "crescente",
      },
    },

    feijao: {
      figura: {
        data: [
          {
            x: anos,
            y: [1250, 1380, 1190, 1450, 1320, 1510, 1470, 1540],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade (kg/ha)",
          },
          {
            x: anos,
            y: [620, 790, 450, 860, 680, 980, 750, 840],
            type: "bar",
            name: "Chuva (mm)",
            yaxis: "y2",
          },
        ],

        layout: {
          title: "Feijão — Amontada",
          xaxis: {
            title: "Ano",
          },
          yaxis: {
            title: "Produtividade (kg/ha)",
          },
          yaxis2: {
            title: "Chuva (mm)",
            overlaying: "y",
            side: "right",
          },
        },
      },

      kpis: {
        produtividade_media: "1.389 kg/ha",
        chuva_total: "5.970 mm",
        tendencia: "crescente",
      },
    },

    mandioca: {
      figura: {
        data: [
          {
            x: anos,
            y: [9200, 9500, 9100, 9800, 9600, 10100, 10300, 10500],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade (kg/ha)",
          },
          {
            x: anos,
            y: [640, 810, 470, 900, 690, 1020, 770, 870],
            type: "bar",
            name: "Chuva (mm)",
            yaxis: "y2",
          },
        ],

        layout: {
          title: "Mandioca — Amontada",
          xaxis: {
            title: "Ano",
          },
          yaxis: {
            title: "Produtividade (kg/ha)",
          },
          yaxis2: {
            title: "Chuva (mm)",
            overlaying: "y",
            side: "right",
          },
        },
      },

      kpis: {
        produtividade_media: "9.762 kg/ha",
        chuva_total: "6.170 mm",
        tendencia: "crescente",
      },
    },

    caju: {
      figura: {
        data: [
          {
            x: anos,
            y: [680, 720, 650, 760, 710, 790, 820, 800],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade (kg/ha)",
          },
          {
            x: anos,
            y: [610, 780, 440, 850, 660, 960, 730, 820],
            type: "bar",
            name: "Chuva (mm)",
            yaxis: "y2",
          },
        ],

        layout: {
          title: "Caju — Amontada",
          xaxis: {
            title: "Ano",
          },
          yaxis: {
            title: "Produtividade (kg/ha)",
          },
          yaxis2: {
            title: "Chuva (mm)",
            overlaying: "y",
            side: "right",
          },
        },
      },

      kpis: {
        produtividade_media: "741 kg/ha",
        chuva_total: "5.850 mm",
        tendencia: "estável",
      },
    },

    banana: {
      figura: {
        data: [
          {
            x: anos,
            y: [13200, 13800, 12900, 14500, 14100, 14900, 15200, 15000],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade (kg/ha)",
          },
          {
            x: anos,
            y: [700, 850, 520, 940, 760, 1080, 820, 920],
            type: "bar",
            name: "Chuva (mm)",
            yaxis: "y2",
          },
        ],

        layout: {
          title: "Banana — Amontada",
          xaxis: {
            title: "Ano",
          },
          yaxis: {
            title: "Produtividade (kg/ha)",
          },
          yaxis2: {
            title: "Chuva (mm)",
            overlaying: "y",
            side: "right",
          },
        },
      },

      kpis: {
        produtividade_media: "14.200 kg/ha",
        chuva_total: "6.590 mm",
        tendencia: "crescente",
      },
    },
  },

  TECNICO: {
    // ==========================================================
    // MILHO
    // ==========================================================
    milho: {
      figura: {
        data: [
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [2062, 2100, 1750],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade média",
            yaxis: "y",
          },
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [6280, 7200, 5900],
            type: "bar",
            name: "Chuva total",
            yaxis: "y2",
            opacity: 0.35,
          },
        ],

        layout: {
          title: "Comparativo por município — Milho",

          xaxis: {
            title: "Municípios",
          },

          yaxis: {
            title: "Produtividade média (kg/ha)",
          },

          yaxis2: {
            title: "Chuva total (mm)",
            overlaying: "y",
            side: "right",
          },

          hovermode: "x unified",

          legend: {
            orientation: "h",
            x: 0,
            y: 1.12,
          },
        },
      },

      kpis: {
        produtividade_media: "1.970 kg/ha",
        chuva_total: "19.380 mm",
        tendencia: "estável",

        tabela: [
          {
            municipio: "Amontada",
            codigo: "2300101",
            produtividade_media: "2.062 kg/ha",
            chuva_total: "6.280 mm",
          },
          {
            municipio: "Itapipoca",
            codigo: "2306256",
            produtividade_media: "2.100 kg/ha",
            chuva_total: "7.200 mm",
          },
          {
            municipio: "Trairi",
            codigo: "2313500",
            produtividade_media: "1.750 kg/ha",
            chuva_total: "5.900 mm",
          },
        ],
      },
    },

    // ==========================================================
    // FEIJÃO
    // ==========================================================
    feijao: {
      figura: {
        data: [
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [1250, 1380, 1190],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade média",
            yaxis: "y",
          },
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [5950, 6500, 5750],
            type: "bar",
            name: "Chuva total",
            yaxis: "y2",
            opacity: 0.35,
          },
        ],

        layout: {
          title: "Comparativo por município — Feijão",

          xaxis: {
            title: "Municípios",
          },

          yaxis: {
            title: "Produtividade média (kg/ha)",
          },

          yaxis2: {
            title: "Chuva total (mm)",
            overlaying: "y",
            side: "right",
          },

          hovermode: "x unified",

          legend: {
            orientation: "h",
            x: 0,
            y: 1.12,
          },
        },
      },

      kpis: {
        produtividade_media: "1.273 kg/ha",
        chuva_total: "18.200 mm",
        tendencia: "estável",

        tabela: [
          {
            municipio: "Amontada",
            codigo: "2300101",
            produtividade_media: "1.250 kg/ha",
            chuva_total: "5.950 mm",
          },
          {
            municipio: "Itapipoca",
            codigo: "2306256",
            produtividade_media: "1.380 kg/ha",
            chuva_total: "6.500 mm",
          },
          {
            municipio: "Trairi",
            codigo: "2313500",
            produtividade_media: "1.190 kg/ha",
            chuva_total: "5.750 mm",
          },
        ],
      },
    },

    // ==========================================================
    // MANDIOCA
    // ==========================================================
    mandioca: {
      figura: {
        data: [
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [9200, 9500, 9100],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade média",
            yaxis: "y",
          },
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [6100, 6950, 5900],
            type: "bar",
            name: "Chuva total",
            yaxis: "y2",
            opacity: 0.35,
          },
        ],

        layout: {
          title: "Comparativo por município — Mandioca",

          xaxis: {
            title: "Municípios",
          },

          yaxis: {
            title: "Produtividade média (kg/ha)",
          },

          yaxis2: {
            title: "Chuva total (mm)",
            overlaying: "y",
            side: "right",
          },

          hovermode: "x unified",

          legend: {
            orientation: "h",
            x: 0,
            y: 1.12,
          },
        },
      },

      kpis: {
        produtividade_media: "9.267 kg/ha",
        chuva_total: "18.950 mm",
        tendencia: "crescente",

        tabela: [
          {
            municipio: "Amontada",
            codigo: "2300101",
            produtividade_media: "9.200 kg/ha",
            chuva_total: "6.100 mm",
          },
          {
            municipio: "Itapipoca",
            codigo: "2306256",
            produtividade_media: "9.500 kg/ha",
            chuva_total: "6.950 mm",
          },
          {
            municipio: "Trairi",
            codigo: "2313500",
            produtividade_media: "9.100 kg/ha",
            chuva_total: "5.900 mm",
          },
        ],
      },
    },

    // ==========================================================
    // CAJU
    // ==========================================================
    caju: {
      figura: {
        data: [
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [680, 720, 650],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade média",
            yaxis: "y",
          },
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [5800, 6300, 5800],
            type: "bar",
            name: "Chuva total",
            yaxis: "y2",
            opacity: 0.35,
          },
        ],

        layout: {
          title: "Comparativo por município — Caju",

          xaxis: {
            title: "Municípios",
          },

          yaxis: {
            title: "Produtividade média (kg/ha)",
          },

          yaxis2: {
            title: "Chuva total (mm)",
            overlaying: "y",
            side: "right",
          },

          hovermode: "x unified",

          legend: {
            orientation: "h",
            x: 0,
            y: 1.12,
          },
        },
      },

      kpis: {
        produtividade_media: "683 kg/ha",
        chuva_total: "17.900 mm",
        tendencia: "estável",

        tabela: [
          {
            municipio: "Amontada",
            codigo: "2300101",
            produtividade_media: "680 kg/ha",
            chuva_total: "5.800 mm",
          },
          {
            municipio: "Itapipoca",
            codigo: "2306256",
            produtividade_media: "720 kg/ha",
            chuva_total: "6.300 mm",
          },
          {
            municipio: "Trairi",
            codigo: "2313500",
            produtividade_media: "650 kg/ha",
            chuva_total: "5.800 mm",
          },
        ],
      },
    },

    // ==========================================================
    // BANANA
    // ==========================================================
    banana: {
      figura: {
        data: [
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [13200, 13800, 12900],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade média",
            yaxis: "y",
          },
          {
            x: ["Amontada", "Itapipoca", "Trairi"],
            y: [6500, 7100, 6500],
            type: "bar",
            name: "Chuva total",
            yaxis: "y2",
            opacity: 0.35,
          },
        ],

        layout: {
          title: "Comparativo por município — Banana",

          xaxis: {
            title: "Municípios",
          },

          yaxis: {
            title: "Produtividade média (kg/ha)",
          },

          yaxis2: {
            title: "Chuva total (mm)",
            overlaying: "y",
            side: "right",
          },

          hovermode: "x unified",

          legend: {
            orientation: "h",
            x: 0,
            y: 1.12,
          },
        },
      },

      kpis: {
        produtividade_media: "13.300 kg/ha",
        chuva_total: "20.100 mm",
        tendencia: "crescente",

        tabela: [
          {
            municipio: "Amontada",
            codigo: "2300101",
            produtividade_media: "13.200 kg/ha",
            chuva_total: "6.500 mm",
          },
          {
            municipio: "Itapipoca",
            codigo: "2306256",
            produtividade_media: "13.800 kg/ha",
            chuva_total: "7.100 mm",
          },
          {
            municipio: "Trairi",
            codigo: "2313500",
            produtividade_media: "12.900 kg/ha",
            chuva_total: "6.500 mm",
          },
        ],
      },
    },
  },

  GESTOR: {
    milho: {
      figura: {
        data: [
          {
            x: anos,
            y: [1750, 1900, 1680, 2050, 1820, 2200, 1980, 2100],
            type: "scatter",
            mode: "lines+markers",
            name: "Produtividade média estadual",
          },
        ],

        layout: {
          title: "Evolução estadual — Milho",
          xaxis: {
            title: "Ano",
          },
          yaxis: {
            title: "Produtividade média (kg/ha)",
          },
        },
      },

      kpis: {
        produtividade_media: "1.935 kg/ha",
        chuva_total: "6.580 mm",
        total_municipios: 184,

        municipios_risco: ["Parambu", "Aiuaba", "Arneiroz"],

        tabela: [
          {
            municipio: "Amontada",
            codigo: "2300101",
            produtividade_media: "2.062 kg/ha",
            ranking: 1,
          },
          {
            municipio: "Itapipoca",
            codigo: "2306256",
            produtividade_media: "2.100 kg/ha",
            ranking: 2,
          },
          {
            municipio: "Parambu",
            codigo: "2310308",
            produtividade_media: "980 kg/ha",
            ranking: 182,
          },
        ],
      },
    },
  },
};

module.exports = mockPorPerfil;
