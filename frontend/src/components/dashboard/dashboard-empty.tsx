import { CloudOffIcon } from "lucide-react"

export function DashboardEmpty() {
  return (
    <div className="mx-4 flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed text-center lg:mx-6">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <CloudOffIcon className="size-6 text-muted-foreground" />
      </div>

      <h2 className="mt-4 text-lg font-semibold">
        Nenhum dado encontrado
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Não existem informações disponíveis para a cultura e o período
        selecionados.
      </p>
    </div>
  )
}