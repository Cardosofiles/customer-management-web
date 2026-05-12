'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

const BLOCKED_PATTERNS = [
  /DROP\s+TABLE/i,
  /DROP\s+DATABASE/i,
  /TRUNCATE\s+TABLE/i,
  /DELETE\s+FROM\s+"?user"?/i,
  /DELETE\s+FROM\s+"?session"?/i,
]

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function executeSQL(sql: string) {
  const session = await requireAdmin()

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(sql)) {
      throw new Error(`Operação bloqueada por segurança: ${pattern.source}`)
    }
  }

  const start = Date.now()
  let rows: Record<string, unknown>[] = []
  let error: string | null = null
  let rowCount: number | null = null

  try {
    const result = await prisma.$queryRawUnsafe(sql)
    rows = result as Record<string, unknown>[]
    rowCount = rows.length
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  const duration = Date.now() - start

  await prisma.queryLog.create({
    data: {
      userId: session.user.id,
      sql,
      duration,
      rowCount,
      error,
    },
  })

  if (error) throw new Error(error)

  return { rows, duration, rowCount }
}

export async function getSchemaBrowser() {
  await requireAdmin()

  const columns = await prisma.$queryRaw<
    Array<{ table_name: string; column_name: string; data_type: string }>
  >`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `

  const schema: Record<string, Array<{ column: string; type: string }>> = {}
  for (const row of columns) {
    if (!schema[row.table_name]) schema[row.table_name] = []
    schema[row.table_name].push({ column: row.column_name, type: row.data_type })
  }

  return schema
}
