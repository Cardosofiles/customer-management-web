import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

import { sessionKeys } from './use-sessions'

/**
 * Revoga uma sessão específica pelo token.
 */
export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (token: string) => {
      const { error } = await authClient.revokeSession({ token })
      if (error) throw new Error(error.message ?? 'Erro ao revogar sessão')
    },
    onSuccess: () => {
      toast.success('Sessão revogada com sucesso')
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
