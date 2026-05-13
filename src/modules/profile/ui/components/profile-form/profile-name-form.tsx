'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useUpdateName } from '@/modules/profile/hooks/use-profile'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
})

type NameForm = z.infer<typeof schema>

interface ProfileNameFormProps {
  defaultName: string
}

/**
 * Formulário de atualização do nome de exibição do usuário.
 */
export function ProfileNameForm({ defaultName }: ProfileNameFormProps) {
  const { mutate: updateName, isPending } = useUpdateName()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NameForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nome</CardTitle>
        <CardDescription>Atualize seu nome de exibição</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(({ name }) => updateName(name))}
          className="max-w-sm space-y-4"
        >
          <Field data-invalid={!!errors.name}>
            <FieldLabel>Nome</FieldLabel>
            <Input {...register('name')} />
            <FieldError errors={[errors.name]} />
          </Field>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
            Salvar nome
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
