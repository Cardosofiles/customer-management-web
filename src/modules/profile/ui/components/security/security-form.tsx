'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useChangePassword } from '@/modules/profile/hooks/use-change-password'
import { usePasswordVisibility } from '@/modules/profile/hooks/use-password-visibility'

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z.string().min(8, 'Nova senha deve ter ao menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  })

type SecurityFormData = z.infer<typeof securitySchema>

const defaultValues: SecurityFormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

/**
 * Formulário de alteração de senha com revogação de outras sessões ativas.
 */
export function SecurityForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues,
  })

  const { mutate: changePassword, isPending } = useChangePassword(reset)

  const current = usePasswordVisibility()
  const newPass = usePasswordVisibility()
  const confirm = usePasswordVisibility()

  const pending = isSubmitting || isPending

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>Altere sua senha de acesso</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(({ currentPassword, newPassword }) =>
            changePassword({ currentPassword, newPassword })
          )}
          className="max-w-sm space-y-4"
        >
          <Field data-invalid={!!errors.currentPassword}>
            <FieldLabel>Senha atual</FieldLabel>
            <div className="relative">
              <Input type={current.inputType} className="pr-10" {...register('currentPassword')} />
              <ToggleVisibilityButton {...current} />
            </div>
            <FieldError errors={[errors.currentPassword]} />
          </Field>

          <Field data-invalid={!!errors.newPassword}>
            <FieldLabel>Nova senha</FieldLabel>
            <div className="relative">
              <Input type={newPass.inputType} className="pr-10" {...register('newPassword')} />
              <ToggleVisibilityButton {...newPass} />
            </div>
            <FieldError errors={[errors.newPassword]} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel>Confirmar nova senha</FieldLabel>
            <div className="relative">
              <Input type={confirm.inputType} className="pr-10" {...register('confirmPassword')} />
              <ToggleVisibilityButton {...confirm} />
            </div>
            <FieldError errors={[errors.confirmPassword]} />
          </Field>

          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            Alterar senha
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// ─── sub-componente interno ───────────────────────────────────────────────────

interface ToggleVisibilityButtonProps {
  visible: boolean
  toggle: () => void
  ariaLabel: string
}

function ToggleVisibilityButton({ visible, toggle, ariaLabel }: ToggleVisibilityButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggle}
      aria-label={ariaLabel}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none"
      tabIndex={0}
    >
      {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
    </Button>
  )
}
