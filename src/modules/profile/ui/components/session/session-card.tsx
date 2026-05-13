import { Loader2, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UAParser } from 'ua-parser-js'

import { SessionDeviceIcon } from './session-device-icon'

interface Session {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  expiresAt: Date
}

interface SessionCardProps {
  session: Session
  isCurrentSession?: boolean
  isRevoking?: boolean
  onRevoke?: (token: string) => void
}

function getDeviceLabel(userAgent?: string | null): string {
  if (!userAgent) return 'Dispositivo desconhecido'
  const { browser, os } = UAParser(userAgent)
  if (!browser.name && !os.name) return 'Dispositivo desconhecido'
  if (!browser.name) return os.name!
  if (!os.name) return browser.name
  return `${browser.name}, ${os.name}`
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

/**
 * Card de sessão com informações do dispositivo e ação de revogação.
 */
export function SessionCard({
  session,
  isCurrentSession = false,
  isRevoking = false,
  onRevoke,
}: SessionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{getDeviceLabel(session.userAgent)}</CardTitle>
        {isCurrentSession && <Badge>Sessão atual</Badge>}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SessionDeviceIcon userAgent={session.userAgent} />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Criado em: {formatDate(session.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                Expira em: {formatDate(session.expiresAt)}
              </p>
              {session.ipAddress && (
                <p className="text-xs text-muted-foreground">IP: {session.ipAddress}</p>
              )}
            </div>
          </div>

          {!isCurrentSession && onRevoke && (
            <Button
              variant="destructive"
              size="icon"
              aria-label="Revogar sessão"
              disabled={isRevoking}
              onClick={() => onRevoke(session.token)}
            >
              {isRevoking ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-4" aria-hidden />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
