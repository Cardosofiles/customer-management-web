'use client'

import { useQuery } from '@tanstack/react-query'

import { getBirthdayClientsToday } from '@/actions/marketing'
import { marketingKeys } from './use-campaigns'

export { type BirthdayClient } from '@/actions/marketing'

export function useBirthdayClients() {
  return useQuery({
    queryKey: [...marketingKeys.all, 'birthday'] as const,
    queryFn: async () => {
      const result = await getBirthdayClientsToday()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
