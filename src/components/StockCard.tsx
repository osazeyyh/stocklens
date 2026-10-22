'use client'

import { TrendingUp, TrendingDown, Zap, Gem, Building2 } from 'lucide-react'
import type { StockResult } from '@/types/stock'
import { formatCurrency, formatPercent } from '@/lib/format'
import { ConfidenceBar } from './ConfidenceBar'
import { Sparkline } from './Sparkline'
import { Badge } from './ui/Badge'
import { EducationCard } from './EducationCard'

interface StockCardProps {
  stock: StockResult
  amount: number
  displayCurrency: 'NGN' | 'USD'
  onClick: () => void
}

const TAG_CONFIG = {
  'quick-trade': { icon: Zap, label: 'Quick trade', variant: 'amber' as const, edu: 'quick-trade' as const },
  'long-hold': { icon: Building2, label: 'Long hold', variant: 'blue' as const, edu: 'long-hold' as const },
  'hidden-gem': { icon: Gem, label: 'Hidden gem', variant: 'green' as const, edu: 'hidden-gem' as const },
}

export function StockCard({ stock, amount, displayCurrency, onClick }: StockCardProps) {
  const projectedValue = Math.round(amount * stock.historicalReturnFactor)
  const gain = projectedValue - amount
  const isPositive = stock.historicalReturn >= 0

  const tagConfig = TAG_CONFIG[stock.tag]
  const TagIcon = tagConfig.icon

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl p-5 space-y-4 border border-[var(--border-color)] bg-[var(--bg-surface)] transition-[border-color,transform] duration-200 ease-out hover:border-white/15 active:scale-[0.98]"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-base text-white">{stock.name}</span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {stock.ticker}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {stock.sector}
          </p>
        </div>
        <EducationCard term={tagConfig.edu}>
          <Badge variant={tagConfig.variant}>
            <TagIcon size={12} strokeWidth={2.25} />
            {tagConfig.label}
          </Badge>
        </EducationCard>
      </div>

      {/* Return projection */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-semibold tracking-tight tabular-nums text-white">
            {formatCurrency(projectedValue, displayCurrency)}
          </span>
          <span
            className="text-sm font-medium tabular-nums flex items-center gap-0.5"
            style={{ color: isPositive ? '#00E5A0' : '#FF4D6A' }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {formatPercent(stock.historicalReturn * 100)}
          </span>
        </div>
        <p className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {isPositive ? '+' : ''}
          {formatCurrency(Math.abs(gain), displayCurrency, true)} {isPositive ? 'gain' : 'loss'}
        </p>
      </div>

      {/* Sparkline */}
      <div className="h-10 -mx-1">
        <Sparkline data={stock.sparkline} positive={isPositive} />
      </div>

      {/* Confidence + hold */}
      <div className="space-y-2">
        <ConfidenceBar confidence={stock.confidence} compact />
        <p className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          Best held ~{stock.optimalHoldMonths < 12
            ? `${stock.optimalHoldMonths}mo`
            : `${Math.round(stock.optimalHoldMonths / 12)}yr`}
          {' · '}
          {Math.round(stock.winRate)}% win rate
        </p>
      </div>
    </button>
  )
}
