import { Loader2, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { passkey } from '@/lib/auth-client'

type Passkey = Awaited<ReturnType<typeof passkey.listUserPasskeys>>['data'][number]

interface PasskeyTableProps {
  passkeys: Passkey[]
  deletingId: string | undefined
  onDelete: (id: string) => void
}

/**
 * Tabela com a lista de passkeys do usuário e ação de remoção por linha.
 */
export function PasskeyTable({ passkeys, deletingId, onDelete }: PasskeyTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Criada em</TableHead>
          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {passkeys.map((pk) => (
          <TableRow key={pk.id}>
            <TableCell className="font-medium">{pk.name}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(pk.createdAt).toLocaleDateString('pt-BR')}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remover passkey ${pk.name}`}
                disabled={deletingId === pk.id}
                onClick={() => onDelete(pk.id)}
              >
                {deletingId === pk.id ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Trash2 className="size-4 text-destructive" aria-hidden />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
