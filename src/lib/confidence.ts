import type { ConfidenceScore } from '@/types/stock'
import { computeMonthlyReturns } from './calculations'
import type { HistoricalPoint } from '@/types/stock'

function mean(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length
}

function stdDev(arr: number[]): number {
  if (arr.length < 2) return 0
  const avg = mean(arr)
  const variance = arr.reduce((sum, v) => sum + (v - avg) ** 2, 0) / arr.length
  return Math.sqrt(variance)
}

function computeMaxDrawdown(returns: number[]): number {
  let peak = 1
  let value = 1
  let maxDD = 0
  for (const r of returns) {
    value *= 1 + r
    if (value > peak) peak = value
    const dd = (peak - value) / peak
    if (dd > maxDD) maxDD = dd
  }
  return maxDD
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function trendScore(returns: number[]): number {
  if (returns.length < 4) return 0.5
  const firstHalf = mean(returns.slice(0, Math.floor(returns.length / 2)))
  const secondHalf = mean(returns.slice(Math.floor(returns.length / 2)))
  // If recent performance is improving vs earlier, score > 0.5
  return secondHalf > firstHalf ? 0.75 : 0.25
}

export function computeConfidence(history: HistoricalPoint[]): ConfidenceScore {
  const returns = computeMonthlyReturns(history)

  if (returns.length < 6) {
    return { score: 40, label: 'Low', sharpeRatio: 0, positiveMonthsPct: 0, maxDrawdown: 0 }
  }

  const avgReturn = mean(returns)
  const sd = stdDev(returns)
  const riskFreeMonthly = 0.005 // ~6% annual

  const sharpeRatio = sd > 0 ? (avgReturn - riskFreeMonthly) / sd : 0
  const positiveMonthsPct = returns.filter(r => r > 0).length / returns.length
  const maxDrawdown = computeMaxDrawdown(returns)

  // Weighted composite score
  const sharpeComponent = clamp((sharpeRatio + 1) / 3, 0, 1) // normalize [-1, 2] → [0, 1]
  const consistencyComponent = positiveMonthsPct
  const drawdownComponent = 1 - clamp(maxDrawdown, 0, 1)
  const trendComponent = trendScore(returns)

  const rawScore =
    sharpeComponent * 35 +
    consistencyComponent * 30 +
    drawdownComponent * 20 +
    trendComponent * 15

  const score = Math.round(clamp(rawScore, 0, 100))

  const label: ConfidenceScore['label'] =
    score >= 70 ? 'High' : score >= 45 ? 'Medium' : 'Low'

  return { score, label, sharpeRatio, positiveMonthsPct: positiveMonthsPct * 100, maxDrawdown }
}
