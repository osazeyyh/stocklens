export function formatNGN(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`
    return `₦${value.toFixed(0)}`
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatUSD(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
    return `$${value.toFixed(2)}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrency(value: number, currency: 'NGN' | 'USD', compact = false): string {
  return currency === 'NGN' ? formatNGN(value, compact) : formatUSD(value, compact)
}

export function formatPercent(value: number, showSign = true): string {
  const formatted = `${Math.abs(value).toFixed(1)}%`
  if (!showSign) return formatted
  return value >= 0 ? `+${formatted}` : `-${formatted}`
}

export function formatLargeNumber(value: number, currency: 'NGN' | 'USD'): string {
  const prefix = currency === 'NGN' ? '₦' : '$'
  if (value >= 1_000_000_000_000) return `${prefix}${(value / 1_000_000_000_000).toFixed(2)}T`
  if (value >= 1_000_000_000) return `${prefix}${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(2)}M`
  return formatCurrency(value, currency)
}
