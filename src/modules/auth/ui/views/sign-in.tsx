'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState, type JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'
import { signInFormSchema } from '@/schemas/auth.schema'
import type { SignInFormData } from '@/types/auth.type'

import { AuthShell } from '../components/shared/auth-shell'
import { EmailField } from '../components/sign-in/email-field'
import { PasswordField } from '../components/sign-in/password-field'
import { SocialButtons } from '../components/sign-in/social-buttons'
import { TwoFactorStep } from '../components/sign-in/two-factor-step'

const OrDivider = (): JSX.Element => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">ou continue com</span>
    </div>
  </div>
)

const SignIn = (): JSX.Element => {
  const router = useRouter()
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSuccess = useCallback((): void => {
    router.push('/dashboard')
    router.refresh()
  }, [router])

  const onSubmit = async ({ email, password }: SignInFormData): Promise<void> => {
    try {
      const { data: result, error } = await signIn.email({ email, password })

      if (error) {
        setError('root', { message: error.message ?? 'Erro ao fazer login. Tente novamente.' })
        return
      }

      if (result && 'twoFactorRedirect' in result && result.twoFactorRedirect) {
        setShowTwoFactor(true)
        return
      }

      onSuccess()
    } catch {
      setError('root', { message: 'Erro inesperado. Tente novamente mais tarde.' })
    }
  }

  if (showTwoFactor) {
    return (
      <AuthShell>
        <TwoFactorStep onSuccess={onSuccess} />
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
        <p className="text-sm text-muted-foreground">
          Digite seu email e senha para acessar sua conta
        </p>
      </div>

      <SocialButtons onError={(msg) => setError('root', { message: msg })} />

      <OrDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <EmailField control={control} disabled={isSubmitting} />
        <PasswordField control={control} disabled={isSubmitting} />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>

        {errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{' '}
        <Link
          href="/sign-up"
          className="font-medium underline-offset-4 hover:text-primary hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </AuthShell>
  )
}

export { SignIn }
