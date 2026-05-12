import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  // App
  APP_NAME: z.string().min(2, 'APP_NAME must be at least 2 characters long'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
  BETTER_AUTH_URL: z
    .url('BETTER_AUTH_URL must be a valid URL')
    .refine(
      (url) => process.env.NODE_ENV !== 'production' || url.startsWith('https://'),
      'BETTER_AUTH_URL must use HTTPS in production'
    ),

  // Resend
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  RESEND_FROM: z.email('RESEND_FROM must be a valid email address'),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'DISCORD_CLIENT_ID is required'),
  DISCORD_CLIENT_SECRET: z.string().min(1, 'DISCORD_CLIENT_SECRET is required'),

  // Client-side (expostas ao browser)
  NEXT_PUBLIC_BETTER_AUTH_URL: z.url('NEXT_PUBLIC_BETTER_AUTH_URL must be a valid URL'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const formatted = parsed.error.issues.map(
    (issue) => `  • ${issue.path.join('.')}: ${issue.message}`
  )
  console.error('❌ Invalid environment variables:\n' + formatted.join('\n'))
  process.exit(1)
}

export const env = parsed.data
export type Env = z.infer<typeof envSchema>
