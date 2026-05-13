import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { authClient, signIn } from '@/lib/auth-client'

export type ProviderId = 'google' | 'github' | 'discord'

export const socialAccountsKeys = {
  all: ['linked-accounts'] as const,
}

export function useSocialAccounts() {
  return useQuery({
    queryKey: socialAccountsKeys.all,
    queryFn: async () => {
      const { data, error } = await authClient.listAccounts()
      if (error) throw error
      return data ?? []
    },
  })
}

export function useConnectProvider() {
  return useMutation({
    mutationFn: (provider: ProviderId) => signIn.social({ provider, callbackURL: '/settings' }),
    onError: () => toast.error('Erro ao conectar conta'),
  })
}

export function useDisconnectProvider(hasPassword: boolean, socialCount: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (provider: ProviderId) => {
      if (!hasPassword && socialCount <= 1) {
        throw new Error('Não é possível desconectar o único método de login')
      }
      const { error } = await authClient.unlinkAccount({ providerId: provider })
      if (error) throw new Error(error.message ?? 'Erro ao desconectar conta')
    },
    onSuccess: () => {
      toast.success('Conta desconectada')
      queryClient.invalidateQueries({ queryKey: socialAccountsKeys.all })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
