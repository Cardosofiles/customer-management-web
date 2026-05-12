'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, type JSX } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { resetPasswordSchema } from '@/schemas/auth.schema'
import { AuthShell } from '../components/shared/auth-shell'

import type { ResetPasswordFormData } from '@/types/auth.type'

// ── Token inválido — estado terminal, sem form ───────────────────────────────
const InvalidToken = (): JSX.Element => (
  <AuthShell>
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <ShieldAlert className="h-10 w-10 text-destructive" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Link inválido</h1>
      <p className="text-sm text-muted-foreground">
        Este link de recuperação é inválido ou já expirou.
      </p>
      <Link
        href="/forgot-password"
        className="inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
      >
        Solicitar novo link
      </Link>
    </div>
  </AuthShell>
)

// ── Campo de senha com toggle ─────────────────────────────────────────────────
interface PasswordInputFieldProps {
  id: string
  label: string
  fieldName: 'newPassword' | 'confirmPassword'
  errorId: string
  autoComplete: string
  control: ReturnType<typeof useForm<ResetPasswordFormData>>['control']
  disabled?: boolean
}

const PasswordInputField = ({
  id,
  label,
  fieldName,
  errorId,
  autoComplete,
  control,
  disabled,
}: PasswordInputFieldProps): JSX.Element => {
  const [visible, setVisible] = useState(false)
  const toggle = useCallback(() => setVisible((v) => !v), [])

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id={id}
              type={visible ? 'text' : 'password'}
              autoComplete={autoComplete}
              placeholder="••••••••"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.error ? errorId : undefined}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:ring-1"
              onClick={toggle}
              aria-label={
                visible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`
              }
              aria-pressed={visible}
              aria-controls={id}
            >
              {visible ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>
          <FieldError id={errorId}>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  )
}

// ── ResetPassword ─────────────────────────────────────────────────────────────
const ResetPassword = (): JSX.Element => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  if (!token) return <InvalidToken />

  const onSubmit = async ({ newPassword }: ResetPasswordFormData): Promise<void> => {
    try {
      const { error } = await authClient.resetPassword({ token, newPassword })

      if (error) {
        setError('root', {
          message: error.message ?? 'Erro ao redefinir senha. Tente novamente.',
        })
        return
      }

      toast.success('Senha redefinida com sucesso!')
      router.push('/sign-in')
    } catch {
      setError('root', { message: 'Erro inesperado. Tente novamente mais tarde.' })
    }
  }

  return (
    <AuthShell>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground">Digite e confirme sua nova senha.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordInputField
          id="new-password"
          label="Nova senha"
          fieldName="newPassword"
          errorId="new-password-error"
          autoComplete="new-password"
          control={control}
          disabled={isSubmitting}
        />

        <PasswordInputField
          id="confirm-password"
          label="Confirmar nova senha"
          fieldName="confirmPassword"
          errorId="confirm-password-error"
          autoComplete="new-password"
          control={control}
          disabled={isSubmitting}
        />

        {errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
        </Button>
      </form>
    </AuthShell>
  )
}

export { ResetPassword }
