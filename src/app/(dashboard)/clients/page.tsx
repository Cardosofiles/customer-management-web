import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Clientes',
  description: 'Visualize a lista de clientes',
}

const ClientsPage = (): JSX.Element => {
  return (
    <div>
      <h1>ClientsPage</h1>
    </div>
  )
}

export default ClientsPage
