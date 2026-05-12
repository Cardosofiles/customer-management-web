'use client'

import { CheckCircle2, MailX } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition, type JSX } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { validateEmail } from '@/utils/formater'
import { AuthShell } from '../components/shared/auth-shell'

type Status = 'loading' | 'success' | 'error'

const VerifyEmailLoading = (): JSX.Element => (
  <div className="flex min-h-svh items-center justify-center">
    <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
      Verificando email...
    </p>
  </div>
)

const VerifyEmailSuccess = (): JSX.Element => (
  <AuthShell>
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Email confirmado!</h1>
      <p className="text-sm text-muted-foreground">
        Sua conta foi ativada. Você já pode fazer login.
      </p>
      <Button asChild className="w-full">
        <Link href="/sign-in">Ir para o login</Link>
      </Button>
    </div>
  </AuthShell>
)

const ResendForm = (): JSX.Element => {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const emailRef = useRef<HTMLInputElement>(null)

  const handleResend = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const email = emailRef.current?.value.trim() ?? ''

    if (!validateEmail(email)) {
      setError('Digite um email válido.')
      return
    }

    setError(null)

    startTransition(async () => {
      try {
        const { error: apiError } = await authClient.sendVerificationEmail({
          email,
          callbackURL: '/verify-email',
        })

        if (apiError) {
          setError(apiError.message ?? 'Erro ao reenviar. Tente novamente.')
          return
        }

        setSent(true)
      } catch {
        setError('Erro inesperado. Tente novamente mais tarde.')
      }
    })
  }

  if (sent) {
    return (
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        Email de verificação reenviado. Verifique sua caixa de entrada.
      </p>
    )
  }

  return (
    <form onSubmit={handleResend} className="space-y-4 text-left" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="resend-email">Email</Label>
        <Input
          ref={emailRef}
          id="resend-email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="seu@email.com"
          disabled={isPending}
          aria-describedby={error ? 'resend-error' : undefined}
          aria-invalid={!!error}
          defaultValue="" // uncontrolled — sem re-render por keystroke
        />
        {error && (
          <p id="resend-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
        {isPending ? 'Enviando...' : 'Reenviar email de verificação'}
      </Button>
    </form>
  )
}

// ── VerifyEmail ───────────────────────────────────────────────────────────────
const VerifyEmail = (): JSX.Element => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error')

  // useRef previne double-invoke no Strict Mode (React 18/19 monta effects 2x em dev)
  const calledRef = useRef(false)

  useEffect(() => {
    if (!token || calledRef.current) return
    calledRef.current = true

    authClient
      .verifyEmail({ query: { token } })
      .then(({ error }) => setStatus(error ? 'error' : 'success'))
      .catch(() => setStatus('error')) // ✅ falha de rede também vira 'error'
  }, [token])

  if (status === 'loading') return <VerifyEmailLoading />
  if (status === 'success') return <VerifyEmailSuccess />

  return (
    <AuthShell>
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <MailX className="h-10 w-10 text-destructive" aria-hidden />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Link inválido ou expirado</h1>
          <p className="text-sm text-muted-foreground">
            O link de verificação não é mais válido. Informe seu email para receber um novo.
          </p>
        </div>

        <ResendForm />

        <Link
          href="/sign-in"
          className="inline-block text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    </AuthShell>
  )
}

export { VerifyEmail }
