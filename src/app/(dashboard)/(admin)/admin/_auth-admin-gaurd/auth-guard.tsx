import { betterFetch } from '@better-fetch/fetch'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { Session } from '@/lib/auth'
import { env } from '@/utils/env'

type AuthGuardProps = {
  children: React.ReactNode
}

const AuthAdminGuard = async ({ children }: AuthGuardProps) => {
  const cookieHeader = (await cookies()).toString()
  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: env.BETTER_AUTH_URL,
    headers: { cookie: cookieHeader },
  })

  if (!session) {
    redirect('/sign-in')
  }

  if (session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  return <>{children}</>
}

export default AuthAdminGuard
