import type { Campaign, CampaignSend, PublicoCampanha, StatusCampanha, TipoCampanha } from '@/generated/prisma/client'

export type { Campaign, CampaignSend, PublicoCampanha, StatusCampanha, TipoCampanha }

export type CampaignListItem = Pick<
  Campaign,
  | 'id'
  | 'titulo'
  | 'mensagem'
  | 'tipo'
  | 'status'
  | 'publico'
  | 'totalEnvios'
  | 'totalFalhas'
  | 'enviadaEm'
  | 'createdAt'
>

export interface CampaignFormData {
  titulo: string
  mensagem: string
  tipo: TipoCampanha
  publico: PublicoCampanha
}

export interface CampaignStats {
  total: number
  enviadas: number
  rascunhos: number
  totalEnvios: number
}
