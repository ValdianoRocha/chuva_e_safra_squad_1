import { Skeleton } from "@/components/ui/skeleton"

export function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-36 w-full rounded-xl" />
      </div>

      <Skeleton className="h-105 w-full rounded-xl" />
    </div>
  )
}