import { passkey } from '@better-auth/passkey'
import { betterAuth, type User } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin, twoFactor } from 'better-auth/plugins'

import {
  sendEmailVerificationService,
  sendResetPasswordMailService,
  sendTwoFactorOTP,
} from '@/lib/email'
import { prisma } from '@/lib/prisma'
import { env } from '@/utils/env'

export const auth = betterAuth({
  appName: env.APP_NAME,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }: { user: User; url: string }) => {
      await sendResetPasswordMailService({ user, url })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
      await sendEmailVerificationService({ user, url })
    },
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },

  plugins: [
    twoFactor({
      issuer: env.APP_NAME,
      sendTOTPEmail: ({ user, otp }: { user: User; otp: string }) =>
        sendTwoFactorOTP({ user, otp }),
    }),
    passkey({
      rpName: env.APP_NAME,
      rpID: new URL(env.BETTER_AUTH_URL).hostname,
      origin: env.BETTER_AUTH_URL,
    }),
    admin(),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user
