export type AdminUser = {
  id: string
  name: string | null
  email: string
  role: string | null
  banned: boolean | null
  banReason: string | null
  emailVerified: boolean
  createdAt: string
}

export interface UsersTableProps {
  users: AdminUser[]
  total: number
  page: number
  pageSize: number
}

export interface BanModalProps {
  userId: string | null
  onClose: () => void
}

export interface ActionsCellProps {
  user: AdminUser
  onBanOpen: (userId: string) => void
}

export interface SqlQueryResult {
  rows: Record<string, unknown>[]
  duration: number
  rowCount: number | null
}

export interface SchemaColumn {
  column: string
  type: string
}

export interface QueryHistoryItem {
  sql: string
  at: string
}
