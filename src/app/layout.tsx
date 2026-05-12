import type { Metadata } from 'next'

import { cn } from '@/lib/utils'
import { Providers } from '@/providers'
import '@/styles/globals.css'
import { geistMono, geistSans, inter } from '@/utils/fonts'

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
      className={cn(
        'h-full',
        'antialiased',
        'dark',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
