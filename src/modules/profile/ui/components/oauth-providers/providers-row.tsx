import { Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { PROVIDERS } from '@/modules/profile/ui/components/oauth-providers/constants'

interface ProviderRowProps {
  provider: (typeof PROVIDERS)[number]
  account?: { accountId: string }
  isLinked: boolean
  isPending: boolean
  onConnect: () => void
  onDisconnect: () => void
}

/**
 * Linha de provider social com ações de conectar/desconectar.
 */
export function ProviderRow({
  provider,
  account,
  isLinked,
  isPending,
  onConnect,
  onDisconnect,
}: ProviderRowProps) {
  const Icon = provider.icon

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className="size-4" aria-hidden />
        <div>
          <p className="text-sm font-medium">{provider.label}</p>
          {isLinked && account && (
            <p className="text-xs text-muted-foreground">{account.accountId}</p>
          )}
        </div>
        {isLinked && <Badge variant="secondary">Conectado</Badge>}
      </div>

      <Button
        variant={isLinked ? 'outline' : 'default'}
        size="sm"
        disabled={isPending}
        aria-label={`${isLinked ? 'Desconectar' : 'Conectar'} ${provider.label}`}
        onClick={isLinked ? onDisconnect : onConnect}
      >
        {isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
        {isLinked ? 'Desconectar' : 'Conectar'}
      </Button>
    </div>
  )
}
