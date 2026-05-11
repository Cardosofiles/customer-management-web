import type { Metadata } from 'next'

import '@/styles/globals.css'
import { geistMono, geistSans } from '@/utils/fonts'

export const metadata: Metadata = {
  title: {
    default: 'Customer Management',
    template: '%s | Customer Management',
  },
  description:
    'Aplicação MVP para gerenciamento de clientes, com funcionalidade de queries SQL em rota administrativa. Proposta para email-markting coleta de leads.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
