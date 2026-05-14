'use client'

import { useQuery } from '@tanstack/react-query'

import { getClientesMetricsMes, getClientesTotal, getClientesTotalPorTipo } from '@/actions/client'

type UseClientesTotalResult = {
  total: number
  isLoading: boolean
  error: string | null
}

export function useClientesTotal(): UseClientesTotalResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['clientes', 'total'],
    queryFn: async () => {
      const result = await getClientesTotal()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    staleTime: 30_000,
    retry: 1,
  })

  return {
    total: data ?? 0,
    isLoading,
    error: error instanceof Error ? error.message : error ? 'Erro ao carregar total.' : null,
  }
}

type UseClientesTotalPorTipoResult = {
  pessoasFisicas: number
  pessoasJuridicas: number
  isLoading: boolean
  error: string | null
}

export function useClientesTotalPorTipo(): UseClientesTotalPorTipoResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['clientes', 'total-por-tipo'],
    queryFn: async () => {
      const result = await getClientesTotalPorTipo()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    staleTime: 30_000,
    retry: 1,
  })

  return {
    pessoasFisicas: data?.pessoasFisicas ?? 0,
    pessoasJuridicas: data?.pessoasJuridicas ?? 0,
    isLoading,
    error: error instanceof Error ? error.message : error ? 'Erro ao carregar total.' : null,
  }
}

type UseClientesMetricsMesResult = {
  totalMes: number
  pfMes: number
  pjMes: number
  totalDeltaPercent: number
  pfDeltaPercent: number
  pjDeltaPercent: number
  isLoading: boolean
  error: string | null
}

function calculateDeltaPercent(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function useClientesMetricsMes(): UseClientesMetricsMesResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['clientes', 'metrics-mes'],
    queryFn: async () => {
      const result = await getClientesMetricsMes()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    staleTime: 30_000,
    retry: 1,
  })

  const totalMes = data?.totalMes ?? 0
  const pfMes = data?.pfMes ?? 0
  const pjMes = data?.pjMes ?? 0
  const totalDeltaPercent = calculateDeltaPercent(totalMes, data?.totalMesAnterior ?? 0)
  const pfDeltaPercent = calculateDeltaPercent(pfMes, data?.pfMesAnterior ?? 0)
  const pjDeltaPercent = calculateDeltaPercent(pjMes, data?.pjMesAnterior ?? 0)

  return {
    totalMes,
    pfMes,
    pjMes,
    totalDeltaPercent,
    pfDeltaPercent,
    pjDeltaPercent,
    isLoading,
    error: error instanceof Error ? error.message : error ? 'Erro ao carregar metricas.' : null,
  }
}
