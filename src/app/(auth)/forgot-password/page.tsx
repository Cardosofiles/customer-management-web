import { ForgotPassword } from '@/modules/auth'
import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Esqueci minha senha',
  description: 'Recupere o acesso à sua conta',
}

const ForgotPasswordPage = (): JSX.Element => {
  return <ForgotPassword />
}

export default ForgotPasswordPage
