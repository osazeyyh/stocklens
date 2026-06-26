import type { HistoricalPoint } from '@/types/stock'
import { generateMockHistory, generateMockQuote } from './mock-data'

async function tryYahooChart(ticker: string, fromDate: Date, toDate: Date): Promise<HistoricalPoint[]> {
  try {
    // Dynamic import to avoid issues at build time
    const yf2 = await import('yahoo-finance2')
    const YahooFinance = (yf2 as { default: new () => { chart: (t: string, o: unknown) => Promise<{ quotes?: { date: Date; close: number | null; volume: number | null }[] }> } }).default
    const yf = new YahooFinance()
    const result = await yf.chart(ticker, {
      period1: fromDate,
      period2: toDate,
      interval: '1d',
    })
    const quotes = result.quotes ?? []
    return quotes
      .filter((q) => q.close != null)
      .map((q) => ({
        date: new Date(q.date).toISOString().split('T')[0],
        close: q.close!,
        volume: q.volume ?? 0,
      }))
  } catch {
    return []
  }
}

async function tryYahooQuote(ticker: string): Promise<QuoteData | null> {
  try {
    const yf2 = await import('yahoo-finance2')
    const YahooFinance = (yf2 as { default: new () => { quote: (t: string) => Promise<Record<string, unknown>> } }).default
    const yf = new YahooFinance()
    const q = await yf.quote(ticker)
    return {
      currentPrice: (q.regularMarketPrice as number) ?? 0,
      dayChange: (q.regularMarketChange as number) ?? 0,
      dayChangePct: (q.regularMarketChangePercent as number) ?? 0,
      marketCap: q.marketCap as number | undefined,
      peRatio: q.trailingPE as number | undefined,
      dividendYield: q.dividendYield ? ((q.dividendYield as number) * 100) : undefined,
      week52High: q.fiftyTwoWeekHigh as number | undefined,
      week52Low: q.fiftyTwoWeekLow as number | undefined,
      currency: (q.currency as string) ?? 'NGN',
      shortName: (q.shortName as string) ?? (q.longName as string) ?? ticker,
    }
  } catch {
    return null
  }
}

export interface QuoteData {
  currentPrice: number
  dayChange: number
  dayChangePct: number
  marketCap?: number
  peRatio?: number
  dividendYield?: number
  week52High?: number
  week52Low?: number
  currency: string
  shortName: string
}

export async function fetchHistoricalData(
  ticker: string,
  fromDate: Date,
  toDate: Date = new Date(),
): Promise<HistoricalPoint[]> {
  const live = await tryYahooChart(ticker, fromDate, toDate)
  if (live.length >= 30) return live
  // Fallback to realistic mock data
  return generateMockHistory(ticker, fromDate, toDate)
}

export async function fetchQuote(ticker: string): Promise<QuoteData | null> {
  const live = await tryYahooQuote(ticker)
  if (live) return live
  // Fallback to mock quote
  return generateMockQuote(ticker)
}
