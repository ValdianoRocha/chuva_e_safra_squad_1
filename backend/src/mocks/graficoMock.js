const mockPorPerfil = {
  PRODUTOR: {
    figura: {
      data: [
        {
          x: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
          y: [1800, 2100, 1650, 2300, 1900, 2450, 2100, 2200],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Produtividade (kg/ha)',
        },
        {
          x: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
          y: [650, 820, 480, 910, 700, 1050, 780, 890],
          type: 'bar',
          name: 'Chuva (mm)',
          yaxis: 'y2',
        },
      ],
      layout: {
        title: 'Milho — Amontada (2015–2022)',
        xaxis: { title: 'Ano' },
        yaxis: { title: 'Produtividade (kg/ha)' },
        yaxis2: { title: 'Chuva (mm)', overlaying: 'y', side: 'right' },
      },
    },
    kpis: {
      produtividade_media: '2.062 kg/ha',
      chuva_total: '6.280 mm',
      tendencia: 'crescente',
    },
  },
  TECNICO: {
    figura: {
      data: [{
        x: [650, 820, 480, 910, 700],
        y: [1800, 2100, 1650, 2300, 1900],
        mode: 'markers',
        type: 'scatter',
        text: ['Amontada', 'Itapipoca', 'Trairi', 'Miraíma', 'Acaraú'],
        marker: { size: 12 },
      }],
      layout: {
        title: 'Chuva × Produtividade — Região',
        xaxis: { title: 'Chuva acumulada (mm)' },
        yaxis: { title: 'Produtividade média (kg/ha)' },
      },
    },
    kpis: {
      produtividade_media: '1.970 kg/ha',
      chuva_total: '6.830 mm',
      tendencia: 'estável',
      tabela: [
        { municipio: 'Amontada',  codigo: '2300101', produtividade_media: '2.062 kg/ha', chuva_total: '6.280 mm' },
        { municipio: 'Itapipoca', codigo: '2306405', produtividade_media: '2.100 kg/ha', chuva_total: '7.200 mm' },
        { municipio: 'Trairi',    codigo: '2313500', produtividade_media: '1.750 kg/ha', chuva_total: '5.900 mm' },
      ],
    },
  },
  GESTOR: {
    figura: {
      data: [{
        x: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
        y: [1750, 1900, 1680, 2050, 1820, 2200, 1980, 2100],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Produtividade média estadual',
      }],
      layout: {
        title: 'Evolução estadual — Milho (2015–2022)',
        xaxis: { title: 'Ano' },
        yaxis: { title: 'Produtividade média (kg/ha)' },
      },
    },
    kpis: {
      produtividade_media: '1.935 kg/ha',
      chuva_total: '6.580 mm',
      total_municipios: 184,
      municipios_risco: ['Parambu', 'Aiuaba', 'Arneiroz'],
      tabela: [
        { municipio: 'Amontada',  codigo: '2300101', produtividade_media: '2.062 kg/ha', ranking: 1 },
        { municipio: 'Itapipoca', codigo: '2306405', produtividade_media: '2.100 kg/ha', ranking: 2 },
        { municipio: 'Parambu',   codigo: '2310209', produtividade_media: '980 kg/ha',   ranking: 182 },
      ],
    },
  },
};

module.exports = mockPorPerfil;

