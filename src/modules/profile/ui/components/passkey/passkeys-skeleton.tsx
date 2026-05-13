import { Skeleton } from '@/components/ui/skeleton'

/**
 * Placeholder de carregamento para a lista de passkeys.
 */
export function PasskeysSkeleton() {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Carregando passkeys">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
