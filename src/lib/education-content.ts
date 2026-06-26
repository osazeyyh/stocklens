export type EducationTerm =
  | 'return'
  | 'cagr'
  | 'confidence'
  | 'pe-ratio'
  | 'dividend'
  | 'market-cap'
  | 'max-drawdown'
  | 'sharpe'
  | 'quick-trade'
  | 'long-hold'
  | 'hidden-gem'
  | 'volatility'

export interface EducationContent {
  title: string
  explanation: string
  example: string
}

export const EDUCATION: Record<EducationTerm, EducationContent> = {
  return: {
    title: 'Return on Investment',
    explanation: 'How much your money grew (or shrank) compared to what you put in. A 80% return means your money nearly doubled.',
    example: 'Invest ₦10M, get back ₦18M → return is +80%.',
  },
  cagr: {
    title: 'CAGR (Compound Annual Growth Rate)',
    explanation: 'The smoothed yearly growth rate of your investment, as if it grew the same % every year. Great for comparing stocks over different time periods.',
    example: '₦10M → ₦18M over 2 years = ~34% CAGR (not 40%, because compounding).',
  },
  confidence: {
    title: 'Confidence Rating',
    explanation: 'A score (0–100%) based on this stock\'s historical consistency. High = it has repeatedly performed well with low volatility. It does NOT predict the future.',
    example: 'A 85% confidence stock has been reliably positive most months with small dips.',
  },
  'pe-ratio': {
    title: 'P/E Ratio (Price-to-Earnings)',
    explanation: 'How much investors pay per ₦1 (or $1) of company profit. A high P/E can mean the stock is expensive or that investors expect strong future growth.',
    example: 'P/E of 20 means you pay ₦20 for every ₦1 of profit the company makes.',
  },
  dividend: {
    title: 'Dividend Yield',
    explanation: 'The annual cash payout you receive as a shareholder, expressed as % of the stock price. Some investors buy stocks just for the dividend income.',
    example: 'A 3% dividend yield on ₦10M investment = ₦300,000/year in cash, before the stock price even moves.',
  },
  'market-cap': {
    title: 'Market Capitalisation',
    explanation: 'The total value of all the company\'s shares combined. Large-cap = very big company, small-cap = smaller company (often more volatile but more room to grow).',
    example: 'If a company has 1 billion shares at ₦50 each, market cap = ₦50 billion.',
  },
  'max-drawdown': {
    title: 'Maximum Drawdown',
    explanation: 'The worst peak-to-trough decline this stock has experienced. A 40% max drawdown means the stock once fell 40% before recovering. Lower is better.',
    example: 'If you invested at the peak and the stock fell 40% before recovering — that 40% is the max drawdown.',
  },
  sharpe: {
    title: 'Sharpe Ratio',
    explanation: 'A measure of return relative to risk. Higher is better. Above 1 is good, above 2 is excellent. It asks: are you being rewarded well enough for the risk you\'re taking?',
    example: 'Two stocks both return 20%, but one is very volatile. The stable one has a higher Sharpe ratio.',
  },
  'quick-trade': {
    title: 'Quick Trade',
    explanation: 'This stock is showing strong short-term momentum — it\'s been rising recently. Traders try to ride this wave for weeks or a few months, then sell. Higher risk than long holds.',
    example: 'A stock up 12% in the last 4 weeks with unusually high trading volume might be a quick trade opportunity.',
  },
  'long-hold': {
    title: 'Long Hold',
    explanation: 'This stock has shown consistent growth over years with high confidence. The strategy is to buy and hold for 1–5+ years, letting compounding do the work.',
    example: 'Holding Dangote Cement for 3 years through market fluctuations has historically rewarded patient investors.',
  },
  'hidden-gem': {
    title: 'Diamond in the Rough',
    explanation: 'A lesser-known or smaller company that\'s quietly outperforming the market without much media attention. Higher risk, but potentially higher reward if you spot them early.',
    example: 'Berger Paints quietly returned 80%+ in a year while big names got all the headlines.',
  },
  volatility: {
    title: 'Volatility',
    explanation: 'How much the stock price swings up and down. High volatility = big swings (exciting but risky). Low volatility = steady movement (less exciting, but easier to sleep at night).',
    example: 'A stock that moves ±5% daily is highly volatile. One that moves ±0.5% is low volatility.',
  },
}
