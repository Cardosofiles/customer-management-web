import { passkeyClient } from '@better-auth/passkey/client'
import { adminClient, inferAdditionalFields, twoFactorClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import type { auth } from '@/lib/auth'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [
    twoFactorClient(),
    passkeyClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
  ],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  twoFactor,
  passkey,
  admin,
  changeEmail,
  changePassword,
  updateUser,
} = authClient
