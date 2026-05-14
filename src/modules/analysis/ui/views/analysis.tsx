import type { JSX } from 'react'

import { ChartAreaInteractive } from '@/modules/analysis/ui/components/chart-area-interactive'
import { SectionCards } from '@/modules/analysis/ui/components/section-cards'

const Analysis = (): JSX.Element => {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  )
}

export { Analysis }
