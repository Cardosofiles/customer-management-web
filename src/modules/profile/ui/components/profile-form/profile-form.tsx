import type { AuthUser } from '@/lib/auth'
import { ProfileEmailForm } from '@/modules/profile/ui/components/profile-form/profile-email-form'
import { ProfileNameForm } from '@/modules/profile/ui/components/profile-form/profile-name-form'

interface ProfileFormProps {
  user: AuthUser
}

/**
 * Container da feature de perfil. Apenas compõe os sub-formulários.
 */
export function ProfileForm({ user }: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <ProfileNameForm defaultName={user.name} />
      <ProfileEmailForm defaultEmail={user.email} />
    </div>
  )
}
