'use client'

import type { AuthUser } from '@/lib/auth'
import type { JSX } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SocialAccountsForm } from '@/modules/profile/ui/components/oauth-providers/social-accounts-form'
import { PasskeysForm } from '@/modules/profile/ui/components/passkey/passkeys-form'
import { ProfileForm } from '@/modules/profile/ui/components/profile-form/profile-form'
import { SecurityForm } from '@/modules/profile/ui/components/security/security-form'

import { SessionsForm } from '@/modules/profile/ui/components/session/sessions-form'
import { TwoFactorForm } from '@/modules/profile/ui/components/two-factor/two-factor-form'

interface ProfileViewProps {
  user: AuthUser
  currentSessionToken: string
}

const Profile = ({ user, currentSessionToken }: ProfileViewProps): JSX.Element => {
  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seu perfil e preferências de segurança
        </p>
      </div>
      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="dois-fatores">Autenticação 2FA</TabsTrigger>
          <TabsTrigger value="passkeys">Passkeys</TabsTrigger>
          <TabsTrigger value="sessoes">Sessões</TabsTrigger>
          <TabsTrigger value="contas-sociais">Contas Sociais</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <ProfileForm user={user} />
        </TabsContent>
        <TabsContent value="seguranca">
          <SecurityForm />
        </TabsContent>
        <TabsContent value="dois-fatores">
          <TwoFactorForm user={user} />
        </TabsContent>
        <TabsContent value="passkeys">
          <PasskeysForm />
        </TabsContent>
        <TabsContent value="sessoes">
          <SessionsForm currentSessionToken={currentSessionToken} />
        </TabsContent>
        <TabsContent value="contas-sociais">
          <SocialAccountsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { Profile }
