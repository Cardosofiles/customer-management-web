import { useState } from 'react'

/**
 * Copia lista de códigos para o clipboard e reseta o estado após 2s.
 */
export function useCopyCodes() {
  const [copied, setCopied] = useState(false)

  function copy(codes: string[]) {
    navigator.clipboard.writeText(codes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return { copied, copy }
}
