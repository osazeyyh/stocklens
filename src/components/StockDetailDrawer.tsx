'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import type { StockResult, StockDetail } from '@/types/stock'
import { formatCurrency, formatPercent } from '@/lib/format'
import { HistoricalChart } from './HistoricalChart'
import { StockMeta } from './StockMeta'
import { ConfidenceBar } from './ConfidenceBar'
import { HoldPeriodAnalysis } from './HoldPeriodAnalysis'
import { Skeleton } from './ui/Skeleton'

interface StockDetailDrawerProps {
  stock: StockResult | null
  amount: number
  open: boolean
  onClose: () => void
}

export function StockDetailDrawer({ stock, amount, open, onClose }: StockDetailDrawerProps) {
  const [detail, setDetail] = useState<StockDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!stock || !open) return
    setDetail(null)
    setError(null)
    setLoading(true)

    fetch(`/api/stock/${encodeURIComponent(stock.ticker)}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(data => {
        setDetail(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load detail data for this stock.')
        setLoading(false)
      })
  }, [stock, open])

  if (!stock) return null

  const projectedValue = Math.round(amount * stock.historicalReturnFactor)
  const gain = projectedValue - amount
  const isPositive = stock.historicalReturn >= 0

  return (
    <Dialog.Root open={open} onOpenChange={o => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(4,8,18,0.85)', backdropFilter: 'blur(4px)' }}
        />
        <Dialog.Content
          className="fixed z-50 flex flex-col overflow-y-auto"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px 24px 0 0',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '92vh',
            // Desktop: side panel
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>

          <div className="px-5 pb-8 space-y-6 flex-1">
            {/* Header */}
            <div className="flex items-start justify-between pt-2">
              <div>
                <Dialog.Title className="text-xl font-bold text-white">{stock.name}</Dialog.Title>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {stock.ticker} · {stock.sector}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  className="rounded-full p-2 transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            {/* Return summary */}
            <div
              className="rounded-2xl p-4 space-y-1"
              style={{
                background: isPositive ? 'rgba(0,229,160,0.06)' : 'rgba(255,77,106,0.06)',
                border: `1px solid ${isPositive ? 'rgba(0,229,160,0.2)' : 'rgba(255,77,106,0.2)'}`,
              }}
            >
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Your {formatCurrency(amount, stock.currency)} would have become
              </p>
              <p className="text-3xl font-bold text-white tabular-nums">
                {formatCurrency(projectedValue, stock.currency)}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="flex items-center gap-1 text-sm font-semibold"
                  style={{ color: isPositive ? '#00E5A0' : '#FF4D6A' }}
                >
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {formatPercent(stock.historicalReturn * 100)} over {stock.market === 'NGX' ? 'this period' : 'this period'}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  ({isPositive ? '+' : ''}{formatCurrency(Math.abs(gain), stock.currency, true)})
                </span>
              </div>
            </div>

            {/* Confidence */}
            <ConfidenceBar confidence={stock.confidence} />

            {/* Chart */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Price History</h3>
              {loading && <Skeleton className="h-48 w-full" />}
              {!loading && detail && (
                <HistoricalChart history={detail.historical} amount={amount} currency={stock.currency} />
              )}
              {!loading && error && (
                <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>{error}</p>
              )}
            </div>

            {/* Stock metadata */}
            {!loading && detail && (
              <>
                <StockMeta detail={detail} />
                <HoldPeriodAnalysis history={detail.historical} />
              </>
            )}

            {loading && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
