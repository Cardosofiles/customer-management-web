import { z } from 'zod'

import type {
  clienteSchema,
  pessoaFisicaSchema,
  pessoaJuridicaSchema,
} from '@/schemas/client.schema'

// ── Types ────────────────────────────────────────────────────────────────────
export type PessoaFisicaFormData = z.infer<typeof pessoaFisicaSchema>
export type PessoaJuridicaFormData = z.infer<typeof pessoaJuridicaSchema>
export type ClienteFormData = z.infer<typeof clienteSchema>
export type ClienteFormInputData = z.input<typeof clienteSchema>

import type { Cliente, Prisma, TipoCliente } from '@/generated/prisma/client'

// ── Re-exports do Prisma ────────────────────────────────────────────────────
export type { Cliente, TipoCliente }

// ── Tipo de item na listagem (subset do Cliente) ────────────────────────────
export type ClienteListItem = Pick<
  Cliente,
  | 'id'
  | 'tipo'
  | 'nomeCompleto'
  | 'razaoSocial'
  | 'nomeFantasia'
  | 'cpf'
  | 'cnpj'
  | 'cidade'
  | 'estado'
  | 'celular'
  | 'email'
  | 'ativo'
  | 'createdAt'
>

// ── Resultado genérico de Server Actions ────────────────────────────────────
export type ActionResult<T = undefined> =
  | {
      success: true
      data: T
      message?: string
    }
  | {
      success: false
      error: string
      fieldErrors?: Record<string, string[]>
    }

// ── Parâmetros de query para getClientes() ──────────────────────────────────
export type GetClientesParams = {
  search?: string
  tipo?: TipoCliente | 'TODOS'
  ativo?: boolean
  page?: number
  pageSize?: number
}

// ── Resposta paginada ───────────────────────────────────────────────────────
export type PaginatedResult<T> = {
  data: T[]
  total: number
  pages: number
  page: number
}

// ── Input para criação/atualização via Prisma (interno) ─────────────────────
export type ClienteCreateInput = Prisma.ClienteCreateInput
export type ClienteUpdateInput = Prisma.ClienteUpdateInput
