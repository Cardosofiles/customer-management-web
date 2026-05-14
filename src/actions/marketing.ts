'use server'

import { sendMarketingCampaign } from '@/lib/email'
import { prisma as db } from '@/lib/prisma'
import type { CampaignFormData, CampaignListItem, CampaignStats } from '@/types/marketing.type'
import type { ActionResult } from '@/types/user.type'

export async function createCampaign(
  data: CampaignFormData
): Promise<ActionResult<CampaignListItem>> {
  if (!data.titulo.trim()) return { success: false, error: 'Título é obrigatório.' }
  if (!data.mensagem.trim()) return { success: false, error: 'Mensagem é obrigatória.' }

  try {
    const campaign = await db.campaign.create({
      data: {
        titulo: data.titulo.trim(),
        mensagem: data.mensagem.trim(),
        tipo: data.tipo,
        publico: data.publico,
        status: 'RASCUNHO',
      },
      select: {
        id: true,
        titulo: true,
        mensagem: true,
        tipo: true,
        status: true,
        publico: true,
        totalEnvios: true,
        totalFalhas: true,
        enviadaEm: true,
        createdAt: true,
      },
    })

    return { success: true, data: campaign, message: 'Campanha criada!' }
  } catch {
    return { success: false, error: 'Erro ao criar campanha.' }
  }
}

export async function updateCampaign(
  id: string,
  data: CampaignFormData
): Promise<ActionResult<CampaignListItem>> {
  if (!data.titulo.trim()) return { success: false, error: 'Título é obrigatório.' }
  if (!data.mensagem.trim()) return { success: false, error: 'Mensagem é obrigatória.' }

  try {
    const existing = await db.campaign.findUnique({ where: { id }, select: { status: true } })
    if (!existing) return { success: false, error: 'Campanha não encontrada.' }
    if (existing.status === 'ENVIADA' || existing.status === 'ENVIANDO') {
      return { success: false, error: 'Não é possível editar uma campanha já enviada.' }
    }

    const campaign = await db.campaign.update({
      where: { id },
      data: {
        titulo: data.titulo.trim(),
        mensagem: data.mensagem.trim(),
        tipo: data.tipo,
        publico: data.publico,
      },
      select: {
        id: true,
        titulo: true,
        mensagem: true,
        tipo: true,
        status: true,
        publico: true,
        totalEnvios: true,
        totalFalhas: true,
        enviadaEm: true,
        createdAt: true,
      },
    })

    return { success: true, data: campaign, message: 'Campanha atualizada!' }
  } catch {
    return { success: false, error: 'Erro ao atualizar campanha.' }
  }
}

export async function sendCampaign(id: string): Promise<ActionResult<void>> {
  const campaign = await db.campaign.findUnique({ where: { id } })
  if (!campaign) return { success: false, error: 'Campanha não encontrada.' }
  if (campaign.status === 'ENVIADA') return { success: false, error: 'Campanha já foi enviada.' }

  const where =
    campaign.publico === 'TODOS'
      ? { ativo: true, email: { not: null as unknown as string } }
      : {
          ativo: true,
          tipo: campaign.publico as 'PESSOA_FISICA' | 'PESSOA_JURIDICA',
          email: { not: null as unknown as string },
        }

  const clientes = await db.cliente.findMany({
    where,
    select: {
      id: true,
      email: true,
      nomeCompleto: true,
      razaoSocial: true,
      nomeFantasia: true,
      dataNascimento: true,
      tipo: true,
    },
  })

  if (clientes.length === 0) {
    return { success: false, error: 'Nenhum cliente encontrado para o público selecionado.' }
  }

  await db.campaign.update({ where: { id }, data: { status: 'ENVIANDO' } })

  let successCount = 0
  let failCount = 0
  const sends = []

  for (const cliente of clientes) {
    const recipientName =
      cliente.nomeCompleto ?? cliente.nomeFantasia ?? cliente.razaoSocial ?? 'Cliente'

    const result = await sendMarketingCampaign({
      to: cliente.email!,
      recipientName,
      titulo: campaign.titulo,
      mensagem: campaign.mensagem,
      tipo: campaign.tipo as 'CAMPANHA' | 'EVENTO' | 'ACAO' | 'ANIVERSARIO',
    })

    if (result.success) {
      successCount++
      sends.push({
        campaignId: id,
        clienteId: cliente.id,
        email: cliente.email!,
        status: 'sent',
      })
    } else {
      failCount++
      sends.push({
        campaignId: id,
        clienteId: cliente.id,
        email: cliente.email!,
        status: 'failed',
        error: result.error,
      })
    }
  }

  await db.$transaction([
    db.campaignSend.createMany({ data: sends }),
    db.campaign.update({
      where: { id },
      data: {
        status: failCount === clientes.length ? 'FALHA' : 'ENVIADA',
        totalEnvios: successCount,
        totalFalhas: failCount,
        enviadaEm: new Date(),
      },
    }),
  ])

  return {
    success: true,
    data: undefined,
    message: `Campanha enviada para ${successCount} cliente(s).${failCount > 0 ? ` ${failCount} falha(s).` : ''}`,
  }
}

