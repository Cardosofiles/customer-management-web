import { env } from '@/utils/env'
import { Resend } from 'resend'

import type { User } from 'better-auth'

const mailer = new Resend(env.RESEND_API_KEY)

const APP_NAME = 'CRUD Next.js Web'
const FROM = env.RESEND_FROM

interface EmailPayload {
  to: string
  subject: string
  html: string
}

interface SendResult {
  success: boolean
  error?: string
}

const sendEmail = async (payload: EmailPayload): Promise<SendResult> => {
  try {
    const { error } = await mailer.emails.send({
      from: FROM,
      ...payload,
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao enviar email.'
    console.error(`[email] Falha ao enviar para ${payload.to}:`, message)
    return { success: false, error: message }
  }
}

const wrapLayout = (content: string): string => `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${APP_NAME}</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:8px;padding:40px;border:1px solid #e4e4e7;">
              <tr>
                <td>
                  <p style="margin:0 0 24px;font-size:18px;font-weight:600;color:#09090b;">
                    ${APP_NAME}
                  </p>
                  ${content}
                  <p style="margin:32px 0 0;font-size:12px;color:#a1a1aa;">
                    Se você não solicitou este email, pode ignorá-lo com segurança.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`

const ctaButton = (href: string, label: string): string => `
  <a href="${href}"
    style="display:inline-block;margin:24px 0;padding:12px 24px;
           background:#09090b;color:#ffffff;border-radius:6px;
           font-size:14px;font-weight:500;text-decoration:none;">
    ${label}
  </a>
`

const linkFallback = (url: string): string => `
  <p style="margin:16px 0 0;font-size:12px;color:#71717a;">
    Se o botão não funcionar, copie e cole este link no seu navegador:<br/>
    <a href="${url}" style="color:#3b82f6;word-break:break-all;">${url}</a>
  </p>
`

interface SendEmailVerificationParams {
  user: User
  url: string
}

export const sendEmailVerificationService = async ({
  user,
  url,
}: SendEmailVerificationParams): Promise<SendResult> => {
  const name = user.name ?? 'você'

  return sendEmail({
    to: user.email,
    subject: `Confirme seu email — ${APP_NAME}`,
    html: wrapLayout(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;">
        Confirme seu email
      </h1>
      <p style="margin:0 0 4px;font-size:14px;color:#3f3f46;">
        Olá, ${name}! Obrigado por se cadastrar.
      </p>
      <p style="margin:0;font-size:14px;color:#3f3f46;">
        Clique no botão abaixo para ativar sua conta. O link expira em <strong>24 horas</strong>.
      </p>
      ${ctaButton(url, 'Confirmar email')}
      ${linkFallback(url)}
    `),
  })
}

interface SendResetPasswordParams {
  user: User
  url: string
}

export const sendResetPasswordMailService = async ({
  user,
  url,
}: SendResetPasswordParams): Promise<SendResult> => {
  const name = user.name ?? 'você'

  return sendEmail({
    to: user.email,
    subject: `Redefinir sua senha — ${APP_NAME}`,
    html: wrapLayout(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;">
        Redefinir sua senha
      </h1>
      <p style="margin:0 0 4px;font-size:14px;color:#3f3f46;">
        Olá, ${name}! Recebemos uma solicitação para redefinir a senha da sua conta.
      </p>
      <p style="margin:0;font-size:14px;color:#3f3f46;">
        Clique no botão abaixo para criar uma nova senha. O link expira em <strong>1 hora</strong>.
      </p>
      ${ctaButton(url, 'Redefinir senha')}
      ${linkFallback(url)}
    `),
  })
}

interface SendTwoFactorOTPParams {
  user: User
  otp: string
}

export const sendTwoFactorOTP = async ({
  user,
  otp,
}: SendTwoFactorOTPParams): Promise<SendResult> => {
  const name = user.name ?? 'você'

  return sendEmail({
    to: user.email,
    subject: `Seu código de verificação — ${APP_NAME}`,
    html: wrapLayout(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;">
        Verificação em dois fatores
      </h1>
      <p style="margin:0 0 16px;font-size:14px;color:#3f3f46;">
        Olá, ${name}! Use o código abaixo para concluir o login.
        Ele expira em <strong>5 minutos</strong>.
      </p>
      <div style="display:inline-block;padding:16px 32px;background:#f4f4f5;
                  border-radius:8px;border:1px solid #e4e4e7;margin:8px 0;">
        <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#09090b;">
          ${otp}
        </span>
      </div>
      <p style="margin:16px 0 0;font-size:12px;color:#71717a;">
        Nunca compartilhe este código com ninguém.
        Nossa equipe jamais solicitará seu código de verificação.
      </p>
    `),
  })
}

interface SendTwoFactorEnabledParams {
  user: User
}

export const sendTwoFactorEnabled = async ({
  user,
}: SendTwoFactorEnabledParams): Promise<SendResult> => {
  const name = user.name ?? 'você'
  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date())

  return sendEmail({
    to: user.email,
    subject: `2FA ativado na sua conta — ${APP_NAME}`,
    html: wrapLayout(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;">
        Autenticação em dois fatores ativada
      </h1>
      <p style="margin:0 0 4px;font-size:14px;color:#3f3f46;">
        Olá, ${name}! A verificação em dois fatores foi ativada com sucesso na sua conta.
      </p>
      <p style="margin:0 0 16px;font-size:14px;color:#3f3f46;">
        <strong>Quando:</strong> ${date}
      </p>
      <p style="margin:0;font-size:14px;color:#71717a;">
        Se você não realizou esta ação, acesse sua conta imediatamente e entre em contato
        com o suporte.
      </p>
    `),
  })
}

// ── Marketing ─────────────────────────────────────────────────────────────────

type CampaignType = 'CAMPANHA' | 'EVENTO' | 'ACAO' | 'ANIVERSARIO'

const CAMPAIGN_TYPE_LABELS: Record<CampaignType, string> = {
  CAMPANHA: 'Campanha',
  EVENTO: 'Evento',
  ACAO: 'Promoção',
  ANIVERSARIO: 'Aniversário',
}

const CAMPAIGN_TYPE_COLORS: Record<CampaignType, string> = {
  CAMPANHA: '#6366f1',
  EVENTO: '#0ea5e9',
  ACAO: '#f59e0b',
  ANIVERSARIO: '#ec4899',
}

interface SendMarketingCampaignParams {
  to: string
  recipientName: string
  titulo: string
  mensagem: string
  tipo: CampaignType
}

export const sendMarketingCampaign = async ({
  to,
  recipientName,
  titulo,
  mensagem,
  tipo,
}: SendMarketingCampaignParams): Promise<SendResult> => {
  const label = CAMPAIGN_TYPE_LABELS[tipo]
  const color = CAMPAIGN_TYPE_COLORS[tipo]
  const isAniversario = tipo === 'ANIVERSARIO'

  const paragraphs = mensagem
    .split('\n')
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 12px;font-size:14px;color:#3f3f46;">${p}</p>`)
    .join('')

  const birthdayBanner = isAniversario
    ? `<div style="text-align:center;padding:24px 0 8px;">
        <span style="font-size:48px;">🎂</span>
        <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#09090b;">
          Feliz Aniversário, ${recipientName}!
        </p>
      </div>`
    : ''

  return sendEmail({
    to,
    subject: isAniversario ? `🎂 Feliz Aniversário — ${APP_NAME}` : `${titulo} — ${APP_NAME}`,
    html: wrapLayout(`
      <div style="margin-bottom:16px;">
        <span style="display:inline-block;padding:4px 10px;border-radius:9999px;
                     background:${color}1a;color:${color};font-size:11px;font-weight:600;
                     text-transform:uppercase;letter-spacing:0.05em;">
          ${label}
        </span>
      </div>
      ${birthdayBanner}
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#09090b;">
        ${titulo}
      </h1>
      <p style="margin:0 0 16px;font-size:14px;color:#71717a;">
        Olá, ${recipientName}!
      </p>
      ${paragraphs}
      <hr style="margin:24px 0;border:none;border-top:1px solid #e4e4e7;" />
      <p style="margin:0;font-size:12px;color:#a1a1aa;">
        Você está recebendo este email porque é nosso cliente. Para cancelar o recebimento
        de comunicações, entre em contato conosco.
      </p>
    `),
  })
}

interface SendLoginAlertParams {
  user: User
  device?: string
  location?: string
}

export const sendLoginAlert = async ({
  user,
  device = 'dispositivo desconhecido',
  location = 'localização desconhecida',
}: SendLoginAlertParams): Promise<SendResult> => {
  const name = user.name ?? 'você'
  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date())

  return sendEmail({
    to: user.email,
    subject: `Novo acesso detectado — ${APP_NAME}`,
    html: wrapLayout(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#09090b;">
        Novo acesso à sua conta
      </h1>
      <p style="margin:0 0 16px;font-size:14px;color:#3f3f46;">
        Olá, ${name}! Detectamos um novo login na sua conta com os seguintes detalhes:
      </p>
      <table cellpadding="0" cellspacing="0"
        style="width:100%;border:1px solid #e4e4e7;border-radius:6px;overflow:hidden;">
        <tr style="background:#f4f4f5;">
          <td style="padding:10px 16px;font-size:13px;color:#71717a;width:40%;">Quando</td>
          <td style="padding:10px 16px;font-size:13px;color:#09090b;">${date}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px;font-size:13px;color:#71717a;">Dispositivo</td>
          <td style="padding:10px 16px;font-size:13px;color:#09090b;">${device}</td>
        </tr>
        <tr style="background:#f4f4f5;">
          <td style="padding:10px 16px;font-size:13px;color:#71717a;">Localização</td>
          <td style="padding:10px 16px;font-size:13px;color:#09090b;">${location}</td>
        </tr>
      </table>
      <p style="margin:16px 0 0;font-size:14px;color:#71717a;">
        Se não foi você, redefina sua senha imediatamente e ative a verificação em dois fatores.
      </p>
    `),
  })
}
