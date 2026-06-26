// Approximate NGN/USD exchange rate — for display purposes only
export const USD_TO_NGN = 1600

export function convertCurrency(
  value: number,
  from: 'NGN' | 'USD',
  to: 'NGN' | 'USD',
): number {
  if (from === to) return value
  if (from === 'USD' && to === 'NGN') return value * USD_TO_NGN
  return value / USD_TO_NGN
}
