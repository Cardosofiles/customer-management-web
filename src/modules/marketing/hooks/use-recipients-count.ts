'use client'

import { useQuery } from '@tanstack/react-query'

import { getRecipientsCount } from '@/actions/marketing'
import type { PublicoCampanha } from '../types'
import { marketingKeys } from './use-campaigns'

export function useRecipientsCount(publico: PublicoCampanha, enabled = true) {
  return useQuery({
    queryKey: marketingKeys.recipients(publico),
    queryFn: () => getRecipientsCount(publico),
    enabled,
    staleTime: 30 * 1000,
  })
}
