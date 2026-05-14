'use client'

import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { IconEdit } from '@tabler/icons-react'

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateCampaign } from '../../hooks/use-campaign-mutations'
import { useRecipientsCount } from '../../hooks/use-recipients-count'
import type { CampaignFormData, CampaignListItem, PublicoCampanha, TipoCampanha } from '../../types'

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

interface EditCampaignDialogProps {
  campaign: CampaignListItem
  initialMensagem: string
}

export function EditCampaignDialog({ campaign, initialMensagem }: EditCampaignDialogProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CampaignFormData>({
    titulo: campaign.titulo,
    mensagem: initialMensagem,
    tipo: campaign.tipo,
    publico: campaign.publico,
  })

  useEffect(() => {
    if (open) {
      setForm({
        titulo: campaign.titulo,
        mensagem: initialMensagem,
        tipo: campaign.tipo,
        publico: campaign.publico,
      })
    }
  }, [open, campaign, initialMensagem])

  const { data: recipientsCount } = useRecipientsCount(form.publico, open)
  const { mutate: update, isPending } = useUpdateCampaign(() => setOpen(false))

  function handleChange(field: keyof CampaignFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <IconEdit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Editar campanha</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEdit className="h-5 w-5" />
            Editar campanha
          </DialogTitle>
          <DialogDescription>
            Edite os dados da campanha. Apenas rascunhos e campanhas com falha podem ser editados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-tipo">Tipo de campanha</Label>
            <Select value={form.tipo} onValueChange={(v) => handleChange('tipo', v)}>
              <SelectTrigger id="edit-tipo">
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
            <Label htmlFor="edit-titulo">Título</Label>
            <Input
              id="edit-titulo"
              value={form.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-mensagem">Mensagem</Label>
            <Textarea
              id="edit-mensagem"
              value={form.mensagem}
              onChange={(e) => handleChange('mensagem', e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-publico">Público-alvo</Label>
            <Select value={form.publico} onValueChange={(v) => handleChange('publico', v)}>
              <SelectTrigger id="edit-publico">
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
            onClick={() => update({ id: campaign.id, data: form })}
            disabled={isPending || !form.titulo.trim() || !form.mensagem.trim()}
          >
            {isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
