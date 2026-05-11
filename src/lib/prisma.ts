import 'dotenv/config'

import { PrismaClient } from '@/generated/prisma/client'
import { env } from '@/utils/env'
import { PrismaPg } from '@prisma/adapter-pg'

const DATABASE_URL = env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

const connectionString = DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
