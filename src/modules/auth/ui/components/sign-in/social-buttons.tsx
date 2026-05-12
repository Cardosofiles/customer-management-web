'use client'

import { useState, type JSX } from 'react'

import { GitHubIcon } from '@/components/icons/github-icon'
import { GoogleIcon } from '@/components/icons/google-icon'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'

const PROVIDERS = [
  { id: 'google', label: 'Google', icon: GoogleIcon },
  { id: 'github', label: 'GitHub', icon: GitHubIcon },
] as const

type ProviderId = (typeof PROVIDERS)[number]['id']

interface SocialButtonsProps {
  onError?: (message: string) => void
}

const SocialButtons = ({ onError }: SocialButtonsProps): JSX.Element => {
  const [loading, setLoading] = useState<ProviderId | null>(null)

  const handleSocial = async (id: ProviderId): Promise<void> => {
    setLoading(id)
    try {
      const { error } = await signIn.social({ provider: id, callbackURL: '/dashboard' })
      if (error) onError?.(error.message ?? 'Erro ao autenticar. Tente novamente.')
    } catch {
      onError?.('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {PROVIDERS.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          disabled={loading !== null}
          aria-busy={loading === id}
          onClick={() => handleSocial(id)}
        >
          <Icon className="mr-2 h-4 w-4" aria-hidden />
          {loading === id ? `Conectando com ${label}...` : `Entrar com ${label}`}
        </Button>
      ))}
    </div>
  )
}

export { SocialButtons }
