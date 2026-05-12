import { Geist, Geist_Mono, Inter } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export { geistMono, geistSans, inter }
