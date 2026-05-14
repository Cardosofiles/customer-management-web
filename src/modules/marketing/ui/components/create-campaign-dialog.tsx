'use client'

import { useState } from 'react'
import type { JSX } from 'react'
import { IconMail, IconPlus } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCampaign } from '../../hooks/use-campaign-mutations'
import { useRecipientsCount } from '../../hooks/use-recipients-count'
import type { CampaignFormData, PublicoCampanha, TipoCampanha } from '../../types'

const TIPOS: { value: TipoCampanha; label: string; description: string }[] = [
  { value: 'CAMPANHA', label: 'Campanha', description: 'Comunicação geral' },
  { value: 'EVENTO', label: 'Evento', description: 'Convite para evento' },
  { value: 'ACAO', label: 'Promoção', description: 'Oferta ou desconto' },
  { value: 'ANIVERSARIO', label: 'Aniversário', description: 'Parabéns ao cliente' },
]

const PUBLICOS: { value: PublicoCampanha; label: string }[] = [
  { value: 'TODOS', label: 'Todos os clientes ativos' },
  { value: 'PESSOA_FISICA', label: 'Somente Pessoa Física' },
  { value: 'PESSOA_JURIDICA', label: 'Somente Pessoa Jurídica' },
]

const EMPTY_FORM: CampaignFormData = {
  titulo: '',
  mensagem: '',
  tipo: 'CAMPANHA',
  publico: 'TODOS',
}

export function CreateCampaignDialog(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CampaignFormData>(EMPTY_FORM)

  const { data: recipientsCount } = useRecipientsCount(form.publico, open)

  const { mutate: create, isPending } = useCreateCampaign(() => {
    setOpen(false)
    setForm(EMPTY_FORM)
  })

  function handleChange(field: keyof CampaignFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Nova campanha
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconMail className="h-5 w-5" />
            Nova campanha de e-mail
          </DialogTitle>
          <DialogDescription>
            Crie e envie uma campanha de e-mail para seus clientes cadastrados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="tipo">Tipo de campanha</Label>
            <Select value={form.tipo} onValueChange={(v) => handleChange('tipo', v)}>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="font-medium">{t.label}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{t.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Ex: Grande liquidação de fim de ano"
              value={form.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea
              id="mensagem"
              placeholder="Escreva a mensagem do e-mail..."
              value={form.mensagem}
              onChange={(e) => handleChange('mensagem', e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="publico">Público-alvo</Label>
            <Select value={form.publico} onValueChange={(v) => handleChange('publico', v)}>
              <SelectTrigger id="publico">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PUBLICOS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {recipientsCount !== undefined && (
              <p className="text-muted-foreground text-xs">
                {recipientsCount === 0
                  ? 'Nenhum cliente com e-mail cadastrado para este filtro.'
                  : `${recipientsCount} cliente(s) receberão este e-mail.`}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={() => create(form)}
            disabled={isPending || !form.titulo.trim() || !form.mensagem.trim()}
          >
            {isPending ? 'Salvando...' : 'Criar campanha'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
