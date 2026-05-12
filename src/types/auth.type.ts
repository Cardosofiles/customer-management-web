import { z } from 'zod'

import type {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInFormSchema,
  signUpFormSchema,
} from '@/schemas/auth.schema'

// ── Types ────────────────────────────────────────────────────────────────────
export type SignInFormData = z.infer<typeof signInFormSchema>
export type SignUpFormData = z.infer<typeof signUpFormSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
