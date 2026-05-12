'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition, type JSX } from 'react'
import { toast } from 'sonner'

import { banUser } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { BanModalProps } from '../../../types'

const BanModal = ({ userId, onClose }: BanModalProps): JSX.Element => {
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleConfirm = () => {
    if (!reason.trim() || !userId) return
    startTransition(async () => {
      try {
        await banUser(userId, reason.trim())
        toast.success('Usuário banido com sucesso.')
        router.refresh()
        onClose()
      } catch {
        toast.error('Erro ao banir usuário.')
      }
    })
  }

  return (
    <Dialog
      open={!!userId}
      onOpenChange={(v) => {
        if (!v) {
          setReason('')
          onClose()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Banir usuário</DialogTitle>
          <DialogDescription>Informe o motivo do banimento.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="ban-reason">Motivo</Label>
          <Input
            id="ban-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Violação dos termos de uso"
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isPending}
            aria-busy={isPending}
          >
            Banir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { BanModal }
