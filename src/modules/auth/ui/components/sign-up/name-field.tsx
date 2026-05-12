'use client'

import { type JSX } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { SignUpFormData } from '@/types/auth.type'

interface NameFieldProps {
  control: Control<SignUpFormData>
  disabled?: boolean
}

const NameField = ({ control, disabled }: NameFieldProps): JSX.Element => (
  <Controller
    name="name"
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor="name">Nome</FieldLabel>
        <Input
          {...field}
          id="name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          placeholder="Digite seu nome completo"
          disabled={disabled}
          aria-invalid={fieldState.invalid}
          aria-describedby={fieldState.error ? 'name-error' : undefined}
        />
        <FieldError id="name-error">{fieldState.error?.message}</FieldError>
      </Field>
    )}
  />
)

export { NameField }
