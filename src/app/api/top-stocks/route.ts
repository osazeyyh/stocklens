import { NextRequest, NextResponse } from 'next/server'
import { subYears, subMonths } from 'date-fns'
import { NGX_STOCKS } from '@/lib/ngx-stocks'
import { US_STOCKS } from '@/lib/us-stocks'
import { fetchHistoricalData } from '@/lib/yahoo-finance'
import { computeConfidence } from '@/lib/confidence'
import { computeOptimalHoldPeriod } from '@/lib/calculations'
import type { Market, Period, StockResult, StockTag } from '@/types/stock'

function classifyTag(
  returnPct: number,
  history: { date: string; close: number; volume: number }[],
  confidence: { score: number },
  isHiddenGem: boolean,
): StockTag {
  if (isHiddenGem && returnPct > 20) return 'hidden-gem'

  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const recent = sorted.slice(-20)
  const older = sorted.slice(-60, -20)

  if (recent.length > 0 && older.length > 0) {
    const recentReturn =
      (recent[recent.length - 1].close - recent[0].close) / recent[0].close
    const avgRecentVol = recent.reduce((s, p) => s + p.volume, 0) / recent.length
    const avgOlderVol = older.reduce((s, p) => s + p.volume, 0) / older.length
    const volumeSpike = avgOlderVol > 0 ? avgRecentVol / avgOlderVol : 1

    if (recentReturn > 0.06 && volumeSpike > 1.25) return 'quick-trade'
  }

  return 'long-hold'
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const market = (searchParams.get('market') ?? 'NGX') as Market
  const period = (searchParams.get('period') ?? '1Y') as Period

  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')

  const monthlyPeriods: Record<string, number> = { '1M': 1, '3M': 3, '6M': 6 }
  const fromDate = fromParam
    ? new Date(fromParam)
    : period in monthlyPeriods
      ? subMonths(new Date(), monthlyPeriods[period])
      : subYears(new Date(), period === '1Y' ? 1 : period === '3Y' ? 3 : 5)
  const toDate = toParam ? new Date(toParam) : new Date()

  const stocks = market === 'NGX' ? NGX_STOCKS : US_STOCKS
  const currency = market === 'NGX' ? 'NGN' : 'USD'

  const results = await Promise.allSettled(
    stocks.map(async (stock): Promise<StockResult | null> => {
      const history = await fetchHistoricalData(stock.ticker, fromDate)
      const minPoints = period in monthlyPeriods || fromParam ? 5 : 30
      if (history.length < minPoints) return null

      const sorted = [...history]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .filter(p => new Date(p.date) <= toDate)
      if (sorted.length < minPoints) return null

      const startPrice = sorted[0].close
      const endPrice = sorted[sorted.length - 1].close
      if (startPrice <= 0) return null

      const historicalReturn = (endPrice - startPrice) / startPrice
      const historicalReturnFactor = endPrice / startPrice

      const confidence = computeConfidence(history)
      const optimal = computeOptimalHoldPeriod(history)

      // Sparkline: last 12 data points spaced evenly
      const step = Math.max(1, Math.floor(sorted.length / 12))
      const sparkline = sorted
        .filter((_, i) => i % step === 0)
        .slice(-12)
        .map(p => p.close)

      const tag = classifyTag(historicalReturn * 100, history, confidence, stock.isHiddenGem ?? false)

      return {
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector,
        market,
        currentPrice: endPrice,
        historicalReturn,
        historicalReturnFactor,
        confidence,
        sparkline,
        currency,
        tag,
        isHiddenGem: stock.isHiddenGem ?? false,
        optimalHoldMonths: optimal.months,
        winRate: optimal.winRate,
      }
    }),
  )

  const valid: StockResult[] = results
    .filter((r): r is PromiseFulfilledResult<StockResult | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((v): v is StockResult => v !== null)
    .sort((a, b) => b.historicalReturn - a.historicalReturn)

  return NextResponse.json(valid, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
  })
}
