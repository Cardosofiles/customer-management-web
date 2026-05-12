import type { JSX } from 'react'
import { type ControllerFieldState, type ControllerRenderProps } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface MaskedInputFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'id' | 'ref'
> {
  field: Omit<ControllerRenderProps, 'value'> & { value: string | undefined }
  fieldState: ControllerFieldState
  label: string
  errorId: string
  mask: (value: string) => string
}

const MaskedInputField = ({
  field,
  fieldState,
  label,
  errorId,
  mask,
  ...props
}: MaskedInputFieldProps): JSX.Element => {
  const { ref, value, onChange, onBlur, name } = field

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        {...props}
        id={name}
        name={name}
        ref={ref}
        value={mask(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={fieldState.invalid}
        aria-describedby={fieldState.error ? errorId : undefined}
      />
      <FieldError id={errorId}>{fieldState.error?.message}</FieldError>
    </Field>
  )
}

export { MaskedInputField }
