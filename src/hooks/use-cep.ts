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
      setLoading(true)
      setError(null)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (!res.ok) {
          setError('Erro ao buscar CEP')
          return null
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Tempo esgotado ao buscar CEP')
        } else {
          setError('Erro ao buscar CEP')
        }
        return null
      }
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
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
      setError('Erro ao buscar CEP')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { fetchCep, loading, error }
}
