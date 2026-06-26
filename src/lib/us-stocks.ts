import type { StockInfo } from '@/types/stock'

export const US_STOCKS: StockInfo[] = [
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', market: 'US' },
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', market: 'US' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', market: 'US' },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Technology', market: 'US' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', market: 'US' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', market: 'US' },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', market: 'US' },
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Finance', market: 'US' },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Finance', market: 'US' },
  { ticker: 'LLY', name: 'Eli Lilly and Company', sector: 'Healthcare', market: 'US' },
  { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', market: 'US' },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Finance', market: 'US' },
  { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer', market: 'US' },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', market: 'US' },
  // Hidden gems — strong performers but not always in the spotlight
  { ticker: 'CELH', name: 'Celsius Holdings', sector: 'Consumer', market: 'US', isHiddenGem: true },
  { ticker: 'AXON', name: 'Axon Enterprise', sector: 'Technology', market: 'US', isHiddenGem: true },
  { ticker: 'DECK', name: 'Deckers Outdoor', sector: 'Consumer', market: 'US', isHiddenGem: true },
  { ticker: 'FICO', name: 'Fair Isaac Corporation', sector: 'Technology', market: 'US', isHiddenGem: true },
  { ticker: 'PODD', name: 'Insulet Corporation', sector: 'Healthcare', market: 'US', isHiddenGem: true },
  { ticker: 'TMDX', name: 'TransMedics Group', sector: 'Healthcare', market: 'US', isHiddenGem: true },
]
