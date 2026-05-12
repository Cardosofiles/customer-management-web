import { NextThemeProvider } from '@/providers/next-theme'
import { TanstackQueryProvider } from '@/providers/tanstack-query'
import { TooltipHoverProvider } from '@/providers/tooltip-hover'

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TanstackQueryProvider>
        <TooltipHoverProvider>{children}</TooltipHoverProvider>
      </TanstackQueryProvider>
    </NextThemeProvider>
  )
}
