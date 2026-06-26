import type { StockDetail } from '@/types/stock'
import { formatLargeNumber, formatCurrency, formatPercent } from '@/lib/format'
import { convertCurrency } from '@/lib/fx'
import { EducationCard } from './EducationCard'

interface StockMetaProps {
  detail: StockDetail
  displayCurrency: 'NGN' | 'USD'
}

export function StockMeta({ detail, displayCurrency }: StockMetaProps) {
  function conv(v: number) {
    return convertCurrency(v, detail.currency, displayCurrency)
  }

  const currentPrice = conv(detail.currentPrice)
  const dayChange = conv(detail.dayChange)

  const items = [
    {
      label: 'Current Price',
      value: formatCurrency(currentPrice, displayCurrency),
      sub: `${dayChange >= 0 ? '+' : ''}${formatCurrency(Math.abs(dayChange), displayCurrency, true)} (${formatPercent(detail.dayChangePct)})`,
      subColor: dayChange >= 0 ? '#00E5A0' : '#FF4D6A',
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
      value: detail.marketCap ? formatLargeNumber(conv(detail.marketCap), displayCurrency) : '—',
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
      value: detail.week52High ? formatCurrency(conv(detail.week52High), displayCurrency, true) : '—',
      sub: null,
      subColor: null,
      edu: null,
    },
    {
      label: '52W Low',
      value: detail.week52Low ? formatCurrency(conv(detail.week52Low), displayCurrency, true) : '—',
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
