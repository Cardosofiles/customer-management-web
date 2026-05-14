'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createCampaign, deleteCampaign, sendBirthdayMessages, sendCampaign, updateCampaign } from '@/actions/marketing'
import type { CampaignFormData } from '../types'
import { marketingKeys } from './use-campaigns'

export function useCreateCampaign(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CampaignFormData) => createCampaign(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message)
        queryClient.invalidateQueries({ queryKey: marketingKeys.all })
        onSuccess?.()
      } else {
        toast.error(result.error)
      }
    },
    onError: () => toast.error('Erro inesperado ao criar campanha.'),
  })
}

export function useUpdateCampaign(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CampaignFormData }) =>
      updateCampaign(id, data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message)
        queryClient.invalidateQueries({ queryKey: marketingKeys.all })
        onSuccess?.()
      } else {
        toast.error(result.error)
      }
    },
    onError: () => toast.error('Erro inesperado ao atualizar campanha.'),
  })
}

export function useSendCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => sendCampaign(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message)
        queryClient.invalidateQueries({ queryKey: marketingKeys.all })
      } else {
        toast.error(result.error)
      }
    },
    onError: () => toast.error('Erro inesperado ao enviar campanha.'),
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message)
        queryClient.invalidateQueries({ queryKey: marketingKeys.all })
      } else {
        toast.error(result.error)
      }
    },
    onError: () => toast.error('Erro inesperado ao excluir campanha.'),
  })
}

export function useSendBirthdayMessages(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ titulo, mensagem }: { titulo: string; mensagem: string }) =>
      sendBirthdayMessages(titulo, mensagem),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message)
        queryClient.invalidateQueries({ queryKey: marketingKeys.all })
        onSuccess?.()
      } else {
        toast.error(result.error)
      }
    },
    onError: () => toast.error('Erro inesperado ao enviar mensagens de aniversário.'),
  })
}
