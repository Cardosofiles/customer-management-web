import type { Metadata } from 'next'
import type { JSX } from 'react'

import { prisma } from '@/lib/prisma'
import { UsersTable } from '@/modules/admin'

export const metadata: Metadata = {
  title: 'Gerenciamento de Usuários',
  description: 'Acesse o gerenciamento de usuários para criar, editar e excluir contas',
}

const UserManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}): Promise<JSX.Element> => {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const pageSize = 20

  const [users, total] = await Promise.all([
    prisma.user
      .findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          banReason: true,
          emailVerified: true,
          createdAt: true,
        },
      })
      .then((users) => users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() }))),
    prisma.user.count(),
  ])

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-muted-foreground text-sm">Gerencie os usuários da plataforma.</p>
      </div>
      <UsersTable users={users} total={total} page={page} pageSize={pageSize} />
    </div>
  )
}

export default UserManagementPage
