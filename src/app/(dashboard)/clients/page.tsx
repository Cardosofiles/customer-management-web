import type { Metadata } from 'next'
import type { JSX } from 'react'

import { UserPlus } from 'lucide-react'
import Link from 'next/link'

import { getClientes } from '@/actions/client'
import { Button } from '@/components/ui/button'
import { ClienteTable } from '@/modules/clients'

export const metadata: Metadata = {
  title: 'Clientes',
  description: 'Visualize a lista de clientes',
}

type SearchParams = {
  search?: string
  tipo?: string
  page?: string
}

interface PageProps {
  searchParams?: Promise<SearchParams>
}

const ClientesPage = async ({ searchParams }: PageProps): Promise<JSX.Element> => {
  const params = (await searchParams) ?? {}
  const currentSearch = params.search ?? ''
  const currentTipo =
    params.tipo === 'PESSOA_FISICA' || params.tipo === 'PESSOA_JURIDICA' ? params.tipo : 'TODOS'
  const currentPage = Math.max(1, Number(params.page ?? '1') || 1)

  const { clientes, total, pages } = await getClientes({
    search: currentSearch,
    tipo: currentTipo,
    page: currentPage,
    pageSize: 10,
  })

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row items-start space-y-4 w-full sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus clientes cadastrados</p>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>
      <ClienteTable
        clientes={clientes}
        total={total}
        pages={pages}
        currentPage={currentPage}
        currentSearch={currentSearch}
        currentTipo={currentTipo}
      />
    </div>
  )
}

export default ClientesPage
