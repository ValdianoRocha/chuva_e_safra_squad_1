import { Badge } from "@/components/ui/badge"
import { TriangleAlertIcon } from "lucide-react"

type MunicipiosRiscoProps = {
  municipios: string[]
}

export function MunicipiosRisco({
  municipios,
}: MunicipiosRiscoProps) {
  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <TriangleAlertIcon className="size-5 text-muted-foreground" />

          <div>
            <h2 className="font-semibold">
              Municípios em risco
            </h2>

            <p className="text-sm text-muted-foreground">
              Municípios que exigem atenção no período analisado
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {municipios.length > 0 ? (
            municipios.map((municipio) => (
              <Badge
                key={municipio}
                variant="destructive"
              >
                {municipio}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              Nenhum município em risco
            </span>
          )}
        </div>
      </div>
    </div>
  )
}