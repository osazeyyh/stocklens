import type { StockDetail } from '@/types/stock'
import { formatLargeNumber, formatCurrency, formatPercent } from '@/lib/format'
import { EducationCard } from './EducationCard'

interface StockMetaProps {
  detail: StockDetail
}

export function StockMeta({ detail }: StockMetaProps) {
  const items = [
    {
      label: 'Current Price',
      value: formatCurrency(detail.currentPrice, detail.currency),
      sub: `${detail.dayChange >= 0 ? '+' : ''}${detail.dayChange.toFixed(2)} (${formatPercent(detail.dayChangePct)})`,
      subColor: detail.dayChange >= 0 ? '#00E5A0' : '#FF4D6A',
      edu: null,
    },
    {
      label: 'P/E Ratio',
      value: detail.peRatio ? detail.peRatio.toFixed(1) : '—',
      sub: null,
      subColor: null,
      edu: 'pe-ratio' as const,
    },
    {
      label: 'Market Cap',
      value: detail.marketCap ? formatLargeNumber(detail.marketCap, detail.currency) : '—',
      sub: null,
      subColor: null,
      edu: 'market-cap' as const,
    },
    {
      label: 'Dividend Yield',
      value: detail.dividendYield ? `${detail.dividendYield.toFixed(2)}%` : '—',
      sub: null,
      subColor: null,
      edu: 'dividend' as const,
    },
    {
      label: '52W High',
      value: detail.week52High ? formatCurrency(detail.week52High, detail.currency, true) : '—',
      sub: null,
      subColor: null,
      edu: null,
    },
    {
      label: '52W Low',
      value: detail.week52Low ? formatCurrency(detail.week52Low, detail.currency, true) : '—',
      sub: null,
      subColor: null,
      edu: null,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(item => (
        <div
          key={item.label}
          className="rounded-xl p-3 space-y-1"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              {item.label}
            </span>
            {item.edu && <EducationCard term={item.edu} />}
          </div>
          <p className="text-sm font-bold text-white">{item.value}</p>
          {item.sub && (
            <p className="text-[11px] font-medium" style={{ color: item.subColor ?? 'var(--text-muted)' }}>
              {item.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
