'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useCallback, useState, type JSX } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { SignInFormData } from '@/types/auth.type'

interface PasswordFieldProps {
  control: Control<SignInFormData>
  disabled?: boolean
}

const PasswordField = ({ control, disabled }: PasswordFieldProps): JSX.Element => {
  const [visible, setVisible] = useState(false)

  const toggle = useCallback(() => setVisible((v) => !v), [])

  return (
    <Controller
      name="password"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
          </div>
          <div className="relative">
            <Input
              {...field}
              id="password"
              type={visible ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              aria-describedby={fieldState.error ? 'password-error' : undefined}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:ring-1"
              onClick={toggle}
              aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={visible}
              aria-controls="password"
            >
              {visible ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>
          <FieldError id="password-error">{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  )
}

export { PasswordField }
