import { VerifyEmail } from '@/modules/auth'
import type { Metadata } from 'next'
import { Suspense, type JSX } from 'react'

export const metadata: Metadata = {
  title: 'Verificar email',
  description: 'Confirme seu endereço de email',
}

const VerifyEmailPage = (): JSX.Element => {
  return (
    <Suspense fallback={<div className="min-h-svh" aria-busy="true" />}>
      <VerifyEmail />
    </Suspense>
  )
}

export default VerifyEmailPage
