import { useState } from 'react'
import { toast } from 'sonner'

import { twoFactor } from '@/lib/auth-client'

/**
 * Regenera códigos de backup e expõe a lista resultante.
 */
export function useBackupCodes() {
  const [codes, setCodes] = useState<string[]>([])
  const [isPending, setIsPending] = useState(false)

  async function regenerate(data: { password?: string } = {}) {
    // ✅ tipo correto
    setIsPending(true)
    const { data: result, error } = await twoFactor.generateBackupCodes(data)
    setIsPending(false)
    if (error || !result) {
      toast.error('Erro ao regenerar códigos de backup')
      return
    }
    setCodes(result.backupCodes ?? [])
  }

  return { codes, isPending, regenerate }
}
