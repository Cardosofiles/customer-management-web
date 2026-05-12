import { VerifyEmail } from '@/modules/auth'
import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Verificar email',
  description: 'Confirme seu endereço de email',
}

const VerifyEmailPage = (): JSX.Element => {
  return <VerifyEmail />
}

export default VerifyEmailPage
