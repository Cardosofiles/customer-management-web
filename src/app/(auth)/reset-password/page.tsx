import { ResetPassword } from '@/modules/auth'
import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Redefinir senha',
  description: 'Crie uma nova senha para sua conta',
}

const ResetPasswordPage = (): JSX.Element => {
  return <ResetPassword />
}

export default ResetPasswordPage
