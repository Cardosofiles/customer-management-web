import { betterFetch } from '@better-fetch/fetch'
import { NextResponse, type NextRequest } from 'next/server'

import type { Session } from '@/lib/auth'

const protectedRoutes = ['/dashboard', '/clients', '/settings', '/admin']
const authRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email']

export async function proxy(request: NextRequest) {
  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: { cookie: request.headers.get('cookie') ?? '' },
  })

  const isProtected = protectedRoutes.some((r) => request.nextUrl.pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => request.nextUrl.pathname.startsWith(r))

  if (!session && isProtected) return NextResponse.redirect(new URL('/sign-in', request.url))
  if (session && isAuthRoute) return NextResponse.redirect(new URL('/dashboard', request.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
