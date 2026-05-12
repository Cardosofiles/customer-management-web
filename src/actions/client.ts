'use server'

import { revalidatePath } from 'next/cache'

import { Prisma } from '@/generated/prisma/client'
import { prisma as db } from '@/lib/prisma'
import { clienteSchema } from '@/schemas/client.schema'
import type { ActionResult, Cliente, ClienteFormData } from '@/types/user.type'
import { getMonthRanges } from '@/utils/date'
import { stripMask } from '@/utils/formater'

const CLIENTS_PATH = '/clients' as const

function getUniqueConstraintField(err: unknown): string | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const target = (err.meta?.target as string[] | undefined)?.[0] ?? ''
    if (target.includes('cpf')) return 'CPF'
    if (target.includes('cnpj')) return 'CNPJ'
    return 'Campo'
  }
  return null
}

// ── Normalização ─────────────────────────────────────────────────────────────
function normalizeData(data: ClienteFormData): Prisma.ClienteCreateInput {
  const base = {
    cep: stripMask(data.cep),
    rua: data.rua,
    numero: data.numero,
    complemento: data.complemento || null,
    bairro: data.bairro,
    cidade: data.cidade,
    estado: data.estado,
    email: data.email || null,
    telefone: stripMask(data.telefone ?? '') || null,
    celular: stripMask(data.celular ?? '') || null,
    site: data.site || null,
    observacoes: data.observacoes || null,
  }

  if (data.tipo === 'PESSOA_FISICA') {
    return {
      ...base,
      tipo: 'PESSOA_FISICA',
      nomeCompleto: data.nomeCompleto,
      cpf: stripMask(data.cpf),
      rg: data.rg || null,
      dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : null,
      razaoSocial: null,
      nomeFantasia: null,
      cnpj: null,
      inscricaoEstadual: null,
      inscricaoMunicipal: null,
      responsavelNome: null,
      responsavelCargo: null,
    }
  }

  return {
    ...base,
    tipo: 'PESSOA_JURIDICA',
    razaoSocial: data.razaoSocial,
    nomeFantasia: data.nomeFantasia || null,
    cnpj: stripMask(data.cnpj),
    inscricaoEstadual: data.inscricaoEstadual || null,
    inscricaoMunicipal: data.inscricaoMunicipal || null,
    responsavelNome: data.responsavelNome || null,
    responsavelCargo: data.responsavelCargo || null,
    nomeCompleto: null,
    cpf: null,
    rg: null,
    dataNascimento: null,
  }
}

// ── CREATE ────────────────────────────────────────────────────────────────────
export async function createCliente(data: ClienteFormData): Promise<ActionResult<Cliente>> {
  const parsed = clienteSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Dados inválidos.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const cliente = await db.cliente.create({ data: normalizeData(parsed.data) })
    revalidatePath(CLIENTS_PATH)
    return { success: true, data: cliente, message: 'Cliente criado com sucesso!' }
  } catch (err) {
    const field = getUniqueConstraintField(err) // ✅ P2002 + meta.target
    if (field) return { success: false, error: `${field} já cadastrado.` }
    return { success: false, error: 'Erro interno. Tente novamente.' }
  }
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
export async function updateCliente(
  id: string,
  data: ClienteFormData
): Promise<ActionResult<Cliente>> {
  const parsed = clienteSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Dados inválidos.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    const cliente = await db.cliente.update({ where: { id }, data: normalizeData(parsed.data) })
    revalidatePath(CLIENTS_PATH)
    revalidatePath(`${CLIENTS_PATH}/${id}`)
    return { success: true, data: cliente, message: 'Atualizado com sucesso!' }
  } catch (err) {
    const field = getUniqueConstraintField(err)
    if (field) return { success: false, error: `${field} já cadastrado em outro cliente.` }
    return { success: false, error: 'Erro interno.' }
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function deleteCliente(id: string): Promise<ActionResult<void>> {
  try {
    await db.cliente.delete({ where: { id } })
    revalidatePath(CLIENTS_PATH)
    return { success: true, data: undefined, message: 'Cliente excluído.' }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return { success: false, error: 'Cliente não encontrado.' }
    }
    return { success: false, error: 'Não foi possível excluir.' }
  }
}

// ── TOGGLE ATIVO ──────────────────────────────────────────────────────────────
export async function toggleAtivoCliente(
  id: string,
  ativo: boolean
): Promise<ActionResult<Cliente>> {
  try {
    const cliente = await db.cliente.update({ where: { id }, data: { ativo } })
    revalidatePath(CLIENTS_PATH)
    return { success: true, data: cliente, message: ativo ? 'Ativado.' : 'Desativado.' }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return { success: false, error: 'Cliente não encontrado.' }
    }
    return { success: false, error: 'Erro ao atualizar status.' }
  }
}

