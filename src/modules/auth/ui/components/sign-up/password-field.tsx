'use client'

import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import { Eye, EyeOff } from 'lucide-react'
import { useCallback, useDeferredValue, useEffect, useMemo, useState, type JSX } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { SignUpFormData } from '@/types/auth.type'

const STRENGTH_CONFIG = [
  { color: 'bg-red-500', label: 'Muito fraca' },
  { color: 'bg-red-500', label: 'Muito fraca' },
  { color: 'bg-yellow-500', label: 'Fraca' },
  { color: 'bg-blue-500', label: 'Forte' },
  { color: 'bg-green-500', label: 'Muito forte' },
] as const

interface StrengthCheckerProps {
  password: string
}

const PasswordStrengthChecker = ({ password }: StrengthCheckerProps): JSX.Element | null => {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  const deferred = useDeferredValue(password)

  useEffect(() => {
    Promise.all([import('@zxcvbn-ts/language-common'), import('@zxcvbn-ts/language-en')])
      .then(([common, english]) => {
        zxcvbnOptions.setOptions({
          translations: english.translations,
          graphs: common.adjacencyGraphs,
          maxLength: 50,
          dictionary: { ...common.dictionary, ...english.dictionary },
        })
        setReady(true)
      })
      .catch(() => setFailed(true))
  }, [])

  const result = useMemo(() => {
    if (!ready || deferred.length === 0) return null
    return zxcvbn(deferred)
  }, [ready, deferred])

  if (failed) return null

  const score = result?.score ?? 0
  const config = STRENGTH_CONFIG[score]
  const label = deferred.length === 0 ? 'Força da senha' : !ready ? 'Carregando...' : config.label

  return (
    <div className="space-y-1">
      <div
        role="progressbar"
        aria-label="Força da senha"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuetext={label}
        className="flex gap-1"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              score > i ? config.color : 'bg-secondary'
            )}
          />
        ))}
      </div>

      <div className="flex justify-end text-xs text-muted-foreground">
        {result?.feedback.warning ? (
          <Tooltip>
            <TooltipTrigger className="underline underline-offset-1">{label}</TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4} className="text-sm">
              {result.feedback.warning}
            </TooltipContent>
          </Tooltip>
        ) : (
          label
        )}
      </div>
    </div>
  )
}

interface PasswordFieldProps {
  control: Control<SignUpFormData>
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
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id="password"
              type={visible ? 'text' : 'password'}
              autoComplete="new-password"
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

          <PasswordStrengthChecker password={field.value} />
        </Field>
      )}
    />
  )
}

export { PasswordField }
