import type { Metadata } from 'next'
import { Suspense, type JSX } from 'react'

import { ResetPassword } from '@/modules/auth'

export const metadata: Metadata = {
  title: 'Redefinir senha',
  description: 'Crie uma nova senha para sua conta',
}

const ResetPasswordPage = (): JSX.Element => {
  return (
    <Suspense
      fallback={
        <div className="min-h-svh" role="status" aria-live="polite" aria-busy="true">
          <span className="sr-only">Carregando...</span>
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  )
}

export default ResetPasswordPage
