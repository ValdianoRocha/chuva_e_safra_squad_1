import type { TabelaGestorItem } from "@/types/dashboard"

import { Badge } from "@/components/ui/badge"
import { TrophyIcon } from "lucide-react"

type TabelaRankingProps = {
  dados: TabelaGestorItem[]
  municipiosRisco: string[]
}

export function TabelaRanking({
  dados,
  municipiosRisco,
}: TabelaRankingProps) {
  return (
    <div className="px-4 lg:px-6">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">
            Ranking de produtividade
          </h2>

          <p className="text-sm text-muted-foreground">
            Comparativo de produtividade entre os municípios analisados
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-6 py-3 text-left font-medium">
                  Ranking
                </th>

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
                  Situação
                </th>
              </tr>
            </thead>

            <tbody>
              {dados.map((item) => {
                const emRisco = municipiosRisco.includes(
                  item.municipio
                )

                return (
                  <tr
                    key={item.codigo}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium">
                        {item.ranking === 1 && (
                          <TrophyIcon className="size-4" />
                        )}

                        {item.ranking}º
                      </div>
                    </td>

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
                      {emRisco ? (
                        <Badge variant="destructive">
                          Em risco
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Normal
                        </Badge>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}