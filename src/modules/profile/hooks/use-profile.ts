'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { changeEmail, updateUser } from '@/lib/auth-client'

export function useUpdateName() {
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await updateUser({ name })
      if (error) throw new Error('Erro ao atualizar nome')
    },
    onSuccess: () => toast.success('Nome atualizado com sucesso'),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useChangeEmail(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (newEmail: string) => {
      const { error } = await changeEmail({ newEmail, callbackURL: '/settings' })
      if (error) throw new Error('Erro ao solicitar troca de email')
    },
    onSuccess: () => {
      toast.success('Email de confirmação enviado para o novo endereço')
      onSuccess?.()
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
