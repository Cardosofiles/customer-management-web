import type { JSX } from 'react'

const AuthShell = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <div className="flex min-h-svh items-center justify-center">
    <div className="w-full max-w-sm space-y-6 p-6">{children}</div>
  </div>
)
export { AuthShell }
