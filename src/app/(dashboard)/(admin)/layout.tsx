import AuthAdminGuard from '@/app/(dashboard)/(admin)/admin/_auth-admin-gaurd/auth-guard'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthAdminGuard>{children}</AuthAdminGuard>
}
