'use client'

import { useState, useEffect, useCallback } from 'react'
import { MotionConfig } from 'framer-motion'
import type { Market, Period, StockResult } from '@/types/stock'
import { MarketPeriodToggle } from '@/components/MarketPeriodToggle'
import { AmountInput } from '@/components/AmountInput'
import { StockGrid } from '@/components/StockGrid'
import { StockDetailDrawer } from '@/components/StockDetailDrawer'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { DateRangePicker } from '@/components/DateRangePicker'
import { formatCurrency, formatPercent } from '@/lib/format'
import { convertCurrency } from '@/lib/fx'

function toISODate(d: Date) {
  return d.toISOString().split('T')[0]
}

export default function Home() {
  const [market, setMarket] = useState<Market>('NGX')
  const [period, setPeriod] = useState<Period>('1Y')
  const [customFrom, setCustomFrom] = useState(() => toISODate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)))
  const [customTo, setCustomTo] = useState(() => toISODate(new Date()))
  const [displayCurrency, setDisplayCurrency] = useState<'NGN' | 'USD'>('NGN')
  const [amount, setAmount] = useState(10_000_000)
  const [stocks, setStocks] = useState<StockResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStock, setSelectedStock] = useState<StockResult | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchStocks = useCallback(async () => {
    if (period === 'custom' && (!customFrom || !customTo)) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ market, period })
      if (period === 'custom') {
        params.set('from', customFrom)
        params.set('to', customTo)
      }
      const res = await fetch(`/api/top-stocks?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data: StockResult[] = await res.json()
      setStocks(data)
    } catch {
      setError('Could not load stock data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [market, period, customFrom, customTo])

  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  function handleMarketChange(m: Market) {
    const nativeCurrency = m === 'NGX' ? 'NGN' : 'USD'
    setAmount(Math.round(convertCurrency(amount, displayCurrency, nativeCurrency)))
    setMarket(m)
    setDisplayCurrency(nativeCurrency)
  }

  function handleCurrencyChange(c: 'NGN' | 'USD') {
    setAmount(Math.round(convertCurrency(amount, displayCurrency, c)))
    setDisplayCurrency(c)
  }

  function handleSelectStock(stock: StockResult) {
    setSelectedStock(stock)
    setDrawerOpen(true)
  }

  const topStock = stocks[0]

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <main className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
          {/* Header */}
          <div
            className="sticky top-0 z-20 px-5 py-4"
            style={{
              background: 'rgba(4,8,18,0.8)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-base font-semibold tracking-tight text-white">StockLens</h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  NGX & US returns estimator
                </p>
              </div>
              <div
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
              >
                Educational only
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* Amount input */}
            <AmountInput
              value={amount}
              onChange={setAmount}
              displayCurrency={displayCurrency}
              onCurrencyChange={handleCurrencyChange}
            />

            {/* Top-stock teaser (only when data loaded) */}
            {topStock && !loading && (
              <div
                className="rounded-2xl px-5 py-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
              >
                <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                  Top performer {period === 'custom' ? `from ${customFrom} to ${customTo}` : `over the last ${period}`}
                </p>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-white font-medium">{topStock.name}</span> would have turned{' '}
                  <span className="text-white tabular-nums">{formatCurrency(amount, displayCurrency)}</span> into{' '}
                  <span className="text-white font-medium tabular-nums">
                    {formatCurrency(Math.round(amount * topStock.historicalReturnFactor), displayCurrency)}
                  </span>
                  <span
                    className="ml-2 text-sm font-medium tabular-nums"
                    style={{ color: topStock.historicalReturn >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}
                  >
                    {formatPercent(topStock.historicalReturn * 100)}
                  </span>
                </p>
              </div>
            )}

            {/* Market + Period toggle */}
            <MarketPeriodToggle
              market={market}
              period={period}
              onMarketChange={handleMarketChange}
              onPeriodChange={setPeriod}
            />

            {/* Custom date range picker */}
            {period === 'custom' && (
              <DateRangePicker
                from={customFrom}
                to={customTo}
                onFromChange={setCustomFrom}
                onToChange={setCustomTo}
              />
            )}

            {/* Stock grid */}
            <StockGrid
              stocks={stocks}
              amount={amount}
              displayCurrency={displayCurrency}
              isLoading={loading}
              error={error}
              onSelectStock={handleSelectStock}
            />

            {/* Disclaimer */}
            <div className="text-center py-4">
              <p className="text-xs max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Returns shown are historical and calculated from Yahoo Finance data.
                Past performance does not guarantee future results.
                This tool is for educational purposes only — not financial advice.
                {displayCurrency !== (market === 'NGX' ? 'NGN' : 'USD') && (
                  <> Currency conversion uses an approximate rate and is for reference only.</>
                )}
              </p>
            </div>
          </div>

          {/* Detail drawer */}
          <StockDetailDrawer
            stock={selectedStock}
            amount={amount}
            displayCurrency={displayCurrency}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        </main>
      </TooltipProvider>
    </MotionConfig>
  )
}
