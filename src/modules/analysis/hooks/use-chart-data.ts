'use client'

import { useQuery } from '@tanstack/react-query'

import { getClientesChartData } from '@/actions/client'

export function useChartData() {
  return useQuery({
    queryKey: ['chart-data'],
    queryFn: async () => {
      const result = await getClientesChartData(90)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
