'use client'

import type { JSX } from 'react'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ModeToggleProps {
  className?: string
}

const ModeToggle = ({ className }: ModeToggleProps): JSX.Element => {
  const { setTheme, theme } = useTheme()

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      className={cn('cursor-pointer', className)}
      variant="ghost"
      onClick={handleToggleTheme}
      aria-label="Alternar tema"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}

export { ModeToggle }
