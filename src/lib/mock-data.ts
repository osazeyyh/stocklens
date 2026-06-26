import type { HistoricalPoint } from '@/types/stock'

interface StockSeed {
  startPrice: number
  annualReturn: number
  volatility: number
  currency: 'NGN' | 'USD'
}

// Approximate historical parameters based on known market performance
const STOCK_SEEDS: Record<string, StockSeed> = {
  // NGX stocks (prices in Naira)
  'DANGCEM.LG': { startPrice: 320, annualReturn: 0.28, volatility: 0.32, currency: 'NGN' },
  'MTNN.LG': { startPrice: 195, annualReturn: 0.41, volatility: 0.28, currency: 'NGN' },
  'GTCO.LG': { startPrice: 28, annualReturn: 0.55, volatility: 0.35, currency: 'NGN' },
  'ZENITHBANK.LG': { startPrice: 35, annualReturn: 0.48, volatility: 0.33, currency: 'NGN' },
  'ACCESSCORP.LG': { startPrice: 18, annualReturn: 0.38, volatility: 0.36, currency: 'NGN' },
  'AIRTELAFRI.LG': { startPrice: 1200, annualReturn: 0.22, volatility: 0.30, currency: 'NGN' },
  'BUACEMENT.LG': { startPrice: 92, annualReturn: 0.19, volatility: 0.28, currency: 'NGN' },
  'SEPLAT.LG': { startPrice: 1580, annualReturn: 0.35, volatility: 0.40, currency: 'NGN' },
  'UBA.LG': { startPrice: 22, annualReturn: 0.62, volatility: 0.34, currency: 'NGN' },
  'FBNH.LG': { startPrice: 14, annualReturn: 0.45, volatility: 0.38, currency: 'NGN' },
  'STANBIC.LG': { startPrice: 58, annualReturn: 0.31, volatility: 0.29, currency: 'NGN' },
  'NESTLE.LG': { startPrice: 900, annualReturn: -0.12, volatility: 0.25, currency: 'NGN' },
  'FLOURMILL.LG': { startPrice: 42, annualReturn: 0.23, volatility: 0.31, currency: 'NGN' },
  // Hidden gems — higher vol, some with great returns
  'BERGER.LG': { startPrice: 8.5, annualReturn: 0.82, volatility: 0.55, currency: 'NGN' },
  'FIDSON.LG': { startPrice: 12, annualReturn: 0.38, volatility: 0.48, currency: 'NGN' },
  'LEARNAFRI.LG': { startPrice: 3.2, annualReturn: 0.37, volatility: 0.52, currency: 'NGN' },
  'UPDCREIT.LG': { startPrice: 3.8, annualReturn: 0.45, volatility: 0.42, currency: 'NGN' },
  'ABCTRANS.LG': { startPrice: 1.4, annualReturn: 0.60, volatility: 0.60, currency: 'NGN' },
  'FTNCOCOA.LG': { startPrice: 2.1, annualReturn: 0.63, volatility: 0.65, currency: 'NGN' },
  'CHAMS.LG': { startPrice: 0.8, annualReturn: 0.25, volatility: 0.70, currency: 'NGN' },
  'CAVERTON.LG': { startPrice: 1.5, annualReturn: 0.15, volatility: 0.58, currency: 'NGN' },
  'SCOA.LG': { startPrice: 2.8, annualReturn: 0.46, volatility: 0.55, currency: 'NGN' },
  'MECURE.LG': { startPrice: 3.5, annualReturn: 0.51, volatility: 0.52, currency: 'NGN' },
  'IEICOCHA.LG': { startPrice: 0.9, annualReturn: 0.64, volatility: 0.68, currency: 'NGN' },
  'ZICHIS.LG': { startPrice: 1.2, annualReturn: 0.52, volatility: 0.60, currency: 'NGN' },
  // US stocks (prices in USD)
  'NVDA': { startPrice: 45, annualReturn: 2.10, volatility: 0.60, currency: 'USD' },
  'AAPL': { startPrice: 165, annualReturn: 0.32, volatility: 0.25, currency: 'USD' },
  'MSFT': { startPrice: 310, annualReturn: 0.38, volatility: 0.26, currency: 'USD' },
  'META': { startPrice: 280, annualReturn: 1.15, volatility: 0.45, currency: 'USD' },
  'AMZN': { startPrice: 95, annualReturn: 0.75, volatility: 0.35, currency: 'USD' },
  'GOOGL': { startPrice: 102, annualReturn: 0.45, volatility: 0.28, currency: 'USD' },
  'TSLA': { startPrice: 210, annualReturn: 0.22, volatility: 0.75, currency: 'USD' },
  'JPM': { startPrice: 145, annualReturn: 0.38, volatility: 0.24, currency: 'USD' },
  'V': { startPrice: 220, annualReturn: 0.22, volatility: 0.20, currency: 'USD' },
  'LLY': { startPrice: 350, annualReturn: 0.85, volatility: 0.35, currency: 'USD' },
  'AVGO': { startPrice: 580, annualReturn: 0.90, volatility: 0.38, currency: 'USD' },
  'MA': { startPrice: 380, annualReturn: 0.24, volatility: 0.22, currency: 'USD' },
  'COST': { startPrice: 480, annualReturn: 0.42, volatility: 0.20, currency: 'USD' },
  'UNH': { startPrice: 490, annualReturn: 0.12, volatility: 0.25, currency: 'USD' },
  'CELH': { startPrice: 95, annualReturn: 0.80, volatility: 0.65, currency: 'USD' },
  'AXON': { startPrice: 170, annualReturn: 0.95, volatility: 0.50, currency: 'USD' },
  'DECK': { startPrice: 420, annualReturn: 0.72, volatility: 0.42, currency: 'USD' },
  'FICO': { startPrice: 880, annualReturn: 0.65, volatility: 0.38, currency: 'USD' },
  'PODD': { startPrice: 270, annualReturn: 0.45, volatility: 0.40, currency: 'USD' },
  'TMDX': { startPrice: 50, annualReturn: 1.20, volatility: 0.80, currency: 'USD' },
}

