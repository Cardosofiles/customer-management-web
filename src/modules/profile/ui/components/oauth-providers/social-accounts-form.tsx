'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useConnectProvider,
  useDisconnectProvider,
  useSocialAccounts,
  type ProviderId,
} from '@/modules/profile/hooks/use-social-accounts'
import { ProviderRow } from '@/modules/profile/ui/components/oauth-providers/providers-row'

import { PROVIDERS } from '@/modules/profile/ui/components/oauth-providers/constants'

/**
 * Container da feature de contas sociais.
 * Orquestra hooks e delega renderização ao ProviderRow.
 */
export function SocialAccountsForm() {
  const { data: accounts, isLoading } = useSocialAccounts()

  const linkedProviders = new Set(accounts?.map((a) => a.providerId) ?? [])
  const hasPassword = linkedProviders.has('credential')
  const socialCount = PROVIDERS.filter((p) => linkedProviders.has(p.id)).length

  const { mutate: connect, isPending: isConnecting, variables: connectingId } = useConnectProvider()

  const {
    mutate: disconnect,
    isPending: isDisconnecting,
    variables: disconnectingId,
  } = useDisconnectProvider(hasPassword, socialCount)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas sociais</CardTitle>
        <CardDescription>Conecte ou desconecte provedores de login social</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {PROVIDERS.map((p) => (
              <Skeleton key={p.id} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {PROVIDERS.map((provider, idx) => {
              const isLinked = linkedProviders.has(provider.id)
              const account = accounts?.find((a) => a.providerId === provider.id)
              const isPending =
                (isConnecting && connectingId === provider.id) ||
                (isDisconnecting && disconnectingId === provider.id)

              return (
                <div key={provider.id}>
                  <ProviderRow
                    provider={provider}
                    account={account}
                    isLinked={isLinked}
                    isPending={isPending}
                    onConnect={() => connect(provider.id as ProviderId)}
                    onDisconnect={() => disconnect(provider.id as ProviderId)}
                  />
                  {idx < PROVIDERS.length - 1 && <Separator />}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
