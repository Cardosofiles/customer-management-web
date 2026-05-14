'use client'

import { useState } from 'react'
import type { JSX } from 'react'
import { IconLoader2, IconMail, IconUser } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useSendBirthdayMessages } from '../../hooks/use-campaign-mutations'
import type { BirthdayClient } from '../../hooks/use-birthday-clients'
import { useBirthdayClients } from '../../hooks/use-birthday-clients'

const today = new Date()
const todayLabel = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })

const DEFAULT_TITULO = 'Feliz Aniversário!'
const DEFAULT_MENSAGEM =
  'Hoje é um dia muito especial e queremos celebrar com você!\n\nEm nome de toda a nossa equipe, desejamos a você um feliz aniversário repleto de alegrias, saúde e realizações.\n\nObrigado por ser nosso cliente!'

function ClientRow({ cliente }: { cliente: BirthdayClient }): JSX.Element {
  const name =
    cliente.nomeCompleto ?? cliente.nomeFantasia ?? cliente.razaoSocial ?? 'Cliente'

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        <IconUser className="text-muted-foreground h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-muted-foreground truncate text-xs">{cliente.email}</p>
      </div>
      <Badge variant="outline" className="shrink-0 text-xs">
        {cliente.tipo === 'PESSOA_FISICA' ? 'PF' : 'PJ'}
      </Badge>
    </div>
  )
}

function BirthdayDialog({
  open,
  onOpenChange,
  count,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  count: number
}): JSX.Element {
  const [titulo, setTitulo] = useState(DEFAULT_TITULO)
  const [mensagem, setMensagem] = useState(DEFAULT_MENSAGEM)

  const { mutate: send, isPending } = useSendBirthdayMessages(() => onOpenChange(false))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">🎂</span>
            Mensagem de aniversário
          </DialogTitle>
          <DialogDescription>
            Personalize a mensagem que será enviada para os {count} aniversariante(s) de hoje.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="bday-titulo">Assunto do e-mail</Label>
            <Input
              id="bday-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bday-mensagem">Mensagem</Label>
            <Textarea
              id="bday-mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={7}
              className="resize-none"
            />
          </div>

          <p className="bg-muted rounded-md px-3 py-2 text-xs">
            O nome do destinatário será inserido automaticamente no e-mail.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={() => send({ titulo, mensagem })}
            disabled={isPending || !titulo.trim() || !mensagem.trim()}
          >
            {isPending ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <IconMail className="mr-2 h-4 w-4" />
                Enviar para {count} aniversariante(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function BirthdaySection(): JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: clients = [], isLoading } = useBirthdayClients()

  return (
    <>
      <Card className="border-pink-200 dark:border-pink-900/40">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="text-lg">🎂</span>
              Aniversariantes hoje
              <span className="text-muted-foreground text-xs font-normal">— {todayLabel}</span>
            </CardTitle>

            {!isLoading && clients.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="border-pink-300 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-950"
                onClick={() => setDialogOpen(true)}
              >
                <IconMail className="mr-1.5 h-3.5 w-3.5" />
                Enviar parabéns
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : clients.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              Nenhum cliente aniversaria hoje.
            </p>
          ) : (
            <div className="divide-y">
              {clients.map((c) => (
                <ClientRow key={c.id} cliente={c} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <BirthdayDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        count={clients.length}
      />
    </>
  )
}
