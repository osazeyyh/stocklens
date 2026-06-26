'use client'

import type { HistoricalPoint } from '@/types/stock'
import { computeOptimalHoldPeriod } from '@/lib/calculations'
import { EducationCard } from './EducationCard'

interface HoldPeriodAnalysisProps {
  history: HistoricalPoint[]
}

const HOLD_PERIODS = [
  { months: 3, label: '3 months' },
  { months: 6, label: '6 months' },
  { months: 12, label: '1 year' },
  { months: 24, label: '2 years' },
  { months: 36, label: '3 years' },
]

function computeAvgReturnForPeriod(history: HistoricalPoint[], months: number): { avg: number; winRate: number } | null {
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const daysPerMonth = 21
  const step = Math.floor(months * daysPerMonth)
  if (sorted.length <= step) return null

  const returns: number[] = []
  for (let i = step; i < sorted.length; i += Math.max(1, Math.floor(step / 3))) {
    const start = sorted[i - step].close
    const end = sorted[i].close
    if (start > 0) returns.push((end - start) / start * 100)
  }

  if (returns.length === 0) return null
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length
  const winRate = (returns.filter(r => r > 0).length / returns.length) * 100
  return { avg, winRate }
}

export function HoldPeriodAnalysis({ history }: HoldPeriodAnalysisProps) {
  const optimal = computeOptimalHoldPeriod(history)

  const rows = HOLD_PERIODS.map(p => ({
    ...p,
    result: computeAvgReturnForPeriod(history, p.months),
    isOptimal: p.months === optimal.months,
  })).filter(r => r.result !== null)

  if (rows.length === 0) return null

  const maxReturn = Math.max(...rows.map(r => r.result!.avg))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-white">Hold Period Analysis</h3>
        <EducationCard term="cagr" />
      </div>

      <div className="space-y-2">
        {rows.map(row => {
          const { avg, winRate } = row.result!
          const isPositive = avg >= 0
          const barWidth = maxReturn > 0 ? Math.max(4, (Math.abs(avg) / Math.abs(maxReturn)) * 100) : 4
          const color = isPositive ? '#00E5A0' : '#FF4D6A'

          return (
            <div
              key={row.months}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: row.isOptimal ? 'rgba(0,229,160,0.08)' : 'var(--bg-elevated)',
                border: row.isOptimal ? '1px solid rgba(0,229,160,0.3)' : '1px solid transparent',
              }}
            >
              <span className="text-xs w-20 shrink-0" style={{ color: 'var(--text-secondary)' }}>
                {row.label}
              </span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, background: color }}
                />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold tabular-nums w-14 text-right" style={{ color }}>
                  {isPositive ? '+' : ''}{avg.toFixed(1)}%
                </span>
                <span className="text-[10px] w-16 text-right" style={{ color: 'var(--text-muted)' }}>
                  {winRate.toFixed(0)}% wins
                </span>
                {row.isOptimal && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,229,160,0.2)', color: '#00E5A0' }}
                  >
                    Best
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sell checklist */}
      <div
        className="mt-4 p-4 rounded-xl space-y-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          When to consider selling
        </p>
        <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {[
            'You\'ve reached your target return (e.g. +50%)',
            `Held past the historical sweet spot (~${optimal.months < 12 ? `${optimal.months} months` : `${optimal.months / 12} years`})`,
            'P/E ratio is significantly above 5-year average',
            'A better opportunity needs your capital',
            'Company fundamentals have materially changed',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span style={{ color: 'var(--accent-green)' }}>›</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[10px] pt-1" style={{ color: 'var(--text-muted)' }}>
          ⚠️ Educational only. Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  )
}
