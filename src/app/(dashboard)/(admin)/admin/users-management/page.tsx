import type { Metadata } from 'next'
import type { JSX } from 'react'

export const metadata: Metadata = {
  title: 'Gerenciamento de Usuários',
  description: 'Acesse o gerenciamento de usuários para criar, editar e excluir contas',
}

const UserManagementPage = (): JSX.Element => {
  return (
    <div>
      <h1>UserManagementPage</h1>
    </div>
  )
}

export default UserManagementPage
