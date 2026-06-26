'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Market, Period, StockResult } from '@/types/stock'
import { MarketPeriodToggle } from '@/components/MarketPeriodToggle'
import { AmountInput } from '@/components/AmountInput'
import { StockGrid } from '@/components/StockGrid'
import { StockDetailDrawer } from '@/components/StockDetailDrawer'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { DateRangePicker } from '@/components/DateRangePicker'
import { formatCurrency } from '@/lib/format'

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
    setMarket(m)
    const nativeCurrency = m === 'NGX' ? 'NGN' : 'USD'
    setDisplayCurrency(nativeCurrency)
    setAmount(nativeCurrency === 'NGN' ? 10_000_000 : 10_000)
  }

  function handleCurrencyChange(c: 'NGN' | 'USD') {
    setDisplayCurrency(c)
    setAmount(c === 'NGN' ? 10_000_000 : 10_000)
  }

  function handleSelectStock(stock: StockResult) {
    setSelectedStock(stock)
    setDrawerOpen(true)
  }

  const topStock = stocks[0]

  return (
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
              <h1 className="text-lg font-bold text-white">StockLens</h1>
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
              style={{
                background: 'linear-gradient(135deg, rgba(0,229,160,0.08), rgba(61,123,255,0.08))',
                border: '1px solid rgba(0,229,160,0.2)',
              }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#00E5A0' }}>
                🏆 Top performer this period
              </p>
              <p className="text-white font-bold">
                {topStock.name} would have turned your{' '}
                <span style={{ color: '#00E5A0' }}>
                  {formatCurrency(amount, displayCurrency)}
                </span>{' '}
                into{' '}
                <span style={{ color: '#00E5A0' }}>
                  {formatCurrency(Math.round(amount * topStock.historicalReturnFactor), displayCurrency)}
                </span>{' '}
                {period === 'custom' ? `from ${customFrom} to ${customTo}` : `over the last ${period}`} — a{' '}
                <span style={{ color: '#00E5A0' }}>
                  +{(topStock.historicalReturn * 100).toFixed(1)}% return
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
  )
}
