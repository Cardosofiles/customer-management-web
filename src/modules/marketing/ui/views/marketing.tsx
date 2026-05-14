'use client'

import { IconChartBar, IconMailCheck, IconMailFast, IconSend } from '@tabler/icons-react'
import type { JSX } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCampaigns, useCampaignStats } from '../../hooks/use-campaigns'
import { BirthdaySection } from '../components/birthday-section'
import { CampaignTable } from '../components/campaign-table'
import { CreateCampaignDialog } from '../components/create-campaign-dialog'

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string
  value: number
  icon: React.ElementType
  loading: boolean
}): JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-2xl font-bold">{value.toLocaleString('pt-BR')}</p>
        )}
      </CardContent>
    </Card>
  )
}

const Marketing = (): JSX.Element => {
  const { data: campaigns = [], isLoading: loadingCampaigns } = useCampaigns()
  const { data: stats, isLoading: loadingStats } = useCampaignStats()

  const loading = loadingCampaigns || loadingStats

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">E-mail Marketing</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie e envie campanhas de e-mail para seus clientes.
          </p>
        </div>
        <CreateCampaignDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de campanhas"
          value={stats?.total ?? 0}
          icon={IconChartBar}
          loading={loadingStats}
        />
        <StatCard
          title="Campanhas enviadas"
          value={stats?.enviadas ?? 0}
          icon={IconMailCheck}
          loading={loadingStats}
        />
        <StatCard
          title="Rascunhos"
          value={stats?.rascunhos ?? 0}
          icon={IconSend}
          loading={loadingStats}
        />
        <StatCard
          title="E-mails enviados"
          value={stats?.totalEnvios ?? 0}
          icon={IconMailFast}
          loading={loadingStats}
        />
      </div>

      <BirthdaySection />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campanhas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <CampaignTable campaigns={campaigns} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { Marketing }
