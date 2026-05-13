import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

/**
 * Mutation para troca de senha com revogação de outras sessões ativas.
 */
export function useChangePassword(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: ChangePasswordPayload) => {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (error) throw new Error(error.message ?? 'Erro ao alterar senha')
    },
    onSuccess: () => {
      toast.success('Senha alterada com sucesso')
      onSuccess?.()
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
