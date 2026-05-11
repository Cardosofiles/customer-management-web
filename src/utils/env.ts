import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  BETTER_AUTH_URL: z
    .url('BETTER_AUTH_URL must be a valid URL')
    .min(1, 'BETTER_AUTH_URL is required'),

  // Resend
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.email(),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),

  // Client-side
  NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

export const env = parsed.data
