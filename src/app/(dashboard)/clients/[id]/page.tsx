import type { Metadata } from 'next'
import type { JSX } from 'react'

import { ArrowLeft, Building2, Pencil, User } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getClienteById } from '@/actions/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCEP, formatCNPJ, formatCPF, formatTelefone, getDisplayName } from '@/utils/formater'

export const metadata: Metadata = {
  title: 'Novo Cliente',
  description: 'Crie um novo cliente',
}

interface Props {
  params: Promise<{ id: string }>
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border bg-card p-6">
      <h2 className="mb-4 text-sm font-semibold text-foreground">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  )
}

const ClienteDetailPage = async ({ params }: Props): Promise<JSX.Element> => {
  const { id } = await params

  const result = await getClienteById(id)
  if (!result.success) notFound()
  const cliente = result.data

  const isPF = cliente.tipo === 'PESSOA_FISICA'

  return (
    <div className="space-y-6 p-10">
      <div className="flex items-center gap-3">
        <Link
          href="/clients"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {isPF ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{getDisplayName(cliente)}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </Badge>
              <Badge variant={cliente.ativo ? 'default' : 'secondary'} className="text-xs">
                {cliente.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href={`/clients/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      {isPF ? (
        <Section title="Dados Pessoais">
          <DetailRow label="Nome Completo" value={cliente.nomeCompleto} />
          <DetailRow label="CPF" value={formatCPF(cliente.cpf ?? '')} />
          <DetailRow label="RG" value={cliente.rg} />
          <DetailRow
            label="Data de Nascimento"
            value={
              cliente.dataNascimento
                ? new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')
                : undefined
            }
          />
        </Section>
      ) : (
        <Section title="Dados da Empresa">
          <DetailRow label="Razão Social" value={cliente.razaoSocial} />
          <DetailRow label="Nome Fantasia" value={cliente.nomeFantasia} />
          <DetailRow label="CNPJ" value={formatCNPJ(cliente.cnpj ?? '')} />
          <DetailRow label="Inscrição Estadual" value={cliente.inscricaoEstadual} />
          <DetailRow label="Inscrição Municipal" value={cliente.inscricaoMunicipal} />
          <DetailRow label="Responsável" value={cliente.responsavelNome} />
          <DetailRow label="Cargo" value={cliente.responsavelCargo} />
        </Section>
      )}

      <Section title="Endereço">
        <DetailRow label="CEP" value={formatCEP(cliente.cep ?? '')} />
        <div className="sm:col-span-2">
          <DetailRow
            label="Logradouro"
            value={
              cliente.rua
                ? `${cliente.rua}, ${cliente.numero ?? 'S/N'}${cliente.complemento ? ` — ${cliente.complemento}` : ''}`
                : undefined
            }
          />
        </div>
        <DetailRow label="Bairro" value={cliente.bairro} />
        <DetailRow label="Cidade" value={cliente.cidade} />
        <DetailRow label="Estado" value={cliente.estado} />
      </Section>

      <Section title="Contato">
        <DetailRow label="E-mail" value={cliente.email} />
        <DetailRow label="Celular" value={formatTelefone(cliente.celular ?? '')} />
        <DetailRow label="Telefone Fixo" value={formatTelefone(cliente.telefone ?? '')} />
        <DetailRow label="Site" value={cliente.site} />
        {cliente.observacoes && (
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs text-muted-foreground">Observações</p>
            <p className="text-sm">{cliente.observacoes}</p>
          </div>
        )}
      </Section>

      <p className="text-xs text-muted-foreground">
        Cadastrado em {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
      </p>
    </div>
  )
}

export default ClienteDetailPage
