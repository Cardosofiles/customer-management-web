import type { Metadata } from 'next'
import type { JSX } from 'react'

import { getSchemaBrowser } from '@/actions/sql-console'
import { SqlConsoleView } from '@/modules/admin'

export const metadata: Metadata = {
  title: 'Console SQL',
  description: 'Acesse o console SQL para executar consultas diretamente no banco de dados',
}

const ConsoleSQLPage = async (): Promise<JSX.Element> => {
  const schema = await getSchemaBrowser()
  return <SqlConsoleView initialSchema={schema} />
}

export default ConsoleSQLPage
