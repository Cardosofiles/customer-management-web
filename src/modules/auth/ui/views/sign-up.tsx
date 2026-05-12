'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck } from 'lucide-react'
import Link from 'next/link'
import { useState, type JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { signUp } from '@/lib/auth-client'
import { signUpFormSchema } from '@/schemas/auth.schema'
import type { SignUpFormData } from '@/types/auth.type'

import { AuthShell } from '../components/shared/auth-shell'
import { ConfirmPasswordField } from '../components/sign-up/confirm-password-field'
import { EmailField } from '../components/sign-up/email-field'
import { NameField } from '../components/sign-up/name-field'
import { PasswordField } from '../components/sign-up/password-field'

const SignUpSuccess = (): JSX.Element => (
  <AuthShell>
    <div className="space-y-4 text-center">
      <div className="flex justify-center">
        <MailCheck className="h-10 w-10 text-primary" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Verifique seu email</h1>
      <p className="text-sm text-muted-foreground">
        Enviamos um link de confirmação. Verifique sua caixa de entrada para ativar a conta.
      </p>
      <Link
        href="/sign-in"
        className="inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
      >
        Voltar para o login
      </Link>
    </div>
  </AuthShell>
)

// ── SignUp ───────────────────────────────────────────────────────────────────
const SignUp = (): JSX.Element => {
  const [emailSent, setEmailSent] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async ({ name, email, password }: SignUpFormData): Promise<void> => {
    try {
      const { error } = await signUp.email({ name, email, password })

      if (error) {
        setError('root', { message: error.message ?? 'Erro ao criar conta. Tente novamente.' })
        return
      }

      setEmailSent(true)
    } catch {
      setError('root', { message: 'Erro inesperado. Tente novamente mais tarde.' })
    }
  }

  if (emailSent) return <SignUpSuccess />

  return (
    <AuthShell>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <NameField control={control} disabled={isSubmitting} />
        <EmailField control={control} disabled={isSubmitting} />
        <PasswordField control={control} disabled={isSubmitting} />
        <ConfirmPasswordField control={control} disabled={isSubmitting} />

        {errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <Link
          href="/sign-in"
          className="font-medium underline-offset-4 hover:text-primary hover:underline"
        >
          Entrar
        </Link>
      </p>
    </AuthShell>
  )
}

export { SignUp }
