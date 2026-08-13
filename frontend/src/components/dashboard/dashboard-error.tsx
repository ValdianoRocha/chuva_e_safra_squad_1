import { AlertCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type DashboardErrorProps = {
  onRetry?: () => void
}

export function DashboardError({
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className="mx-4 flex min-h-87.5 flex-col items-center justify-center rounded-xl border border-dashed text-center lg:mx-6">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <AlertCircleIcon className="size-6 text-muted-foreground" />
      </div>

      <h2 className="mt-4 text-lg font-semibold">
        Não foi possível carregar os dados
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        O serviço de dados pode estar temporariamente indisponível.
        Tente novamente em alguns instantes.
      </p>

      {onRetry && (
        <Button
          className="mt-4"
          variant="outline"
          onClick={onRetry}
        >
          Tentar novamente
        </Button>
      )}
    </div>
  )
}