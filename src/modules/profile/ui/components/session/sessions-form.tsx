'use client'

import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRevokeOtherSessions } from '@/modules/profile/hooks/use-revoke-other-sessions'
import { useRevokeSession } from '@/modules/profile/hooks/use-revoke-session'
import { useSessions } from '@/modules/profile/hooks/use-sessions'
import { SessionCard } from '@/modules/profile/ui/components/session/session-card'
import { SessionsEmptyState } from '@/modules/profile/ui/components/session/sessions-empty-state'
import { SessionsSkeleton } from '@/modules/profile/ui/components/session/sessions-skeleton'

interface SessionsFormProps {
  currentSessionToken: string
}

/**
 * Container da feature de gerenciamento de sessões.
 * Exibe sessão atual, outras sessões ativas e ações de revogação.
 */
export function SessionsForm({ currentSessionToken }: SessionsFormProps) {
  const { data: sessions, isLoading } = useSessions()

  const {
    mutate: revokeSession,
    isPending: isRevoking,
    variables: revokingToken,
  } = useRevokeSession()

  const { mutate: revokeOthers, isPending: isRevokingAll } = useRevokeOtherSessions()

  const currentSession = sessions?.find((s) => s.token === currentSessionToken)
  const otherSessions = sessions?.filter((s) => s.token !== currentSessionToken) ?? []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sessões ativas</CardTitle>
            <CardDescription>Gerencie os dispositivos conectados à sua conta</CardDescription>
          </div>
          {otherSessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              disabled={isRevokingAll}
              onClick={() => revokeOthers()}
            >
              {isRevokingAll && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
              Revogar outras sessões
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <SessionsSkeleton />
        ) : (
          <>
            {currentSession && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Este dispositivo
                </p>
                <SessionCard session={currentSession} isCurrentSession />
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Outros dispositivos
              </p>
              {otherSessions.length === 0 ? (
                <SessionsEmptyState />
              ) : (
                <div className="space-y-3">
                  {otherSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isRevoking={isRevoking && revokingToken === session.token}
                      onRevoke={revokeSession}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
