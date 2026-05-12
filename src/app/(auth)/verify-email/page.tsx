import type { Metadata } from 'next'
import { Suspense, type JSX } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { AuthShell, VerifyEmail } from '@/modules/auth'

export const metadata: Metadata = {
  title: 'Verificar email',
  description: 'Confirme seu endereço de email',
}

const VerifyEmailPage = (): JSX.Element => {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <div role="status" aria-live="polite" aria-busy="true" className="space-y-6">
            <span className="sr-only">Carregando...</span>
            <div className="flex justify-center">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="space-y-2 text-center">
              <Skeleton className="mx-auto h-6 w-48" />
              <Skeleton className="mx-auto h-4 w-64" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </AuthShell>
      }
    >
      <VerifyEmail />
    </Suspense>
  )
}

export default VerifyEmailPage
