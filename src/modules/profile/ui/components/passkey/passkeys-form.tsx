'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAddPasskey, useDeletePasskey, usePasskeys } from '@/modules/profile/hooks/use-passkeys'
import { PasskeyAddForm } from '@/modules/profile/ui/components/passkey/passkey-add-form'
import { PasskeyEmptyState } from '@/modules/profile/ui/components/passkey/passkey-empty-state'
import { PasskeyTable } from '@/modules/profile/ui/components/passkey/passkey-table'
import { PasskeysSkeleton } from '@/modules/profile/ui/components/passkey/passkeys-skeleton'

/**
 * Container principal da feature de passkeys.
 * Orquestra os hooks e sub-componentes sem conter lógica de UI.
 */
export function PasskeysForm() {
  const [showAdd, setShowAdd] = useState(false)

  const { data: passkeys, isLoading } = usePasskeys()

  const { mutate: addPasskey, isPending: isAdding } = useAddPasskey(() => setShowAdd(false))

  const { mutate: deletePasskey, isPending: isDeleting, variables: deletingId } = useDeletePasskey()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Passkeys</CardTitle>
            <CardDescription>Gerencie suas chaves de acesso WebAuthn</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAdd((prev) => !prev)}>
            <Plus className="mr-2 size-4" aria-hidden />
            Adicionar Passkey
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showAdd && (
          <PasskeyAddForm
            isPending={isAdding}
            onAdd={addPasskey}
            onCancel={() => setShowAdd(false)}
          />
        )}

        {isLoading ? (
          <PasskeysSkeleton />
        ) : !passkeys?.length ? (
          <PasskeyEmptyState />
        ) : (
          <PasskeyTable
            passkeys={passkeys}
            deletingId={isDeleting ? deletingId : undefined}
            onDelete={deletePasskey}
          />
        )}
      </CardContent>
    </Card>
  )
}
