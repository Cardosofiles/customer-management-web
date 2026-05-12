'use client'

import {
  IconDotsVertical,
  IconShield,
  IconShieldOff,
  IconUserCheck,
  IconUserOff,
} from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useTransition, type JSX } from 'react'
import { toast } from 'sonner'

import { promoteToAdmin, revokeAdmin, unbanUser } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { ActionsCellProps } from '../../../types'

const ActionsCell = ({ user, onBanOpen }: ActionsCellProps): JSX.Element => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const run = (action: () => Promise<void>, successMsg: string) => {
    startTransition(async () => {
      try {
        await action()
        toast.success(successMsg)
        router.refresh()
      } catch {
        toast.error('Ocorreu um erro. Tente novamente.')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          aria-label={`Ações para ${user.name ?? user.email}`}
        >
          <IconDotsVertical className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.role !== 'admin' ? (
          <DropdownMenuItem
            onSelect={() => run(() => promoteToAdmin(user.id), 'Promovido para admin.')}
          >
            <IconShield className="size-4" aria-hidden />
            Promover para Admin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={() => run(() => revokeAdmin(user.id), 'Admin revogado.')}>
            <IconShieldOff className="size-4" aria-hidden />
            Revogar Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {user.banned ? (
          <DropdownMenuItem onSelect={() => run(() => unbanUser(user.id), 'Usuário desbanido.')}>
            <IconUserCheck className="size-4" aria-hidden />
            Desbanir
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem variant="destructive" onSelect={() => onBanOpen(user.id)}>
            <IconUserOff className="size-4" aria-hidden />
            Banir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ActionsCell }
