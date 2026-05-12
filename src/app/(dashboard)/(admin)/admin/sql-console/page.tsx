import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Console SQL',
  description: 'Acesse o console SQL para executar consultas diretamente no banco de dados',
}

const ConsoleSQLPage = (): JSX.Element => {
  return (
    <div>
      <h1>ConsoleSQLPage</h1>
    </div>
  )
}

export default ConsoleSQLPage
