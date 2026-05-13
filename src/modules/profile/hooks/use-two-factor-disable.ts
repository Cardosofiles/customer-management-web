import { useState } from 'react'
import { toast } from 'sonner'

import { twoFactor } from '@/lib/auth-client'

export type DisableStep = 'idle' | 'enter-password'

/**
 * Gerencia o fluxo de desativação do 2FA com confirmação por senha.
 */
export function useTwoFactorDisable(onDisabled: () => void) {
  const [step, setStep] = useState<DisableStep>('idle')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)

  async function disable() {
    setIsPending(true)
    const { error } = await twoFactor.disable({ password })
    setIsPending(false)
    if (error) {
      toast.error(error.message ?? 'Erro ao desativar 2FA')
      return
    }
    onDisabled()
    setStep('idle')
    setPassword('')
    toast.success('Autenticação 2FA desativada')
  }

  return { step, setStep, password, setPassword, isPending, disable }
}