// Seeded pseudo-random using a simple LCG
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

// Box-Muller normal distribution
function normalRandom(rng: () => number): number {
  const u1 = Math.max(1e-10, rng())
  const u2 = rng()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

export function generateMockHistory(ticker: string, fromDate: Date, toDate: Date = new Date()): HistoricalPoint[] {
  const seed = STOCK_SEEDS[ticker]
  if (!seed) {
    // Generic fallback
    const fallback: StockSeed = { startPrice: 100, annualReturn: 0.12, volatility: 0.25, currency: 'USD' }
    return generateWithSeed(ticker, fallback, fromDate, toDate)
  }
  return generateWithSeed(ticker, seed, fromDate, toDate)
}

function generateWithSeed(ticker: string, seed: StockSeed, fromDate: Date, toDate: Date): HistoricalPoint[] {
  const tradingDayMs = 24 * 60 * 60 * 1000
  const totalDays = Math.floor((toDate.getTime() - fromDate.getTime()) / tradingDayMs)
  if (totalDays < 2) return []

  const dailyReturn = seed.annualReturn / 252
  const dailyVol = seed.volatility / Math.sqrt(252)

  // Use ticker as seed for reproducibility
  const tickerSeed = ticker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rng = seededRandom(tickerSeed * 1234567)

  const points: HistoricalPoint[] = []
  let price = seed.startPrice
  let date = new Date(fromDate)

  for (let i = 0; i < totalDays; i++) {
    const dayOfWeek = date.getDay()
    // Skip weekends
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const shock = normalRandom(rng)
      price = price * Math.exp(dailyReturn + dailyVol * shock)
      price = Math.max(price, seed.startPrice * 0.1) // floor at 10% of start

      const volume = Math.floor(1_000_000 + rng() * 5_000_000)
      points.push({
        date: date.toISOString().split('T')[0],
        close: parseFloat(price.toFixed(seed.currency === 'NGN' ? 2 : 4)),
        volume,
      })
    }
    date = new Date(date.getTime() + tradingDayMs)
  }

  return points
}

export function generateMockQuote(ticker: string) {
  const seed = STOCK_SEEDS[ticker]
  if (!seed) return null

  // Project to today from a known reference point (use 2 years of growth)
  const rng = seededRandom(ticker.length * 9999)
  const years = 2
  const growth = Math.exp(seed.annualReturn * years)
  const currentPrice = seed.startPrice * growth * (1 + (rng() - 0.5) * 0.1)
  const dayChangePct = (rng() - 0.45) * 3
  const dayChange = currentPrice * dayChangePct / 100

  return {
    currentPrice: parseFloat(currentPrice.toFixed(seed.currency === 'NGN' ? 2 : 4)),
    dayChange: parseFloat(dayChange.toFixed(2)),
    dayChangePct: parseFloat(dayChangePct.toFixed(2)),
    marketCap: currentPrice * 1_000_000_000 * (seed.currency === 'NGN' ? 5 : 2) * (rng() + 0.5),
    peRatio: 8 + rng() * 22,
    dividendYield: seed.annualReturn > 0.3 ? undefined : 1 + rng() * 4,
    week52High: currentPrice * (1 + rng() * 0.3),
    week52Low: currentPrice * (1 - rng() * 0.3),
    currency: seed.currency,
    shortName: ticker,
  }
}
