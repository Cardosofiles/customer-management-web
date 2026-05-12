import { cn } from '@/utils/cn'
import type { JSX, ReactNode } from 'react'

interface FormSectionProps {
  title: string
  children: ReactNode
  className?: string
}

const FormSection = ({ title, children, className }: FormSectionProps): JSX.Element => (
  <div className={cn('border bg-card p-6', className)}>
    <h2 className="mb-4 text-sm font-semibold text-foreground">{title}</h2>
    {children}
  </div>
)

export { FormSection }
