'use client'

import type { JSX } from 'react'
import {
  IconCalendar,
  IconChartBar,
  IconLoader2,
  IconMailFast,
  IconSend,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react'

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDeleteCampaign, useSendCampaign } from '../../hooks/use-campaign-mutations'
import type { CampaignListItem } from '../../types'
import { PUBLICO_LABELS, STATUS_LABELS, TIPO_LABELS } from '../../types'
import { EditCampaignDialog } from './edit-campaign-dialog'

interface CampaignTableProps {
  campaigns: CampaignListItem[]
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  RASCUNHO: 'outline',
  ENVIANDO: 'secondary',
  ENVIADA: 'default',
  FALHA: 'destructive',
}

const TIPO_COLORS: Record<string, string> = {
  CAMPANHA: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  EVENTO: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  ACAO: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  ANIVERSARIO: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
}

function CampaignRow({ campaign }: { campaign: CampaignListItem }): JSX.Element {
  const { mutate: send, isPending: isSending } = useSendCampaign()
  const { mutate: del, isPending: isDeleting } = useDeleteCampaign()

  const isSent = campaign.status === 'ENVIADA'
  const isSendingStatus = campaign.status === 'ENVIANDO'
  const canSend = campaign.status === 'RASCUNHO' || campaign.status === 'FALHA'
  const busy = isSending || isDeleting

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{campaign.titulo}</span>
          <span className="text-muted-foreground text-xs">
            {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TIPO_COLORS[campaign.tipo]}`}
        >
          {TIPO_LABELS[campaign.tipo]}
        </span>
      </TableCell>

      <TableCell>
        <Badge variant={STATUS_VARIANT[campaign.status]}>
          {isSendingStatus && <IconLoader2 className="mr-1 h-3 w-3 animate-spin" />}
          {STATUS_LABELS[campaign.status]}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <IconUsers className="h-3.5 w-3.5" />
          {PUBLICO_LABELS[campaign.publico]}
        </div>
      </TableCell>

      <TableCell>
        {isSent ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-emerald-600">
              <IconMailFast className="h-3.5 w-3.5" />
              {campaign.totalEnvios}
            </span>
            {campaign.totalFalhas > 0 && (
              <span className="text-destructive flex items-center gap-1">
                <IconChartBar className="h-3.5 w-3.5" />
                {campaign.totalFalhas} falha(s)
              </span>
            )}
            {campaign.enviadaEm && (
              <span className="text-muted-foreground flex items-center gap-1">
                <IconCalendar className="h-3.5 w-3.5" />
                {new Date(campaign.enviadaEm).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <TooltipProvider>
            {canSend && (
              <EditCampaignDialog campaign={campaign} initialMensagem={campaign.mensagem} />
            )}
            {canSend && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => send(campaign.id)}
                    disabled={busy}
                  >
                    {isSending ? (
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <IconSend className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Enviar campanha</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => del(campaign.id)}
                  disabled={busy || isSendingStatus}
                  className="text-destructive hover:text-destructive"
                >
                  {isDeleting ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <IconTrash className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir campanha</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function CampaignTable({ campaigns }: CampaignTableProps): JSX.Element {
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <IconMailFast className="text-muted-foreground mb-3 h-10 w-10" />
        <p className="text-muted-foreground text-sm">Nenhuma campanha criada ainda.</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Crie sua primeira campanha para enviar e-mails aos seus clientes.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campanha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Público</TableHead>
          <TableHead>Resultados</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => (
          <CampaignRow key={c.id} campaign={c} />
        ))}
      </TableBody>
    </Table>
  )
}
