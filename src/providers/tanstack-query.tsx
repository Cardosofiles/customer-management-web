'use client'

import { QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

const oneMinute = 60 * 1000
const fiveMinutes = 5 * 60 * 1000

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: oneMinute,
      gcTime: fiveMinutes,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
}

interface TanstackQueryProviderProps {
  children: ReactNode
}
export const TanstackQueryProvider = ({ children }: TanstackQueryProviderProps) => {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
