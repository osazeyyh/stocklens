'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { subMonths, subYears, parseISO } from 'date-fns'
import type { HistoricalPoint } from '@/types/stock'
import { formatCurrency } from '@/lib/format'
import { buildChartSeries } from '@/lib/calculations'
import type { ChartRange } from '@/types/stock'

interface HistoricalChartProps {
  history: HistoricalPoint[]
  amount: number
  currency: 'NGN' | 'USD'
}

const RANGES: { key: ChartRange; label: string }[] = [
  { key: '1M', label: '1M' },
  { key: '3M', label: '3M' },
  { key: '6M', label: '6M' },
  { key: '1Y', label: '1Y' },
  { key: '3Y', label: '3Y' },
  { key: '5Y', label: '5Y' },
]

function getRangeStart(range: ChartRange): Date {
  const now = new Date()
  switch (range) {
    case '1M': return subMonths(now, 1)
    case '3M': return subMonths(now, 3)
    case '6M': return subMonths(now, 6)
    case '1Y': return subYears(now, 1)
    case '3Y': return subYears(now, 3)
    case '5Y': return subYears(now, 5)
  }
}

function formatAxisDate(dateStr: string, range: ChartRange): string {
  const d = parseISO(dateStr)
  if (range === '1M' || range === '3M') {
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
  }
  return d.toLocaleDateString('en-NG', { month: 'short', year: '2-digit' })
}

export function HistoricalChart({ history, amount, currency }: HistoricalChartProps) {
  const [range, setRange] = useState<ChartRange>('1Y')

  const startDate = getRangeStart(range)
  const series = useMemo(() => buildChartSeries(history, amount, startDate), [history, amount, startDate])

  const isPositive = series.length > 0 && series[series.length - 1].portfolioValue >= amount
  const color = isPositive ? '#00E5A0' : '#FF4D6A'
  const gradientId = `grad-${isPositive ? 'green' : 'red'}`

  const step = Math.max(1, Math.floor(series.length / 90))
  const sampled = series.filter((_, i) => i % step === 0 || i === series.length - 1)

  const yMin = sampled.length > 0 ? Math.min(...sampled.map(d => d.portfolioValue)) * 0.97 : 0
  const yMax = sampled.length > 0 ? Math.max(...sampled.map(d => d.portfolioValue)) * 1.03 : 0

  if (series.length === 0) {
    return (
      <div className="flex items-center justify-center h-40" style={{ color: 'var(--text-muted)' }}>
        <p className="text-sm">No data for this range</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {RANGES.map(r => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              background: range === r.key ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: range === r.key ? 'white' : 'var(--text-muted)',
              border: range === r.key ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={sampled} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={d => formatAxisDate(d, range)}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={v => formatCurrency(v, currency, true)}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <RechartsTooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              fontSize: 12,
              color: 'white',
            }}
            formatter={(value: number) => [formatCurrency(value, currency), 'Portfolio Value']}
            labelFormatter={(label: string) =>
              new Date(label).toLocaleDateString('en-NG', { dateStyle: 'medium' })
            }
          />
          <ReferenceLine
            y={amount}
            stroke="rgba(255,255,255,0.3)"
            strokeDasharray="4 4"
            label={{
              value: 'Invested',
              fill: 'rgba(255,255,255,0.4)',
              fontSize: 10,
              position: 'right',
            }}
          />
          <Area
            type="monotone"
            dataKey="portfolioValue"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: 'var(--bg-base)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
