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

const CLIENTES_SEED = 'clientes-seed-v1'
const CLIENTES_COUNT = 20

const nomes = [
  'Ana',
  'Bruno',
  'Carla',
  'Diego',
  'Eduarda',
  'Felipe',
  'Gabriela',
  'Henrique',
  'Isabela',
  'Joao',
  'Larissa',
  'Marcos',
  'Natalia',
  'Otavio',
  'Paula',
  'Rafael',
  'Sofia',
  'Tiago',
  'Vanessa',
  'Yuri',
]

const sobrenomes = [
  'Silva',
  'Souza',
  'Almeida',
  'Costa',
  'Oliveira',
  'Ferreira',
  'Gomes',
  'Ribeiro',
  'Martins',
  'Lima',
  'Carvalho',
  'Araujo',
  'Barbosa',
  'Rocha',
  'Dias',
  'Teixeira',
  'Moura',
  'Batista',
  'Nunes',
  'Cardoso',
]

const ruas = [
  'Rua das Flores',
  'Avenida Central',
  'Rua dos Pinhais',
  'Avenida Brasil',
  'Rua Bela Vista',
  'Rua do Comercio',
  'Avenida Atlantica',
  'Rua das Acacias',
  'Avenida Paulista',
  'Rua da Lagoa',
]

const bairros = ['Centro', 'Jardins', 'Industrial', 'Vila Nova', 'Boa Vista', 'Planalto']
const cidades = [
  'Sao Paulo',
  'Campinas',
  'Curitiba',
  'Florianopolis',
  'Porto Alegre',
  'Belo Horizonte',
]
const estados = ['SP', 'PR', 'SC', 'RS', 'MG']
const cargos = ['Diretor', 'Gerente', 'Coordenador', 'Supervisor', 'Analista']
const razoes = ['Alfa', 'Nova', 'Sigma', 'Prime', 'Vita', 'Delta', 'Atlas', 'Orion']
const segmentos = ['Tech', 'Comercio', 'Servicos', 'Logistica', 'Saude', 'Construcao']

const xmur3 = (seed: string) => {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

const mulberry32 = (seed: number) => {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const makeRng = (seed: string) => {
  const seedFn = xmur3(seed)
  return mulberry32(seedFn())
}

const pick = <T>(items: T[], rng: () => number) => items[Math.floor(rng() * items.length)]

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()

const padNumber = (value: number, length: number) => value.toString().padStart(length, '0')

const generateCpf = (index: number) => `9${padNumber(index + 1, 10)}`
const generateCnpj = (index: number) => `8${padNumber(index + 1, 13)}`

const randomInt = (min: number, max: number, rng: () => number) =>
  Math.floor(rng() * (max - min + 1)) + min

const randomDate = (start: Date, end: Date, rng: () => number) => {
  const range = end.getTime() - start.getTime()
  const offset = Math.floor(rng() * range)
  return new Date(start.getTime() + offset)
}

const buildEmail = (name: string, index: number) => `${toSlug(name)}.${index + 1}@example.com`

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

const seedClientes = async () => {
  const rng = makeRng(CLIENTES_SEED)
  let createdPf = 0
  let createdPj = 0

  for (let i = 0; i < CLIENTES_COUNT; i += 1) {
    const nome = `${pick(nomes, rng)} ${pick(sobrenomes, rng)}`
    const cpf = generateCpf(i)
    const email = buildEmail(nome, i)

    const exists = await prisma.cliente.findUnique({
      where: { cpf },
    })

    if (exists) continue

    await prisma.cliente.create({
      data: {
        tipo: 'PESSOA_FISICA',
        nomeCompleto: nome,
        cpf,
        rg: padNumber(randomInt(1000000, 9999999, rng), 7),
        dataNascimento: randomDate(new Date(1970, 0, 1), new Date(2002, 11, 31), rng),
        cep: padNumber(randomInt(10000000, 99999999, rng), 8),
        rua: pick(ruas, rng),
        numero: `${randomInt(10, 999, rng)}`,
        complemento: `Apto ${randomInt(1, 99, rng)}`,
        bairro: pick(bairros, rng),
        cidade: pick(cidades, rng),
        estado: pick(estados, rng),
        email,
        telefone: `11${padNumber(randomInt(10000000, 99999999, rng), 8)}`,
        celular: `119${padNumber(randomInt(10000000, 99999999, rng), 8)}`,
        site: `https://www.${toSlug(nome)}.com.br`,
        observacoes: 'Cliente PF gerado para testes',
        ativo: true,
      },
    })

    createdPf += 1
  }

  for (let i = 0; i < CLIENTES_COUNT; i += 1) {
    const razaoSocial = `${pick(razoes, rng)} ${pick(segmentos, rng)} LTDA`
    const nomeFantasia = `${pick(razoes, rng)} ${pick(segmentos, rng)}`
    const responsavelNome = `${pick(nomes, rng)} ${pick(sobrenomes, rng)}`
    const cnpj = generateCnpj(i)
    const email = buildEmail(nomeFantasia, i)

    const exists = await prisma.cliente.findUnique({
      where: { cnpj },
    })

    if (exists) continue

    await prisma.cliente.create({
      data: {
        tipo: 'PESSOA_JURIDICA',
        razaoSocial,
        nomeFantasia,
        cnpj,
        inscricaoEstadual: padNumber(randomInt(10000000, 99999999, rng), 8),
        inscricaoMunicipal: padNumber(randomInt(100000, 999999, rng), 6),
        responsavelNome,
        responsavelCargo: pick(cargos, rng),
        cep: padNumber(randomInt(10000000, 99999999, rng), 8),
        rua: pick(ruas, rng),
        numero: `${randomInt(10, 999, rng)}`,
        complemento: `Sala ${randomInt(1, 20, rng)}`,
        bairro: pick(bairros, rng),
        cidade: pick(cidades, rng),
        estado: pick(estados, rng),
        email,
        telefone: `11${padNumber(randomInt(10000000, 99999999, rng), 8)}`,
        celular: `119${padNumber(randomInt(10000000, 99999999, rng), 8)}`,
        site: `https://www.${toSlug(nomeFantasia)}.com.br`,
        observacoes: 'Cliente PJ gerado para testes',
        ativo: true,
      },
    })

    createdPj += 1
  }

  console.log(`✅ Clientes PF criados: ${createdPf}`)
  console.log(`✅ Clientes PJ criados: ${createdPj}`)
}

seedAdmin()
  .then(seedClientes)
  .catch((error) => {
    console.error('❌ Falha ao inicializar o usuário administrador.', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
