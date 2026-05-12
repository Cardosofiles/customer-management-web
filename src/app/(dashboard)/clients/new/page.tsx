import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Novo Cliente',
  description: 'Crie um novo cliente',
}

const NewClientPage = (): JSX.Element => {
  return (
    <div>
      <h1>NewClientPage</h1>
    </div>
  )
}

export default NewClientPage