// ── QUERIES ───────────────────────────────────────────────────────────────────
export async function getClientes(params?: {
  search?: string
  tipo?: 'PESSOA_FISICA' | 'PESSOA_JURIDICA' | 'TODOS'
  ativo?: boolean
  page?: number
  pageSize?: number
}) {
  const { search = '', tipo = 'TODOS', ativo, page = 1, pageSize = 10 } = params ?? {}

  const where: Prisma.ClienteWhereInput = {
    ...(typeof ativo === 'boolean' ? { ativo } : {}),
    ...(tipo !== 'TODOS' ? { tipo } : {}),
    ...(search
      ? {
          OR: [
            { nomeCompleto: { contains: search, mode: 'insensitive' } },
            { razaoSocial: { contains: search, mode: 'insensitive' } },
            { nomeFantasia: { contains: search, mode: 'insensitive' } },
            { cpf: { contains: search } },
            { cnpj: { contains: search } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  try {
    const [clientes, total] = await Promise.all([
      db.cliente.findMany({
        where,
        select: {
          id: true,
          tipo: true,
          nomeCompleto: true,
          razaoSocial: true,
          nomeFantasia: true,
          cpf: true,
          cnpj: true,
          cidade: true,
          estado: true,
          celular: true,
          email: true,
          ativo: true,
          createdAt: true,
        },
        orderBy: [{ nomeCompleto: 'asc' }, { razaoSocial: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.cliente.count({ where }),
    ])

    return { clientes, total, pages: Math.ceil(total / pageSize) }
  } catch {
    return { clientes: [], total: 0, pages: 0 }
  }
}

export async function getClientesTotal(): Promise<ActionResult<number>> {
  try {
    const total = await db.cliente.count()
    return { success: true, data: total }
  } catch {
    return { success: false, error: 'Erro ao carregar total de clientes.' }
  }
}

// ✅ 1 query com groupBy em vez de 2 queries separadas
export async function getClientesTotalPorTipo(): Promise<
  ActionResult<{ pessoasFisicas: number; pessoasJuridicas: number }>
> {
  try {
    const rows = await db.cliente.groupBy({
      by: ['tipo'],
      _count: { _all: true },
    })

    const pessoasFisicas = rows.find((r) => r.tipo === 'PESSOA_FISICA')?._count._all ?? 0
    const pessoasJuridicas = rows.find((r) => r.tipo === 'PESSOA_JURIDICA')?._count._all ?? 0

    return { success: true, data: { pessoasFisicas, pessoasJuridicas } }
  } catch {
    return { success: false, error: 'Erro ao carregar total por tipo.' }
  }
}

export async function getClientesMetricsMes(): Promise<
  ActionResult<{
    totalMes: number
    totalMesAnterior: number
    pfMes: number
    pfMesAnterior: number
    pjMes: number
    pjMesAnterior: number
  }>
> {
  try {
    const { currentStart, nextStart, previousStart } = getMonthRanges()

    const [meAtual, mesAnterior] = await Promise.all([
      db.cliente.groupBy({
        by: ['tipo'],
        where: { createdAt: { gte: currentStart, lt: nextStart } },
        _count: { _all: true },
      }),
      db.cliente.groupBy({
        by: ['tipo'],
        where: { createdAt: { gte: previousStart, lt: currentStart } },
        _count: { _all: true },
      }),
    ])

    const count = (rows: typeof meAtual, tipo: 'PESSOA_FISICA' | 'PESSOA_JURIDICA') =>
      rows.find((r) => r.tipo === tipo)?._count._all ?? 0

    const pfMes = count(meAtual, 'PESSOA_FISICA')
    const pjMes = count(meAtual, 'PESSOA_JURIDICA')
    const pfMesAnterior = count(mesAnterior, 'PESSOA_FISICA')
    const pjMesAnterior = count(mesAnterior, 'PESSOA_JURIDICA')

    return {
      success: true,
      data: {
        totalMes: pfMes + pjMes,
        totalMesAnterior: pfMesAnterior + pjMesAnterior,
        pfMes,
        pfMesAnterior,
        pjMes,
        pjMesAnterior,
      },
    }
  } catch {
    return { success: false, error: 'Erro ao carregar métricas do mês.' }
  }
}

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export async function getClienteById(id: string): Promise<ActionResult<Cliente>> {
  try {
    const cliente = await db.cliente.findUnique({ where: { id } })
    if (!cliente) return { success: false, error: 'Cliente não encontrado.' }
    return { success: true, data: cliente }
  } catch {
    return { success: false, error: 'Erro ao buscar cliente.' }
  }
}
