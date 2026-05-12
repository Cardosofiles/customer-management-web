import { validateCNPJ, validateCPF } from '@/utils/formater'
import { z } from 'zod'

// ── Endereço ────────────────────────────────────────────────────────────────
const enderecoShape = {
  cep: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().length(8, 'CEP inválido')),
  rua: z.string().min(1, 'Rua é obrigatória'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional().default(''),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Selecione o estado'),
}

// ── Contato ─────────────────────────────────────────────────────────────────
const contatoShape = {
  email: z.email('E-mail inválido').optional().or(z.literal('')).default(''),
  telefone: z.string().optional().default(''),
  celular: z.string().optional().default(''),
  site: z.url('URL inválida').optional().or(z.literal('')).default(''),
  observacoes: z.string().optional().default(''),
}

// ── Pessoa Física ────────────────────────────────────────────────────────────
export const pessoaFisicaSchema = z.object({
  ...enderecoShape,
  ...contatoShape,
  tipo: z.literal('PESSOA_FISICA'),
  nomeCompleto: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().refine(validateCPF, { message: 'CPF inválido' })),
  rg: z.string().optional().default(''),
  dataNascimento: z.string().optional().default(''),
})

// ── Pessoa Jurídica ──────────────────────────────────────────────────────────
export const pessoaJuridicaSchema = z.object({
  ...enderecoShape,
  ...contatoShape,
  tipo: z.literal('PESSOA_JURIDICA'),
  razaoSocial: z.string().min(3, 'Razão social é obrigatória'),
  nomeFantasia: z.string().optional().default(''),
  cnpj: z
    .string()
    .transform((v) => v.toUpperCase().replace(/[.\-/\s]/g, ''))
    .pipe(z.string().refine(validateCNPJ, { message: 'CNPJ inválido' })),
  inscricaoEstadual: z.string().optional().default(''),
  inscricaoMunicipal: z.string().optional().default(''),
  responsavelNome: z.string().optional().default(''),
  responsavelCargo: z.string().optional().default(''),
})

// ── Union ────────────────────────────────────────────────────────────────────
export const clienteSchema = z.discriminatedUnion('tipo', [
  pessoaFisicaSchema,
  pessoaJuridicaSchema,
])
