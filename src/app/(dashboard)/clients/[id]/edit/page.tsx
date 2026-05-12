import type { Metadata } from 'next'
import type { JSX } from 'react'

import { ArrowLeft } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { getClienteById } from '@/actions/client'
import { auth } from '@/lib/auth'
import { ClienteForm } from '@/modules/clients'
import type { ClienteFormData } from '@/types/user.type'

export const metadata: Metadata = {
  title: 'Editar Cliente',
  description: 'Edite as informações do cliente',
}

interface Props {
  params: Promise<{ id: string }>
}

const EditClientPage = async ({ params }: Props): Promise<JSX.Element> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return redirect('/sign-in')

  const { id } = await params

  // ✅ destructure do ActionResult
  const result = await getClienteById(id)
  if (!result.success) notFound()
  const cliente = result.data

  let defaultValues: ClienteFormData

  if (cliente.tipo === 'PESSOA_FISICA') {
    defaultValues = {
      tipo: 'PESSOA_FISICA',
      nomeCompleto: cliente.nomeCompleto ?? '',
      cpf: cliente.cpf ?? '',
      rg: cliente.rg ?? '',
      dataNascimento: cliente.dataNascimento
        ? cliente.dataNascimento.toISOString().split('T')[0]
        : '',
      cep: cliente.cep ?? '',
      rua: cliente.rua ?? '',
      numero: cliente.numero ?? '',
      complemento: cliente.complemento ?? '',
      bairro: cliente.bairro ?? '',
      cidade: cliente.cidade ?? '',
      estado: cliente.estado ?? '',
      email: cliente.email ?? '',
      telefone: cliente.telefone ?? '',
      celular: cliente.celular ?? '',
      site: cliente.site ?? '',
      observacoes: cliente.observacoes ?? '',
    }
  } else {
    defaultValues = {
      tipo: 'PESSOA_JURIDICA',
      razaoSocial: cliente.razaoSocial ?? '',
      nomeFantasia: cliente.nomeFantasia ?? '',
      cnpj: cliente.cnpj ?? '',
      inscricaoEstadual: cliente.inscricaoEstadual ?? '',
      inscricaoMunicipal: cliente.inscricaoMunicipal ?? '',
      responsavelNome: cliente.responsavelNome ?? '',
      responsavelCargo: cliente.responsavelCargo ?? '',
      cep: cliente.cep ?? '',
      rua: cliente.rua ?? '',
      numero: cliente.numero ?? '',
      complemento: cliente.complemento ?? '',
      bairro: cliente.bairro ?? '',
      cidade: cliente.cidade ?? '',
      estado: cliente.estado ?? '',
      email: cliente.email ?? '',
      telefone: cliente.telefone ?? '',
      celular: cliente.celular ?? '',
      site: cliente.site ?? '',
      observacoes: cliente.observacoes ?? '',
    }
  }

  return (
    <div className="space-y-6 p-10">
      <div className="flex items-center gap-3">
        <Link
          href={`/clients/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Cliente</h1>
        <p className="text-sm text-muted-foreground">Atualize os dados do cliente</p>
      </div>
      <ClienteForm mode="edit" clienteId={id} defaultValues={defaultValues} />
    </div>
  )
}

export default EditClientPage
