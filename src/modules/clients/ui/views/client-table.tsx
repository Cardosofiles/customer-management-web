'use client'

import { Building2, MoreHorizontal, Search, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition, type JSX } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useTableParams } from '@/modules/clients/hooks/use-table-params'

import { deleteCliente, toggleAtivoCliente } from '@/actions/client'
import { ClienteDeleteDialog } from '@/modules/clients/ui/components/client-delet-dialog'
import { TablePagination } from '@/modules/clients/ui/components/table-pagination'
import type { ClienteListItem } from '@/types/user.type'
import { formatCNPJ, formatCPF, getDisplayName } from '@/utils/formater'

interface ClienteTableProps {
  clientes: ClienteListItem[]
  total: number
  pages: number
  currentPage: number
  currentSearch: string
  currentTipo: string
}

const ClienteTable = ({
  clientes,
  total,
  pages,
  currentPage,
  currentSearch,
  currentTipo,
}: ClienteTableProps): JSX.Element => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { updateParams, updatePage, debouncedSearch } = useTableParams()

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const result = await deleteCliente(id)
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.error)
        }
        if (result.success) router.refresh()
      } catch {
        toast.error('Erro inesperado ao excluir cliente.')
      }
    },
    [router]
  )

  const handleToggleAtivo = useCallback(
    (id: string, ativo: boolean) => {
      startTransition(async () => {
        try {
          const result = await toggleAtivoCliente(id, !ativo)
          if (result.success) {
            toast.success(result.message)
          } else {
            toast.error(result.error)
          }
          if (result.success) router.refresh()
        } catch {
          toast.error('Erro inesperado ao alterar status.')
        }
      })
    },
    [router]
  )

  return (
    <div className="space-y-4">
      {/* ── Filtros ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-50 flex-1">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            className="pl-9"
            placeholder="Buscar por nome, CPF, CNPJ, e-mail..."
            defaultValue={currentSearch}
            onChange={(e) => debouncedSearch(e.target.value)}
            aria-label="Buscar clientes"
          />
        </div>

        <Select value={currentTipo} onValueChange={(v) => updateParams({ tipo: v })}>
          <SelectTrigger className="w-44" aria-label="Filtrar por tipo de pessoa">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="PESSOA_FISICA">Pessoa Física</SelectItem>
            <SelectItem value="PESSOA_JURIDICA">Pessoa Jurídica</SelectItem>
          </SelectContent>
        </Select>

        <p className="ml-auto text-xs text-muted-foreground" aria-live="polite">
          {total} cliente{total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Tabela / Empty State ──────────────────────────────────────────── */}
      {clientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center border bg-card py-20 text-center">
          <User className="mb-3 h-10 w-10 text-muted-foreground/40" aria-hidden />
          <p className="text-sm font-medium text-muted-foreground">Nenhum cliente encontrado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {currentSearch ? 'Tente outro termo de busca.' : 'Comece cadastrando um novo cliente.'}
          </p>
          {!currentSearch && (
            <Link href="/clients/new" className="mt-4 text-xs text-primary hover:underline">
              Cadastrar primeiro cliente →
            </Link>
          )}
        </div>
      ) : (
        // ✅ rounded-md border já vem do Shadcn Table — sem div wrapper manual
        <Table aria-label="Lista de clientes" aria-busy={isPending}>
          <TableHeader>
            <TableRow>
              <TableHead>Nome / Razão Social</TableHead>
              <TableHead className="hidden md:table-cell">CPF / CNPJ</TableHead>
              <TableHead className="hidden lg:table-cell">Localização</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clientes.map((c) => (
              <TableRow key={c.id} aria-label={`Cliente ${getDisplayName(c)}`}>
                <TableCell>
                  <Link
                    href={`/clients/${c.id}`}
                    className="font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {getDisplayName(c)}
                  </Link>
                  {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                </TableCell>

                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {c.tipo === 'PESSOA_FISICA' ? formatCPF(c.cpf ?? '') : formatCNPJ(c.cnpj ?? '')}
                </TableCell>

                <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                  {c.cidade && c.estado ? `${c.cidade} — ${c.estado}` : '—'}
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {c.tipo === 'PESSOA_FISICA' ? (
                      <>
                        <User className="h-3 w-3" aria-hidden /> PF
                      </>
                    ) : (
                      <>
                        <Building2 className="h-3 w-3" aria-hidden /> PJ
                      </>
                    )}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge variant={c.ativo ? 'default' : 'secondary'} className="text-xs">
                    {c.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Ações para ${getDisplayName(c)}`}
                      >
                        <MoreHorizontal className="h-4 w-4" aria-hidden />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/clients/${c.id}`}>Ver detalhes</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/clients/${c.id}/edit`}>Editar</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => handleToggleAtivo(c.id, c.ativo)}
                        disabled={isPending}
                      >
                        {c.ativo ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <ClienteDeleteDialog
                        clienteNome={getDisplayName(c)}
                        onConfirm={() => handleDelete(c.id)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* ── Paginação ─────────────────────────────────────────────────────── */}
      <TablePagination currentPage={currentPage} pages={pages} onPageChange={updatePage} />
    </div>
  )
}

export { ClienteTable }
