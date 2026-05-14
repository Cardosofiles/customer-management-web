'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getCampaigns, getCampaignStats } from '@/actions/marketing'

export const marketingKeys = {
  all: ['marketing'] as const,
  campaigns: () => [...marketingKeys.all, 'campaigns'] as const,
  stats: () => [...marketingKeys.all, 'stats'] as const,
  recipients: (publico: string) => [...marketingKeys.all, 'recipients', publico] as const,
}

export function useCampaigns() {
  return useQuery({
    queryKey: marketingKeys.campaigns(),
    queryFn: async () => {
      const result = await getCampaigns()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })
}

export function useCampaignStats() {
  return useQuery({
    queryKey: marketingKeys.stats(),
    queryFn: async () => {
      const result = await getCampaignStats()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })
}

export function useInvalidateMarketing() {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({ queryKey: marketingKeys.all })
}
