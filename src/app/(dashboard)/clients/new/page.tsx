import type { Metadata } from 'next'
import type { JSX } from 'react'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { ClienteForm } from '@/modules/clients'

export const metadata: Metadata = {
  title: 'Novo Cliente',
  description: 'Crie um novo cliente',
}

const NewClientePage = async (): Promise<JSX.Element> => {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/clients"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Cliente</h1>
        <p className="text-sm text-muted-foreground">Preencha os dados para cadastrar um cliente</p>
      </div>
      <ClienteForm mode="create" />
    </div>
  )
}

export default NewClientePage
