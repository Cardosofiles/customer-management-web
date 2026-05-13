import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { passkey } from '@/lib/auth-client'

export const passkeyKeys = {
  all: ['passkeys'] as const,
}

export function usePasskeys() {
  return useQuery({
    queryKey: passkeyKeys.all,
    queryFn: async () => {
      const { data, error } = await passkey.listUserPasskeys()
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAddPasskey(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await passkey.addPasskey({ name })
      if (error) throw new Error(error.message ?? 'Erro ao adicionar passkey')
    },
    onSuccess: () => {
      toast.success('Passkey adicionada com sucesso')
      queryClient.invalidateQueries({ queryKey: passkeyKeys.all })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeletePasskey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await passkey.deletePasskey({ id })
      if (error) throw new Error(error.message ?? 'Erro ao remover passkey')
    },
    onSuccess: () => {
      toast.success('Passkey removida')
      queryClient.invalidateQueries({ queryKey: passkeyKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
