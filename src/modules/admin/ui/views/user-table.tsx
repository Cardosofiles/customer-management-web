'use client'

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { createTable, flexRender, getCoreRowModel, type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState, type JSX } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { ActionsCell } from '../components/user-management/actions-cell'

import { BanModal } from '@/modules/admin/ui/components/user-management/ban-model'
import type { AdminUser, UsersTableProps } from '../../types'

const UsersTable = ({ users, total, page, pageSize }: UsersTableProps): JSX.Element => {
  'use no memo'

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  const [banUserId, setBanUserId] = useState<string | null>(null)

  const navigatePage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: ({ row }) => row.original.name ?? '—',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span>{row.original.email}</span>
            <Badge
              variant={row.original.emailVerified ? 'secondary' : 'outline'}
              className={row.original.emailVerified ? 'text-xs' : 'text-xs text-muted-foreground'}
            >
              {row.original.emailVerified ? 'verificado' : 'não verificado'}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
            {row.original.role ?? 'user'}
          </Badge>
        ),
      },
      {
        accessorKey: 'banned',
        header: 'Status',
        cell: ({ row }) => {
          const { banned, banReason } = row.original
          if (banned) {
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="destructive" className="cursor-default">
                    banido
                  </Badge>
                </TooltipTrigger>
                {banReason && <TooltipContent>{banReason}</TooltipContent>}
              </Tooltip>
            )
          }
          return (
            <Badge variant="secondary" className="text-green-600">
              ativo
            </Badge>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Criado em',
        cell: ({ row }) =>
          format(new Date(row.original.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <ActionsCell user={row.original} onBanOpen={setBanUserId} />,
      },
    ],
    []
  )

  const table = useMemo(() => {
    const instance = createTable<AdminUser>({
      data: users,
      columns,
      getCoreRowModel: getCoreRowModel(),
      state: {},
      onStateChange: () => {},
      renderFallbackValue: null,
    })

    instance.setOptions((prev) => ({
      ...prev,
      state: instance.initialState,
    }))

    return instance
  }, [users, columns])

  return (
    <div className="space-y-4">
      <div className="border">
        <Table aria-label="Lista de usuários">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span aria-live="polite">
          {total} usuário{total !== 1 ? 's' : ''} · página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => navigatePage(page - 1)}
            aria-label="Página anterior"
          >
            <IconChevronLeft className="size-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => navigatePage(page + 1)}
            aria-label="Próxima página"
          >
            <IconChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <BanModal userId={banUserId} onClose={() => setBanUserId(null)} />
    </div>
  )
}

export { UsersTable }
