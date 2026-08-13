"use client"

import { Badge } from "@/components/ui/badge"

type DashboardContextProps = {
  cultura: string
  municipio?: string
  anoInicial: string
  anoFinal: string
}

export function DashboardContext({
  cultura,
  municipio = "Amontada",
  anoInicial,
  anoFinal,
}: DashboardContextProps) {
  const culturaFormatada =
    cultura.charAt(0).toUpperCase() + cultura.slice(1)

  return (
    <div className="px-4 lg:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {culturaFormatada}
        </Badge>

        <Badge variant="outline">
          {municipio}
        </Badge>

        <Badge variant="outline">
          {anoInicial} — {anoFinal}
        </Badge>
      </div>
    </div>
  )
}