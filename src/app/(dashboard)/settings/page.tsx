import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Configurações',
  description: 'Gerencie suas configurações',
}

const SettingsPage = (): JSX.Element => {
  return (
    <div>
      <h1>SettingsPage</h1>
    </div>
  )
}

export default SettingsPage
