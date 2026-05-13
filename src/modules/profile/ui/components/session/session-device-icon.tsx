import { Monitor, Smartphone } from 'lucide-react'
import { UAParser } from 'ua-parser-js'

interface SessionDeviceIconProps {
  userAgent?: string | null
}

/**
 * Ícone de dispositivo inferido pelo user-agent.
 */
export function SessionDeviceIcon({ userAgent }: SessionDeviceIconProps) {
  const info = userAgent ? UAParser(userAgent) : null
  const isMobile = info?.device.type === 'mobile'

  return isMobile ? (
    <Smartphone className="size-5 shrink-0" aria-label="Dispositivo móvel" />
  ) : (
    <Monitor className="size-5 shrink-0" aria-label="Computador" />
  )
}
