import { useState } from 'react'
import { toast } from 'sonner'

import { twoFactor } from '@/lib/auth-client'

export type EnableStep = 'idle' | 'enter-password' | 'scan-qr' | 'backup-codes'

/**
 * Gerencia o fluxo multi-step de ativação do 2FA.
 */
export function useTwoFactorEnable(onEnabled: () => void) {
  const [step, setStep] = useState<EnableStep>('idle')
  const [password, setPassword] = useState('')
  const [totpUri, setTotpUri] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isPending, setIsPending] = useState(false)

  async function getQrCode() {
    setIsPending(true)
    const { data, error } = await twoFactor.getTotpUri({ password })
    setIsPending(false)
    if (error || !data) {
      toast.error(error?.message ?? 'Erro ao gerar QR Code')
      return
    }
    setTotpUri(data.totpURI)
    setStep('scan-qr')
  }

  async function enable() {
    setIsPending(true)
    const { data, error } = await twoFactor.enable({ password })
    setIsPending(false)
    if (error || !data) {
      toast.error(error?.message ?? 'Erro ao ativar 2FA')
      return
    }
    setBackupCodes(data.backupCodes ?? [])
    setStep('backup-codes')
    onEnabled()
    toast.success('Autenticação 2FA ativada!')
  }

  function reset() {
    setStep('idle')
    setPassword('')
    setTotpUri('')
    setBackupCodes([])
  }

  return {
    step,
    setStep,
    password,
    setPassword,
    totpUri,
    backupCodes,
    isPending,
    getQrCode,
    enable,
    reset,
  }
}
