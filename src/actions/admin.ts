'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function promoteToAdmin(userId: string) {
  await requireAdmin()
  await auth.api.setRole({
    headers: await headers(),
    body: { userId, role: 'admin' },
  })
}

export async function revokeAdmin(userId: string) {
  await requireAdmin()
  await auth.api.setRole({
    headers: await headers(),
    body: { userId, role: 'user' },
  })
}

export async function banUser(userId: string, banReason: string) {
  await requireAdmin()
  await auth.api.banUser({ body: { userId, banReason } })
}

export async function unbanUser(userId: string) {
  await requireAdmin()
  await auth.api.unbanUser({ body: { userId } })
}
