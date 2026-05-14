'use client'

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useClientesMetricsMes } from '@/modules/analysis/hooks/use-get-users'

function formatPercent(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  const absValue = Math.abs(value)
  const formatted = absValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return `${sign}${formatted}%`
}

export function SectionCards() {
  const {
    totalMes,
    pfMes,
    pjMes,
    totalDeltaPercent,
    pfDeltaPercent,
    pjDeltaPercent,
    isLoading,
    error,
  } = useClientesMetricsMes()

  const totalLabel = isLoading || error ? '...' : totalMes.toLocaleString('pt-BR')
  const pessoasFisicasLabel = isLoading || error ? '...' : pfMes.toLocaleString('pt-BR')
  const pessoasJuridicasLabel = isLoading || error ? '...' : pjMes.toLocaleString('pt-BR')
  const totalDeltaLabel = isLoading || error ? '...' : formatPercent(totalDeltaPercent)
  const pfDeltaLabel = isLoading || error ? '...' : formatPercent(pfDeltaPercent)
  const pjDeltaLabel = isLoading || error ? '...' : formatPercent(pjDeltaPercent)
  const totalIsUp = totalDeltaPercent >= 0
  const pfIsUp = pfDeltaPercent >= 0
  const pjIsUp = pjDeltaPercent >= 0

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Clientes cadastrados no mes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLabel}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {totalIsUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {totalDeltaLabel}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Crescimento consistente no periodo
          </div>
          <div className="text-muted-foreground">Comparativo com o periodo anterior</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Clientes PF no mes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pessoasFisicasLabel}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {pfIsUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {pfDeltaLabel}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Leve retracao no periodo</div>
          <div className="text-muted-foreground">Comparativo com o periodo anterior</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Clientes PJ no mes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pessoasJuridicasLabel}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {pjIsUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {pjDeltaLabel}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Evolucao acima do esperado</div>
          <div className="text-muted-foreground">Comparativo com o periodo anterior</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo de Ativacoes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            +23
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8,2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Ativacoes superaram desativacoes
          </div>
          <div className="text-muted-foreground">Comparativo com o periodo anterior</div>
        </CardFooter>
      </Card>
    </div>
  )
}
