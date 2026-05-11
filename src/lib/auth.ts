import { passkey } from '@better-auth/passkey'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin, twoFactor } from 'better-auth/plugins'
import { Resend } from 'resend'

import { prisma } from '@/lib/prisma'
import { env } from '@/utils/env'

const mailer = new Resend(env.RESEND_API_KEY)

export const auth = betterAuth({
  appName: 'CRUD Next.js Web',
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await mailer.emails.send({
        from: env.RESEND_FROM,
        to: user.email,
        subject: 'Redefinir sua senha',
        html: `<a href="${url}">Clique aqui para redefinir sua senha</a>`,
      })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await mailer.emails.send({
        from: env.RESEND_FROM,
        to: user.email,
        subject: 'Confirme seu email',
        html: `<a href="${url}">Confirmar email</a>`,
      })
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
    twoFactor({ issuer: 'CRUD Next.js Web' }),
    passkey({
      rpName: 'CRUD Next.js Web',
      rpID: new URL(env.BETTER_AUTH_URL).hostname,
      origin: env.BETTER_AUTH_URL,
    }),
    admin(),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user
