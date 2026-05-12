'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useCallback, useState, type JSX } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { SignUpFormData } from '@/types/auth.type'

interface ConfirmPasswordFieldProps {
  control: Control<SignUpFormData>
  disabled?: boolean
}

const ConfirmPasswordField = ({ control, disabled }: ConfirmPasswordFieldProps): JSX.Element => {
  const [visible, setVisible] = useState(false)
  const toggle = useCallback(() => setVisible((v) => !v), [])

  return (
    <Controller
      name="confirmPassword"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="confirmPassword">Confirmar Senha</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id="confirmPassword"
              type={visible ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.error ? 'confirm-password-error' : undefined}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:ring-1"
              onClick={toggle}
              aria-label={visible ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
              aria-pressed={visible}
              aria-controls="confirmPassword"
            >
              {visible ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>
          <FieldError id="confirm-password-error">{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  )
}

export { ConfirmPasswordField }
