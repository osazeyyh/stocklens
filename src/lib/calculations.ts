import type { HistoricalPoint } from '@/types/stock'

export interface ReturnProjection {
  startPrice: number
  currentPrice: number
  shares: number
  startValue: number
  currentValue: number
  absoluteReturn: number
  percentReturn: number
  cagr: number
  daysHeld: number
}

export interface OptimalHold {
  months: number
  avgReturn: number
  winRate: number
}

export function projectReturn(
  history: HistoricalPoint[],
  investmentAmount: number,
  startDate: Date,
): ReturnProjection | null {
  if (history.length < 2) return null

  const startMs = startDate.getTime()
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const startPoint = sorted.find(p => new Date(p.date).getTime() >= startMs) ?? sorted[0]
  const endPoint = sorted[sorted.length - 1]

  if (startPoint.close <= 0) return null

  const shares = investmentAmount / startPoint.close
  const currentValue = shares * endPoint.close
  const absoluteReturn = currentValue - investmentAmount
  const percentReturn = (absoluteReturn / investmentAmount) * 100

  const daysHeld = (new Date(endPoint.date).getTime() - new Date(startPoint.date).getTime()) / (1000 * 60 * 60 * 24)
  const yearsHeld = daysHeld / 365
  const cagr = yearsHeld > 0 ? ((currentValue / investmentAmount) ** (1 / yearsHeld) - 1) * 100 : 0

  return {
    startPrice: startPoint.close,
    currentPrice: endPoint.close,
    shares,
    startValue: investmentAmount,
    currentValue,
    absoluteReturn,
    percentReturn,
    cagr,
    daysHeld,
  }
}

export function computeMonthlyReturns(history: HistoricalPoint[]): number[] {
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  if (sorted.length < 2) return []

  // Sample ~monthly (every 21 trading days)
  const monthly: number[] = []
  const step = Math.max(1, Math.floor(sorted.length / 60))
  for (let i = step; i < sorted.length; i += step) {
    const prev = sorted[i - step].close
    const curr = sorted[i].close
    if (prev > 0) monthly.push((curr - prev) / prev)
  }
  return monthly
}

export function computeOptimalHoldPeriod(history: HistoricalPoint[]): OptimalHold {
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const periods = [3, 6, 12, 24, 36, 60]
  let best: OptimalHold = { months: 12, avgReturn: 0, winRate: 0 }

  for (const months of periods) {
    const step = Math.floor((sorted.length * months) / 60)
    if (step < 1 || sorted.length <= step) continue

    const returns: number[] = []
    for (let i = step; i < sorted.length; i += Math.max(1, Math.floor(step / 2))) {
      const start = sorted[i - step].close
      const end = sorted[i].close
      if (start > 0) returns.push((end - start) / start)
    }

    if (returns.length === 0) continue
    const avg = returns.reduce((a, b) => a + b, 0) / returns.length
    const winRate = returns.filter(r => r > 0).length / returns.length

    if (avg > best.avgReturn) {
      best = { months, avgReturn: avg * 100, winRate: winRate * 100 }
    }
  }

  return best
}

export function buildChartSeries(
  history: HistoricalPoint[],
  investmentAmount: number,
  startDate: Date,
): { date: string; portfolioValue: number; stockPrice: number }[] {
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const startMs = startDate.getTime()
  const startPoint = sorted.find(p => new Date(p.date).getTime() >= startMs) ?? sorted[0]

  if (!startPoint || startPoint.close <= 0) return []
  const shares = investmentAmount / startPoint.close

  return sorted
    .filter(p => new Date(p.date).getTime() >= new Date(startPoint.date).getTime())
    .map(p => ({
      date: p.date,
      portfolioValue: Math.round(shares * p.close),
      stockPrice: p.close,
    }))
}
