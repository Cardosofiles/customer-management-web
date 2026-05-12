'use client'

import { TooltipProvider as ToolPro } from '@/components/ui/tooltip'

export function TooltipHoverProvider({ children }: { children: React.ReactNode }) {
  return <ToolPro>{children}</ToolPro>
}
