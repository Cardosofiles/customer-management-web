'use client'

import { type JSX } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { SignInFormData } from '@/types/auth.type'

interface EmailFieldProps {
  control: Control<SignInFormData>
  disabled?: boolean
}

const EmailField = ({ control, disabled }: EmailFieldProps): JSX.Element => (
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
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="seu@email.com"
          disabled={disabled}
          aria-invalid={fieldState.invalid}
          aria-describedby={fieldState.error ? 'email-error' : undefined}
        />
        <FieldError id="email-error">{fieldState.error?.message}</FieldError>
      </Field>
    )}
  />
)

export { EmailField }
