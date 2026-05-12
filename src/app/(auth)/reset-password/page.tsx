import type { Metadata } from 'next'
import { Suspense, type JSX } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { AuthShell, ResetPassword } from '@/modules/auth'

export const metadata: Metadata = {
  title: 'Redefinir senha',
  description: 'Crie uma nova senha para sua conta',
}

const ResetPasswordPage = (): JSX.Element => {
  return (
    <Suspense
      fallback={
        <AuthShell>
          <div role="status" aria-live="polite" aria-busy="true" className="space-y-4">
            <span className="sr-only">Carregando...</span>
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </AuthShell>
      }
    >
      <ResetPassword />
    </Suspense>
  )
}

export default ResetPasswordPage
