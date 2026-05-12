import type { Metadata } from 'next'
import type { JSX } from 'react'

import { SignIn } from '@/modules/auth'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Faça login para acessar sua conta',
}

const SignInPage = (): JSX.Element => {
  return <SignIn />
}

export default SignInPage
