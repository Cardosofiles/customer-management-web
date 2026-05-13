import { useCallback, useState } from 'react'

/**
 * Controla visibilidade de campos de senha com toggle e acessibilidade.
 */
export function usePasswordVisibility() {
  const [visible, setVisible] = useState(false)

  const toggle = useCallback(() => setVisible((v) => !v), [])

  const inputType = visible ? 'text' : 'password'
  const ariaLabel = visible ? 'Ocultar senha' : 'Mostrar senha'

  return { visible, toggle, inputType, ariaLabel }
}
