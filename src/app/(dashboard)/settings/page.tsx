import type { Metadata } from 'next'
import type { JSX } from 'react'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { Profile } from '@/modules/profile'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Configurações',
  description: 'Gerencie suas configurações',
}

const SettingsPage = async (): Promise<JSX.Element> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')
  return <Profile user={session.user} currentSessionToken={session.session.token} />
}

export default SettingsPage
