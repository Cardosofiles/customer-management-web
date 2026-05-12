import 'dotenv/config'
import { z } from 'zod'

import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from 'better-auth/crypto'
import { randomUUID } from 'node:crypto'
import { PrismaClient } from '../src/generated/prisma/client'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório'),
  SEED_ADMIN_EMAIL: z.email('SEED_ADMIN_EMAIL deve ser um email válido'),
  SEED_ADMIN_PASSWORD: z.string().min(8, 'SEED_ADMIN_PASSWORD deve ter pelo menos 8 caracteres'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:')
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString: parsed.data.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const seedAdmin = async () => {
  const email = parsed.data.SEED_ADMIN_EMAIL.toLowerCase()
  const passwordHash = await hashPassword(parsed.data.SEED_ADMIN_PASSWORD)

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  const userId = existingUser?.id ?? randomUUID()

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: userId,
        name: 'Admin',
        email,
        emailVerified: true,
        role: 'admin',
      },
    })
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: 'admin',
        emailVerified: true,
      },
    })
  }

  const existingAccount = await prisma.account.findFirst({
    where: {
      userId,
      providerId: 'credential',
    },
  })

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: {
        accountId: userId,
        password: passwordHash,
      },
    })
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        userId,
        providerId: 'credential',
        accountId: userId,
        password: passwordHash,
      },
    })
  }

  console.log(`✅ Admin seeded: ${email}`)
}

seedAdmin()
  .catch((error) => {
    console.error('❌ Falha ao inicializar o usuário administrador.', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
