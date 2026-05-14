'use client'

import type { JSX } from 'react'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useIsMobile } from '@/hooks/use-mobile'

export const description = 'An interactive area chart'

const chartData = [
  { date: '2024-04-01', PF: 222, PJ: 150 },
  { date: '2024-04-02', PF: 97, PJ: 180 },
  { date: '2024-04-03', PF: 167, PJ: 120 },
  { date: '2024-04-04', PF: 242, PJ: 260 },
  { date: '2024-04-05', PF: 373, PJ: 290 },
  { date: '2024-04-06', PF: 301, PJ: 340 },
  { date: '2024-04-07', PF: 245, PJ: 180 },
  { date: '2024-04-08', PF: 409, PJ: 320 },
  { date: '2024-04-09', PF: 59, PJ: 110 },
  { date: '2024-04-10', PF: 261, PJ: 190 },
  { date: '2024-04-11', PF: 327, PJ: 350 },
  { date: '2024-04-12', PF: 292, PJ: 210 },
  { date: '2024-04-13', PF: 342, PJ: 380 },
  { date: '2024-04-14', PF: 137, PJ: 220 },
  { date: '2024-04-15', PF: 120, PJ: 170 },
  { date: '2024-04-16', PF: 138, PJ: 190 },
  { date: '2024-04-17', PF: 446, PJ: 360 },
  { date: '2024-04-18', PF: 364, PJ: 410 },
  { date: '2024-04-19', PF: 243, PJ: 180 },
  { date: '2024-04-20', PF: 89, PJ: 150 },
  { date: '2024-04-21', PF: 137, PJ: 200 },
  { date: '2024-04-22', PF: 224, PJ: 170 },
  { date: '2024-04-23', PF: 138, PJ: 230 },
  { date: '2024-04-24', PF: 387, PJ: 290 },
  { date: '2024-04-25', PF: 215, PJ: 250 },
  { date: '2024-04-26', PF: 75, PJ: 130 },
  { date: '2024-04-27', PF: 383, PJ: 420 },
  { date: '2024-04-28', PF: 122, PJ: 180 },
  { date: '2024-04-29', PF: 315, PJ: 240 },
  { date: '2024-04-30', PF: 454, PJ: 380 },
  { date: '2024-05-01', PF: 165, PJ: 220 },
  { date: '2024-05-02', PF: 293, PJ: 310 },
  { date: '2024-05-03', PF: 247, PJ: 190 },
  { date: '2024-05-04', PF: 385, PJ: 420 },
  { date: '2024-05-05', PF: 481, PJ: 390 },
  { date: '2024-05-06', PF: 498, PJ: 520 },
  { date: '2024-05-07', PF: 388, PJ: 300 },
  { date: '2024-05-08', PF: 149, PJ: 210 },
  { date: '2024-05-09', PF: 227, PJ: 180 },
  { date: '2024-05-10', PF: 293, PJ: 330 },
  { date: '2024-05-11', PF: 335, PJ: 270 },
  { date: '2024-05-12', PF: 197, PJ: 240 },
  { date: '2024-05-13', PF: 197, PJ: 160 },
  { date: '2024-05-14', PF: 448, PJ: 490 },
  { date: '2024-05-15', PF: 473, PJ: 380 },
  { date: '2024-05-16', PF: 338, PJ: 400 },
  { date: '2024-05-17', PF: 499, PJ: 420 },
  { date: '2024-05-18', PF: 315, PJ: 350 },
  { date: '2024-05-19', PF: 235, PJ: 180 },
  { date: '2024-05-20', PF: 177, PJ: 230 },
  { date: '2024-05-21', PF: 82, PJ: 140 },
  { date: '2024-05-22', PF: 81, PJ: 120 },
  { date: '2024-05-23', PF: 252, PJ: 290 },
  { date: '2024-05-24', PF: 294, PJ: 220 },
  { date: '2024-05-25', PF: 201, PJ: 250 },
  { date: '2024-05-26', PF: 213, PJ: 170 },
  { date: '2024-05-27', PF: 420, PJ: 460 },
  { date: '2024-05-28', PF: 233, PJ: 190 },
  { date: '2024-05-29', PF: 78, PJ: 130 },
  { date: '2024-05-30', PF: 340, PJ: 280 },
  { date: '2024-05-31', PF: 178, PJ: 230 },
  { date: '2024-06-01', PF: 178, PJ: 200 },
  { date: '2024-06-02', PF: 470, PJ: 410 },
  { date: '2024-06-03', PF: 103, PJ: 160 },
  { date: '2024-06-04', PF: 439, PJ: 380 },
  { date: '2024-06-05', PF: 88, PJ: 140 },
  { date: '2024-06-06', PF: 294, PJ: 250 },
  { date: '2024-06-07', PF: 323, PJ: 370 },
  { date: '2024-06-08', PF: 385, PJ: 320 },
  { date: '2024-06-09', PF: 438, PJ: 480 },
  { date: '2024-06-10', PF: 155, PJ: 200 },
  { date: '2024-06-11', PF: 92, PJ: 150 },
  { date: '2024-06-12', PF: 492, PJ: 420 },
  { date: '2024-06-13', PF: 81, PJ: 130 },
  { date: '2024-06-14', PF: 426, PJ: 380 },
  { date: '2024-06-15', PF: 307, PJ: 350 },
  { date: '2024-06-16', PF: 371, PJ: 310 },
  { date: '2024-06-17', PF: 475, PJ: 520 },
  { date: '2024-06-18', PF: 107, PJ: 170 },
  { date: '2024-06-19', PF: 341, PJ: 290 },
  { date: '2024-06-20', PF: 408, PJ: 450 },
  { date: '2024-06-21', PF: 169, PJ: 210 },
  { date: '2024-06-22', PF: 317, PJ: 270 },
  { date: '2024-06-23', PF: 480, PJ: 530 },
  { date: '2024-06-24', PF: 132, PJ: 180 },
  { date: '2024-06-25', PF: 141, PJ: 190 },
  { date: '2024-06-26', PF: 434, PJ: 380 },
  { date: '2024-06-27', PF: 448, PJ: 490 },
  { date: '2024-06-28', PF: 149, PJ: 200 },
  { date: '2024-06-29', PF: 103, PJ: 160 },
  { date: '2024-06-30', PF: 446, PJ: 400 },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  PF: {
    label: 'PF',
    color: 'var(--primary)',
  },
  PJ: {
    label: 'PJ',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

const ChartAreaInteractive = (): JSX.Element => {
  const isMobile = useIsMobile()
  // initialize timeRange based on current device to avoid synchronous setState in an effect
  const [timeRange, setTimeRange] = React.useState(() => (isMobile ? '7d' : '90d'))

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Panorâma de Cadastros</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Filtre a informação desejada</span>
          <span className="@[540px]/card:hidden">Três meses atras</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Três meses atras</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 dias atras</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 dias atras</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Três meses atras
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 dias atras
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 dias atras
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPF" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-PF)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-PF)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPJ" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-PJ)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-PJ)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="PJ"
              type="natural"
              fill="url(#fillPJ)"
              stroke="var(--color-PJ)"
              stackId="a"
            />
            <Area
              dataKey="PF"
              type="natural"
              fill="url(#fillPF)"
              stroke="var(--color-PF)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export { ChartAreaInteractive }
