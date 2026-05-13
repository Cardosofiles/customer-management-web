'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useChangeEmail } from '@/modules/profile/hooks/use-profile'

const schema = z.object({
  newEmail: z.email('Email inválido'),
})

type EmailForm = z.infer<typeof schema>

interface ProfileEmailFormProps {
  defaultEmail: string
}

/**
 * Formulário de solicitação de troca de email com confirmação via link.
 */
export function ProfileEmailForm({ defaultEmail }: ProfileEmailFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(schema),
    defaultValues: { newEmail: defaultEmail },
  })

  const { mutate: requestEmailChange, isPending } = useChangeEmail(reset)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          Solicite troca de email. Um link de confirmação será enviado para o novo endereço.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(({ newEmail }) => requestEmailChange(newEmail))}
          className="max-w-sm space-y-4"
        >
          <Field data-invalid={!!errors.newEmail}>
            <FieldLabel>Novo email</FieldLabel>
            <Input type="email" {...register('newEmail')} />
            <FieldError errors={[errors.newEmail]} />
          </Field>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            Solicitar troca de email
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
