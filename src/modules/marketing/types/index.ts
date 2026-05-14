export type { Campaign, CampaignFormData, CampaignListItem, CampaignStats, PublicoCampanha, StatusCampanha, TipoCampanha } from '@/types/marketing.type'

export const TIPO_LABELS: Record<string, string> = {
  CAMPANHA: 'Campanha',
  EVENTO: 'Evento',
  ACAO: 'Promoção',
  ANIVERSARIO: 'Aniversário',
}

export const PUBLICO_LABELS: Record<string, string> = {
  TODOS: 'Todos os clientes',
  PESSOA_FISICA: 'Pessoa Física',
  PESSOA_JURIDICA: 'Pessoa Jurídica',
}

export const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  ENVIANDO: 'Enviando...',
  ENVIADA: 'Enviada',
  FALHA: 'Falha',
}
