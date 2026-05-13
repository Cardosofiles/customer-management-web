import { useQuery, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@/lib/auth-client'

export const sessionKeys = {
  all: ['sessions'] as const,
}

export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: async () => {
      const { data, error } = await authClient.listSessions()
      if (error) throw error
      return data ?? []
    },
  })
}

export function useSessionsQueryClient() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: sessionKeys.all })
}
