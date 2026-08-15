import type { TabelaTecnicoItem } from "@/types/dashboard"

type TabelaMunicipiosProps = {
  dados: TabelaTecnicoItem[]
}

export function TabelaMunicipios({
  dados,
}: TabelaMunicipiosProps) {
  return (
    <div className="px-4 lg:px-6">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">
            Comparativo por município
          </h2>

          <p className="text-sm text-muted-foreground">
            Produtividade média e chuva acumulada dos municípios selecionados
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-6 py-3 text-left font-medium">
                  Município
                </th>

                <th className="px-6 py-3 text-left font-medium">
                  Código IBGE
                </th>

                <th className="px-6 py-3 text-right font-medium">
                  Produtividade média
                </th>

                <th className="px-6 py-3 text-right font-medium">
                  Chuva total
                </th>
              </tr>
            </thead>

            <tbody>
              {dados.map((item) => (
                <tr
                  key={item.codigo}
                  className="border-b last:border-0"
                >
                  <td className="px-6 py-4 font-medium">
                    {item.municipio}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {item.codigo}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {item.produtividade_media ?? "Sem dados"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {item.chuva_total ?? "Sem dados"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}