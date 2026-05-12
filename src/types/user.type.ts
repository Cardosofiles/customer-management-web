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
