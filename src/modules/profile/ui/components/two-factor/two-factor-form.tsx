'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { AuthUser } from '@/lib/auth'
import { useBackupCodes } from '@/modules/profile/hooks/use-backup-codes'
import { BackupCodesDisplay } from '@/modules/profile/ui/components/two-factor/backup-codes-display'
import { TwoFactorDisableFlow } from '@/modules/profile/ui/components/two-factor/two-factor-disable-flow'
import { TwoFactorEnableFlow } from '@/modules/profile/ui/components/two-factor/two-factor-enable-flow'

interface TwoFactorFormProps {
  user: AuthUser
}

/**
 * Container da feature de 2FA.
 * Alterna entre os fluxos de ativação e gerenciamento conforme o estado.
 */
export function TwoFactorForm({ user }: TwoFactorFormProps) {
  const [enabled, setEnabled] = useState(user.twoFactorEnabled ?? false)
  const { codes, isPending: regenPending, regenerate } = useBackupCodes()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Autenticação de dois fatores</CardTitle>
            <CardDescription>
              {enabled
                ? 'Sua conta está protegida com 2FA'
                : 'Adicione uma camada extra de segurança à sua conta'}
            </CardDescription>
          </div>
          <Badge variant={enabled ? 'default' : 'secondary'}>{enabled ? 'Ativo' : 'Inativo'}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!enabled ? (
          <TwoFactorEnableFlow onEnabled={() => setEnabled(true)} />
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Códigos de backup</p>
                <p className="text-sm text-muted-foreground">
                  Gere novos códigos de backup. Os códigos anteriores serão invalidados.
                </p>
              </div>

              <Button variant="outline" onClick={() => regenerate({})} disabled={regenPending}>
                {regenPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
                Regenerar códigos de backup
              </Button>

              {codes.length > 0 && <BackupCodesDisplay codes={codes} />}
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Desativar 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Remova a autenticação de dois fatores da sua conta.
                </p>
              </div>
              <TwoFactorDisableFlow onDisabled={() => setEnabled(false)} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
