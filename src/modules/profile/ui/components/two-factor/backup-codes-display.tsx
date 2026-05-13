import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCopyCodes } from '@/modules/profile/hooks/use-copy-codes'

interface BackupCodesDisplayProps {
  codes: string[]
  title?: string
  description?: string
}

/**
 * Exibe lista de códigos de backup com ação de copiar tudo.
 * Reutilizável tanto no fluxo de ativação quanto na regeneração.
 */
export function BackupCodesDisplay({ codes, title, description }: BackupCodesDisplayProps) {
  const { copied, copy } = useCopyCodes()

  return (
    <div className="space-y-4">
      {title && <p className="font-medium">{title}</p>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <div className="rounded-md border bg-muted p-4">
        <div className="grid grid-cols-2 gap-2">
          {codes.map((code) => (
            <code key={code} className="font-mono text-sm">
              {code}
            </code>
          ))}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => copy(codes)}>
        {copied ? (
          <Check className="mr-2 size-4" aria-hidden />
        ) : (
          <Copy className="mr-2 size-4" aria-hidden />
        )}
        {copied ? 'Copiados!' : 'Copiar todos'}
      </Button>
    </div>
  )
}
