'use client'

import { cn } from '@/lib/utils'
import type { Market, Period } from '@/types/stock'

interface MarketPeriodToggleProps {
  market: Market
  period: Period
  onMarketChange: (m: Market) => void
  onPeriodChange: (p: Period) => void
}

const PERIODS: Period[] = ['1Y', '3Y', '5Y']

export function MarketPeriodToggle({
  market,
  period,
  onMarketChange,
  onPeriodChange,
}: MarketPeriodToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Market selector */}
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
      >
        {(['NGX', 'US'] as Market[]).map(m => (
          <button
            key={m}
            onClick={() => onMarketChange(m)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
              market === m
                ? 'text-[#040812] shadow-sm'
                : 'text-[#8B9BB4] hover:text-white',
            )}
            style={
              market === m
                ? { background: 'linear-gradient(135deg, #00E5A0, #3D7BFF)', color: '#040812' }
                : {}
            }
          >
            {m === 'NGX' ? '🇳🇬 NGX' : '🇺🇸 US Markets'}
          </button>
        ))}
      </div>

      {/* Period selector */}
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
      >
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              period === p
                ? 'bg-[rgba(255,255,255,0.1)] text-white'
                : 'text-[#8B9BB4] hover:text-white',
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
