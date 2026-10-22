'use client'

import type { Market, Period } from '@/types/stock'
import { SegmentedControl } from './ui/SegmentedControl'

interface MarketPeriodToggleProps {
  market: Market
  period: Period
  onMarketChange: (m: Market) => void
  onPeriodChange: (p: Period) => void
}

const MARKETS: { value: Market; label: string }[] = [
  { value: 'NGX', label: 'NGX' },
  { value: 'US', label: 'US' },
]

const PERIODS: { value: Period; label: string }[] = [
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: '3Y', label: '3Y' },
  { value: '5Y', label: '5Y' },
  { value: 'custom', label: 'Custom' },
]

export function MarketPeriodToggle({
  market,
  period,
  onMarketChange,
  onPeriodChange,
}: MarketPeriodToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <SegmentedControl options={MARKETS} value={market} onChange={onMarketChange} />
      <SegmentedControl
        options={PERIODS}
        value={period}
        onChange={onPeriodChange}
        className="max-w-full overflow-x-auto"
      />
    </div>
  )
}
