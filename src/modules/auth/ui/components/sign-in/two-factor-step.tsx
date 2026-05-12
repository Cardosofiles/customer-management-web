'use client'

import { ShieldCheck } from 'lucide-react'
import { useCallback, useState, type JSX } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { twoFactor } from '@/lib/auth-client'

type Mode = 'totp' | 'backup'

const CONTENT: Record<
  Mode,
  {
    label: string
    placeholder: string
    maxLength?: number
    inputMode: React.HTMLAttributes<HTMLInputElement>['inputMode']
  }
> = {
  totp: { label: 'Código TOTP', placeholder: '000000', maxLength: 6, inputMode: 'numeric' },
  backup: {
    label: 'Código de backup',
    placeholder: 'xxxxxxxx',
    maxLength: undefined,
    inputMode: 'text',
  },
}

interface TwoFactorStepProps {
  onSuccess: () => void
}

const TwoFactorStep = ({ onSuccess }: TwoFactorStepProps): JSX.Element => {
  const [mode, setMode] = useState<Mode>('totp')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const switchMode = useCallback(() => {
    setMode((m) => (m === 'totp' ? 'backup' : 'totp'))
    setCode('')
    setError(null)
  }, [])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)
    setPending(true)

    try {
      const { error: authError } =
        mode === 'totp'
          ? await twoFactor.verifyTotp({ code })
          : await twoFactor.verifyBackupCode({ code })

      if (authError) {
        setError(authError.message ?? 'Código inválido. Tente novamente.')
        return
      }

      onSuccess()
    } catch {
      setError('Erro inesperado. Tente novamente mais tarde.')
    } finally {
      setPending(false)
    }
  }

  const { label, placeholder, maxLength, inputMode } = CONTENT[mode]
  const isDisabled = pending || code.trim().length === 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
        <div className="space-y-0.5">
          <h2 className="text-lg font-semibold">Verificação em dois fatores</h2>
          <p className="text-sm text-muted-foreground">
            {mode === 'totp'
              ? 'Digite o código de 6 dígitos do seu autenticador.'
              : 'Digite um dos seus códigos de backup.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="2fa-code">{label}</Label>
          <Input
            id="2fa-code"
            type="text"
            inputMode={inputMode}
            maxLength={maxLength}
            placeholder={placeholder}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={pending}
            autoFocus
            autoComplete="one-time-code"
            aria-describedby={error ? '2fa-error' : undefined}
            aria-invalid={!!error}
          />
        </div>

        {error && (
          <p id="2fa-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isDisabled} aria-busy={pending}>
          {pending ? 'Verificando...' : 'Verificar'}
        </Button>
      </form>

      <button
        type="button"
        className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        onClick={switchMode}
      >
        {mode === 'totp' ? 'Usar código de backup' : 'Usar código do autenticador'}
      </button>
    </div>
  )
}

export { TwoFactorStep }
