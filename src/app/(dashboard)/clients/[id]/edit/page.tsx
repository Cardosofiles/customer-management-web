import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Editar Cliente',
  description: 'Edite as informações do cliente',
}

const EditClientPage = (): JSX.Element => {
  return (
    <div>
      <h1>EditClientPage</h1>
    </div>
  )
}

export default EditClientPage
