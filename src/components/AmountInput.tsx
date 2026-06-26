'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import type { Market } from '@/types/stock'

interface AmountInputProps {
  value: number
  onChange: (amount: number) => void
  market: Market
}

const NGN_MIN = 100_000
const NGN_MAX = 100_000_000
const USD_MIN = 100
const USD_MAX = 100_000

function logToLinear(logVal: number, min: number, max: number): number {
  return Math.round(min * Math.pow(max / min, logVal / 100))
}

function linearToLog(val: number, min: number, max: number): number {
  if (val <= min) return 0
  if (val >= max) return 100
  return (Math.log(val / min) / Math.log(max / min)) * 100
}

function formatInput(value: number, market: Market): string {
  const prefix = market === 'NGX' ? '₦' : '$'
  return `${prefix}${value.toLocaleString()}`
}

function parseInput(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, '')
  return parseInt(digits || '0', 10)
}

export function AmountInput({ value, onChange, market }: AmountInputProps) {
  const min = market === 'NGX' ? NGN_MIN : USD_MIN
  const max = market === 'NGX' ? NGN_MAX : USD_MAX
  const sliderVal = linearToLog(value, min, max)
  const currency = market === 'NGX' ? '₦' : '$'

  function handleSlider([pos]: number[]) {
    onChange(logToLinear(pos, min, max))
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseInput(e.target.value)
    onChange(Math.min(Math.max(raw, min), max))
  }

  const quickAmounts =
    market === 'NGX'
      ? [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000]
      : [500, 1_000, 5_000, 10_000, 50_000]

  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          If you invested
        </p>
        <input
          type="text"
          value={formatInput(value, market)}
          onChange={handleInput}
          className="w-full bg-transparent text-4xl font-bold tracking-tight outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* Logarithmic slider */}
      <SliderPrimitive.Root
        min={0}
        max={100}
        step={0.1}
        value={[sliderVal]}
        onValueChange={handleSlider}
        className="relative flex items-center w-full h-6 cursor-pointer"
      >
        <SliderPrimitive.Track
          className="relative grow rounded-full h-1.5"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <SliderPrimitive.Range
            className="absolute h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00E5A0, #3D7BFF)' }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block w-5 h-5 rounded-full shadow-lg outline-none focus:ring-2 focus:ring-[#00E5A0] transition-transform hover:scale-110"
          style={{ background: '#ffffff' }}
        />
      </SliderPrimitive.Root>

      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>{currency}{(min / 1000).toFixed(0)}K</span>
        <span>{currency}{(max / 1_000_000).toFixed(0)}M</span>
      </div>

      {/* Quick amounts */}
      <div className="flex flex-wrap gap-2">
        {quickAmounts.map(amt => (
          <button
            key={amt}
            onClick={() => onChange(amt)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: value === amt ? 'rgba(0,229,160,0.15)' : 'var(--bg-elevated)',
              color: value === amt ? '#00E5A0' : 'var(--text-secondary)',
              border: `1px solid ${value === amt ? 'rgba(0,229,160,0.4)' : 'var(--border-color)'}`,
            }}
          >
            {market === 'NGX'
              ? amt >= 1_000_000
                ? `₦${amt / 1_000_000}M`
                : `₦${amt / 1_000}K`
              : amt >= 1_000
              ? `$${amt / 1_000}K`
              : `$${amt}`}
          </button>
        ))}
      </div>
    </div>
  )
}
