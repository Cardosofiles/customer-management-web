import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

import { sessionKeys } from './use-sessions'

/**
 * Revoga todas as sessões exceto a atual.
 */
export function useRevokeOtherSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.revokeOtherSessions()
      if (error) throw new Error(error.message ?? 'Erro ao revogar outras sessões')
    },
    onSuccess: () => {
      toast.success('Outras sessões revogadas com sucesso')
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
