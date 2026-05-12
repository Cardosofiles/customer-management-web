const formatCPF = (value: string): string => {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

const formatCNPJ = (value: string): string => {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const raiz = clean.slice(0, 12)
  const dv = clean.slice(12).replace(/\D/g, '').slice(0, 2)
  const d = (raiz + dv).slice(0, 14)

  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

const formatCEP = (value: string): string => {
  const d = value.replace(/\D/g, '').slice(0, 8)
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`
}

const formatTelefone = (value: string): string => {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const stripMask = (value: string): string => value.replace(/\D/g, '')

const stripCNPJMask = (value: string): string =>
  value
    .toUpperCase()
    .replace(/[.\-/\s]/g, '')
    .slice(0, 14)

const validateCPF = (cpf: string): boolean => {
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  let s = 0
  for (let i = 0; i < 9; i++) s += +d[i] * (10 - i)
  let r = (s * 10) % 11
  if (r === 10 || r === 11) r = 0
  if (r !== +d[9]) return false
  s = 0
  for (let i = 0; i < 10; i++) s += +d[i] * (11 - i)
  r = (s * 10) % 11
  if (r === 10 || r === 11) r = 0
  return r === +d[10]
}

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

const validateCNPJ = (cnpj: string): boolean => {
  const d = cnpj.toUpperCase().replace(/[.\-/\s]/g, '')

  if (d.length !== 14) return false

  if (/^(.)\1{13}$/.test(d)) return false

  if (!/^\d{2}$/.test(d.slice(12))) return false

  const toVal = (c: string): number => c.charCodeAt(0) - 48

  const calc = (str: string, weights: number[]): number =>
    weights.reduce((acc, w, i) => acc + toVal(str[i]) * w, 0)

  const r1 = calc(d, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) % 11
  const r2 = calc(d, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) % 11

  const dv1 = r1 < 2 ? 0 : 11 - r1
  const dv2 = r2 < 2 ? 0 : 11 - r2

  return dv1 === +d[12] && dv2 === +d[13]
}

const getDisplayName = (c: {
  tipo: string
  nomeCompleto?: string | null
  razaoSocial?: string | null
  nomeFantasia?: string | null
}): string => {
  return c.tipo === 'PESSOA_JURIDICA'
    ? c.nomeFantasia || c.razaoSocial || '—'
    : c.nomeCompleto || '—'
}

const ESTADOS_BR = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const

export {
  ESTADOS_BR,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatTelefone,
  getDisplayName,
  stripCNPJMask,
  stripMask,
  validateCNPJ,
  validateCPF,
  validateEmail,
}
