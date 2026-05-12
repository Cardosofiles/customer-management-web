'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck } from 'lucide-react'
import Link from 'next/link'
import { useState, type JSX } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { forgotPasswordSchema } from '@/schemas/auth.schema'
import type { ForgotPasswordFormData } from '@/types/auth.type'

const ForgotPasswordSuccess = (): JSX.Element => (
  <div className="flex min-h-svh items-center justify-center">
    <div className="w-full max-w-sm space-y-4 p-6 text-center">
      <div className="flex justify-center">
        <MailCheck className="h-10 w-10 text-primary" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Email enviado</h1>
      <p className="text-sm text-muted-foreground">
        Se esse email estiver cadastrado, você receberá um link para redefinir sua senha em breve.
      </p>
      <Link
        href="/sign-in"
        className="inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
      >
        Voltar para o login
      </Link>
    </div>
  </div>
)

const ForgotPassword = (): JSX.Element => {
  const [submitted, setSubmitted] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async ({ email }: ForgotPasswordFormData): Promise<void> => {
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      })

      if (error) {
        setError('email', { message: 'Não foi possível enviar o email. Tente novamente.' })
        return
      }

      setSubmitted(true)
    } catch {
      setError('root', { message: 'Erro inesperado. Tente novamente mais tarde.' })
    }
  }

  if (submitted) return <ForgotPasswordSuccess />

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Esqueci minha senha</h1>
          <p className="text-sm text-muted-foreground">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  disabled={isSubmitting}
                  aria-describedby={fieldState.error ? 'email-error' : undefined}
                />
                <FieldError id="email-error">{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          {/* Erro global (ex: falha de rede) */}
          {/* form.formState.errors.root?.message */}

          <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Lembrou a senha?{' '}
          <Link
            href="/sign-in"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

export { ForgotPassword }
