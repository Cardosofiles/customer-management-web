'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface PasskeyAddFormProps {
  isPending: boolean
  onAdd: (name: string) => void
  onCancel: () => void
}

/**
 * Formulário inline para adicionar uma nova passkey.
 * Submete com o botão ou com Enter quando o campo está preenchido.
 */
export function PasskeyAddForm({ isPending, onAdd, onCancel }: PasskeyAddFormProps) {
  const [name, setName] = useState('')

  const canSubmit = name.trim().length > 0 && !isPending

  function handleSubmit() {
    if (!canSubmit) return
    onAdd(name.trim())
  }

  function handleCancel() {
    setName('')
    onCancel()
  }

  return (
    <div className="max-w-sm space-y-4 rounded-md border p-4">
      <Field>
        <FieldLabel>Nome da passkey</FieldLabel>
        <Input
          placeholder="Ex: Meu MacBook"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </Field>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
          Adicionar
        </Button>
        <Button variant="outline" onClick={handleCancel} disabled={isPending}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