export async function deleteCampaign(id: string): Promise<ActionResult<void>> {
  try {
    await db.campaign.delete({ where: { id } })
    return { success: true, data: undefined, message: 'Campanha excluída.' }
  } catch {
    return { success: false, error: 'Erro ao excluir campanha.' }
  }
}

export async function getCampaigns(): Promise<ActionResult<CampaignListItem[]>> {
  try {
    const campaigns = await db.campaign.findMany({
      select: {
        id: true,
        titulo: true,
        mensagem: true,
        tipo: true,
        status: true,
        publico: true,
        totalEnvios: true,
        totalFalhas: true,
        enviadaEm: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: campaigns }
  } catch {
    return { success: false, error: 'Erro ao buscar campanhas.' }
  }
}

export async function getCampaignStats(): Promise<ActionResult<CampaignStats>> {
  try {
    const [total, enviadas, rascunhos, aggregate] = await Promise.all([
      db.campaign.count(),
      db.campaign.count({ where: { status: 'ENVIADA' } }),
      db.campaign.count({ where: { status: 'RASCUNHO' } }),
      db.campaign.aggregate({ _sum: { totalEnvios: true } }),
    ])

    return {
      success: true,
      data: {
        total,
        enviadas,
        rascunhos,
        totalEnvios: aggregate._sum.totalEnvios ?? 0,
      },
    }
  } catch {
    return { success: false, error: 'Erro ao buscar estatísticas.' }
  }
}

export async function getRecipientsCount(
  publico: 'TODOS' | 'PESSOA_FISICA' | 'PESSOA_JURIDICA'
): Promise<number> {
  const where =
    publico === 'TODOS'
      ? { ativo: true, email: { not: null as unknown as string } }
      : {
          ativo: true,
          tipo: publico as 'PESSOA_FISICA' | 'PESSOA_JURIDICA',
          email: { not: null as unknown as string },
        }

  try {
    return await db.cliente.count({ where })
  } catch {
    return 0
  }
}

// ── Aniversariantes ───────────────────────────────────────────────────────────

export interface BirthdayClient {
  id: string
  nomeCompleto: string | null
  razaoSocial: string | null
  nomeFantasia: string | null
  email: string
  tipo: string
}

export async function getBirthdayClientsToday(): Promise<ActionResult<BirthdayClient[]>> {
  try {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1

    const clients = await db.$queryRaw<BirthdayClient[]>`
      SELECT id, "nomeCompleto", "razaoSocial", "nomeFantasia", email, tipo
      FROM clientes
      WHERE ativo = true
        AND email IS NOT NULL
        AND "dataNascimento" IS NOT NULL
        AND EXTRACT(DAY  FROM "dataNascimento") = ${day}
        AND EXTRACT(MONTH FROM "dataNascimento") = ${month}
      ORDER BY COALESCE("nomeCompleto", "razaoSocial") ASC
    `
    return { success: true, data: clients }
  } catch {
    return { success: false, error: 'Erro ao buscar aniversariantes.' }
  }
}

export async function sendBirthdayMessages(
  titulo: string,
  mensagem: string
): Promise<ActionResult<void>> {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1

  const clients = await db.$queryRaw<BirthdayClient[]>`
    SELECT id, "nomeCompleto", "razaoSocial", "nomeFantasia", email, tipo
    FROM clientes
    WHERE ativo = true
      AND email IS NOT NULL
      AND "dataNascimento" IS NOT NULL
      AND EXTRACT(DAY  FROM "dataNascimento") = ${day}
      AND EXTRACT(MONTH FROM "dataNascimento") = ${month}
  `

  if (clients.length === 0) {
    return { success: false, error: 'Nenhum aniversariante encontrado hoje.' }
  }

  const campaign = await db.campaign.create({
    data: { titulo, mensagem, tipo: 'ANIVERSARIO', publico: 'TODOS', status: 'ENVIANDO' },
  })

  let successCount = 0
  let failCount = 0
  const sends: { campaignId: string; clienteId: string; email: string; status: string; error?: string }[] = []

  for (const cliente of clients) {
    const recipientName =
      cliente.nomeCompleto ?? cliente.nomeFantasia ?? cliente.razaoSocial ?? 'Cliente'

    const result = await sendMarketingCampaign({
      to: cliente.email,
      recipientName,
      titulo,
      mensagem,
      tipo: 'ANIVERSARIO',
    })

    if (result.success) {
      successCount++
      sends.push({ campaignId: campaign.id, clienteId: cliente.id, email: cliente.email, status: 'sent' })
    } else {
      failCount++
      sends.push({ campaignId: campaign.id, clienteId: cliente.id, email: cliente.email, status: 'failed', error: result.error })
    }
  }

  await db.$transaction([
    db.campaignSend.createMany({ data: sends }),
    db.campaign.update({
      where: { id: campaign.id },
      data: {
        status: failCount === clients.length ? 'FALHA' : 'ENVIADA',
        totalEnvios: successCount,
        totalFalhas: failCount,
        enviadaEm: new Date(),
      },
    }),
  ])

  return {
    success: true,
    data: undefined,
    message: `Parabéns enviados para ${successCount} aniversariante(s)!`,
  }
}
