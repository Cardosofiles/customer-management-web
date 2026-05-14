import { Button } from '@/components/ui/button'
import { ArrowBigLeft, GalleryVerticalEnd } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-screen overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col h-full gap-4 p-6 md:p-10">
        <div className="flex gap-2 justify-between">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Customer Management
          </a>

          <Button asChild variant="ghost">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground text-xs">
              <ArrowBigLeft size={15} />
              Voltar para o início
            </Link>
          </Button>
        </div>
        <div className="flex grow items-center justify-center">
          <div className="w-full max-w-xs pb-10 sm:pb-0">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          width={1200}
          height={800}
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
