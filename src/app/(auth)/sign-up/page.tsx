import type { Metadata } from 'next'
import type { JSX } from 'react'

import { SignUp } from '@/modules/auth'

export const metadata: Metadata = {
  title: 'Crie sua conta',
  description: 'Crie sua conta para começar a agendar suas reuniões de trabalho',
}

const SignUpPage = (): JSX.Element => {
  return <SignUp />
}

export default SignUpPage
