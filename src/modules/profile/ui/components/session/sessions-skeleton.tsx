import { Skeleton } from '@/components/ui/skeleton'

/**
 * Placeholder de carregamento para a lista de sessões.
 */
export function SessionsSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Carregando sessões">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
