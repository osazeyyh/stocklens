export type Market = 'NGX' | 'US'
export type StockTag = 'quick-trade' | 'long-hold' | 'hidden-gem'
export type ChartRange = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y'
export type Period = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'custom'

export interface HistoricalPoint {
  date: string
  close: number
  volume: number
}

export interface ConfidenceScore {
  score: number
  label: 'High' | 'Medium' | 'Low'
  sharpeRatio: number
  positiveMonthsPct: number
  maxDrawdown: number
}

export interface StockResult {
  ticker: string
  name: string
  sector: string
  market: Market
  currentPrice: number
  historicalReturn: number
  historicalReturnFactor: number
  confidence: ConfidenceScore
  sparkline: number[]
  currency: 'NGN' | 'USD'
  tag: StockTag
  isHiddenGem: boolean
  optimalHoldMonths: number
  winRate: number
}

export interface StockDetail {
  ticker: string
  name: string
  sector: string
  market: Market
  currency: 'NGN' | 'USD'
  currentPrice: number
  dayChange: number
  dayChangePct: number
  marketCap?: number
  peRatio?: number
  dividendYield?: number
  week52High?: number
  week52Low?: number
  historical: HistoricalPoint[]
}

export interface StockInfo {
  ticker: string
  name: string
  sector: string
  market: Market
  isHiddenGem?: boolean
}
