'use client'

import { useState } from 'react'

interface CepResult {
  rua: string
  bairro: string
  cidade: string
  estado: string
}

interface ViaCepResponse {
  erro?: boolean
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

export function useCep() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchCep(cep: string): Promise<CepResult | null> {
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) {
      setError('CEP deve ter 8 dígitos')
      return null
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      if (!res.ok) {
        setError('CEP não encontrado')
        return null
      }
      const data: ViaCepResponse = await res.json()
      if (data.erro) {
        setError('CEP não encontrado')
        return null
      }
      return {
        rua: data.logradouro ?? '',
        bairro: data.bairro ?? '',
        cidade: data.localidade ?? '',
        estado: data.uf ?? '',
      }
    } catch {
      setError('Erro ao buscar CEP')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { fetchCep, loading, error }
}
