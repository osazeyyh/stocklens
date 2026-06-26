'use client'

import { useState } from 'react'
import type { StockResult, StockTag } from '@/types/stock'
import { StockCard } from './StockCard'
import { Skeleton } from './ui/Skeleton'
import { cn } from '@/lib/utils'

type Filter = 'all' | StockTag

interface StockGridProps {
  stocks: StockResult[]
  amount: number
  isLoading: boolean
  error?: string | null
  onSelectStock: (stock: StockResult) => void
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'quick-trade', label: '⚡ Quick Trades' },
  { key: 'long-hold', label: '🏦 Long Hold' },
  { key: 'hidden-gem', label: '💎 Hidden Gems' },
]

export function StockGrid({ stocks, amount, isLoading, error, onSelectStock }: StockGridProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? stocks : stocks.filter(s => s.tag === filter)

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              filter === f.key
                ? 'text-white'
                : 'text-[#8B9BB4] hover:text-white',
            )}
            style={
              filter === f.key
                ? { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }
                : { background: 'transparent', border: '1px solid transparent' }
            }
          >
            {f.label}
            {f.key !== 'all' && !isLoading && (
              <span className="ml-1.5 text-xs opacity-60">
                {stocks.filter(s => s.tag === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.2)' }}
        >
          <p className="text-[#FF4D6A] text-sm">{error}</p>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 space-y-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            >
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Stock cards */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm">No stocks found for this filter.</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(stock => (
            <StockCard
              key={stock.ticker}
              stock={stock}
              amount={amount}
              onClick={() => onSelectStock(stock)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
