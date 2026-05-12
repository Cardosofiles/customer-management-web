import type { Metadata } from 'next'
import { Suspense, type JSX } from 'react'

import { ResetPassword } from '@/modules/auth'

export const metadata: Metadata = {
  title: 'Redefinir senha',
  description: 'Crie uma nova senha para sua conta',
}

const ResetPasswordPage = (): JSX.Element => {
  return (
    <Suspense fallback={<div className="min-h-svh" aria-busy="true" />}>
      <ResetPassword />
    </Suspense>
  )
}

export default ResetPasswordPage
