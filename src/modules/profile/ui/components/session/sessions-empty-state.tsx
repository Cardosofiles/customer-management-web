import { MonitorOff } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

/**
 * Estado vazio quando não há outras sessões ativas.
 */
export function SessionsEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <MonitorOff className="size-8" aria-hidden />
        <p className="text-sm">Nenhuma outra sessão ativa</p>
      </CardContent>
    </Card>
  )
}
