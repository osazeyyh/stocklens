import { NextRequest, NextResponse } from 'next/server'
import { subYears } from 'date-fns'
import { fetchHistoricalData, fetchQuote } from '@/lib/yahoo-finance'
import { computeConfidence } from '@/lib/confidence'
import { computeOptimalHoldPeriod } from '@/lib/calculations'
import { NGX_STOCKS } from '@/lib/ngx-stocks'
import { US_STOCKS } from '@/lib/us-stocks'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params
  const fromDate = subYears(new Date(), 5)

  const [history, quote] = await Promise.all([
    fetchHistoricalData(ticker, fromDate),
    fetchQuote(ticker),
  ])

  if (history.length < 10 || !quote) {
    return NextResponse.json({ error: 'No data available for this ticker.' }, { status: 404 })
  }

  const allStocks = [...NGX_STOCKS, ...US_STOCKS]
  const stockInfo = allStocks.find(s => s.ticker === ticker)

  const confidence = computeConfidence(history)
  const optimal = computeOptimalHoldPeriod(history)

  return NextResponse.json(
    {
      ticker,
      name: stockInfo?.name ?? quote.shortName ?? ticker,
      sector: stockInfo?.sector ?? 'Unknown',
      market: stockInfo?.market ?? 'US',
      currency: quote.currency === 'NGN' || ticker.endsWith('.LG') ? 'NGN' : 'USD',
      currentPrice: quote.currentPrice,
      dayChange: quote.dayChange,
      dayChangePct: quote.dayChangePct,
      marketCap: quote.marketCap,
      peRatio: quote.peRatio,
      dividendYield: quote.dividendYield,
      week52High: quote.week52High,
      week52Low: quote.week52Low,
      confidence,
      optimalHoldMonths: optimal.months,
      winRate: optimal.winRate,
      historical: history,
    },
    {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' },
    },
  )
}
