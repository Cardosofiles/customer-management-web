import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { JSX } from 'react'

const Home = (): JSX.Element => {
  return (
    <div className="min-h-screen gap-2  flex items-center justify-center">
      <Button asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>

      <Button asChild>
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  )
}

export default Home
