'use client'

import { usePathname } from 'next/navigation'

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/clients': 'Clientes',
  '/dashboard/clients/new': 'Novo Cliente',
  '/settings': 'Configuracoes',
}

function formatTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  if (!last) return 'Dashboard'
  if (last.startsWith('[') && last.endsWith(']')) {
    return segments[segments.length - 2] ?? 'Dashboard'
  }
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ')
}

export function usePageTitle(): string {
  const pathname = usePathname()
  return ROUTE_TITLES[pathname] ?? formatTitle(pathname)
}
