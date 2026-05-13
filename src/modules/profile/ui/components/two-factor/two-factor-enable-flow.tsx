'use client'

import { Loader2, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { useTwoFactorEnable } from '@/modules/profile/hooks/use-two-factor-enable'
import { QR_CODE_URL } from '@/modules/profile/ui/components/two-factor/constants'
import { BackupCodesDisplay } from './backup-codes-display'

interface TwoFactorEnableFlowProps {
  onEnabled: () => void
}

/**
 * Fluxo multi-step para ativação do 2FA:
 * idle → enter-password → scan-qr → backup-codes
 */
export function TwoFactorEnableFlow({ onEnabled }: TwoFactorEnableFlowProps) {
  const {
    step,
    setStep,
    password,
    setPassword,
    totpUri,
    backupCodes,
    isPending,
    getQrCode,
    enable,
  } = useTwoFactorEnable(onEnabled)

  if (step === 'idle') {
    return (
      <Button onClick={() => setStep('enter-password')}>
        <Shield className="mr-2 size-4" aria-hidden />
        Ativar 2FA
      </Button>
    )
  }

  if (step === 'enter-password') {
    return (
      <div className="max-w-sm space-y-4">
        <p className="text-sm text-muted-foreground">Confirme sua senha para continuar.</p>
        <Field>
          <FieldLabel>Senha</FieldLabel>
          <Input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && password && getQrCode()}
          />
        </Field>
        <div className="flex gap-2">
          <Button onClick={getQrCode} disabled={isPending || !password}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            Continuar
          </Button>
          <Button variant="outline" onClick={() => setStep('idle')}>
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'scan-qr') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Escaneie o QR Code com seu app autenticador (Google Authenticator, Authy, etc.).
        </p>
        {totpUri && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={QR_CODE_URL(totpUri)}
            alt="QR Code para ativação do 2FA"
            width={200}
            height={200}
            className="rounded-md border"
          />
        )}
        <p className="text-sm text-muted-foreground">
          Após escanear, clique em &quot;Ativar&quot; para concluir.
        </p>
        <div className="flex gap-2">
          <Button onClick={enable} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            Ativar
          </Button>
          <Button variant="outline" onClick={() => setStep('enter-password')}>
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'backup-codes') {
    return (
      <BackupCodesDisplay
        codes={backupCodes}
        title="Códigos de backup gerados"
        description="Guarde estes códigos em local seguro. Eles permitem acesso caso perca seu autenticador."
      />
    )
  }
}
