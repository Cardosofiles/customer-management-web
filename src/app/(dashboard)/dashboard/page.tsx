import { Analysis } from '@/modules/analysis'
import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Visão geral do painel de controle',
}

const DashboardPage = (): JSX.Element => {
  return <Analysis />
}

export default DashboardPage
