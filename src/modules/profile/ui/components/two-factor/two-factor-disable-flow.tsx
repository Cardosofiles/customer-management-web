'use client'

import { Loader2, ShieldOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useTwoFactorDisable } from '@/modules/profile/hooks/use-two-factor-disable'

interface TwoFactorDisableFlowProps {
  onDisabled: () => void
}

/**
 * Fluxo de desativação do 2FA com confirmação por senha.
 */
export function TwoFactorDisableFlow({ onDisabled }: TwoFactorDisableFlowProps) {
  const { step, setStep, password, setPassword, isPending, disable } =
    useTwoFactorDisable(onDisabled)

  if (step === 'idle') {
    return (
      <Button variant="destructive" onClick={() => setStep('enter-password')}>
        <ShieldOff className="mr-2 size-4" aria-hidden />
        Desativar 2FA
      </Button>
    )
  }

  return (
    <div className="max-w-sm space-y-4">
      <Field>
        <FieldLabel>Confirme sua senha</FieldLabel>
        <Input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && password && disable()}
        />
      </Field>
      <div className="flex gap-2">
        <Button variant="destructive" onClick={disable} disabled={isPending || !password}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
          Confirmar desativação
        </Button>
        <Button variant="outline" onClick={() => setStep('idle')} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
