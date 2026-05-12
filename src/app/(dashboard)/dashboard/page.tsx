import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Visão geral do painel de controle',
}

const DashboardPage = (): JSX.Element => {
  return (
    <div>
      <h1>DashboardPage</h1>
    </div>
  )
}

export default DashboardPage
