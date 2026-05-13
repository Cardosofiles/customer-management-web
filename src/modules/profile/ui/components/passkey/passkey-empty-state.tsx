import { Key } from 'lucide-react'

/**
 * Estado vazio exibido quando o usuário não possui nenhuma passkey cadastrada.
 */
export function PasskeyEmptyState() {
  return (
    <div
      className="flex flex-col items-center gap-2 py-8 text-muted-foreground"
      aria-label="Nenhuma passkey cadastrada"
    >
      <Key className="size-8" aria-hidden />
      <p className="text-sm">Nenhuma passkey cadastrada</p>
    </div>
  )
}
