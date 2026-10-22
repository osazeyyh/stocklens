'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'
import { SegmentedControl } from './ui/SegmentedControl'

interface AmountInputProps {
  value: number
  onChange: (amount: number) => void
  displayCurrency: 'NGN' | 'USD'
  onCurrencyChange: (c: 'NGN' | 'USD') => void
}

const BOUNDS = {
  NGN: { min: 100_000, max: 100_000_000 },
  USD: { min: 100, max: 100_000 },
}

const QUICK_AMOUNTS = {
  NGN: [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000],
  USD: [500, 1_000, 5_000, 10_000, 50_000],
}

function logToLinear(logVal: number, min: number, max: number): number {
  return Math.round(min * Math.pow(max / min, logVal / 100))
}

function linearToLog(val: number, min: number, max: number): number {
  if (val <= min) return 0
  if (val >= max) return 100
  return (Math.log(val / min) / Math.log(max / min)) * 100
}

function formatInput(value: number, currency: 'NGN' | 'USD'): string {
  const prefix = currency === 'NGN' ? '₦' : '$'
  return `${prefix}${value.toLocaleString()}`
}

function parseInput(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, '')
  return parseInt(digits || '0', 10)
}

export function AmountInput({ value, onChange, displayCurrency, onCurrencyChange }: AmountInputProps) {
  const { min, max } = BOUNDS[displayCurrency]
  const sliderVal = linearToLog(value, min, max)
  const symbol = displayCurrency === 'NGN' ? '₦' : '$'

  function handleSlider([pos]: number[]) {
    onChange(logToLinear(pos, min, max))
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseInput(e.target.value)
    onChange(Math.min(Math.max(raw, min), max))
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1 min-w-0">
          <label htmlFor="amount" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            If you had invested
          </label>
          <input
            id="amount"
            type="text"
            inputMode="numeric"
            value={formatInput(value, displayCurrency)}
            onChange={handleInput}
            className="w-full bg-transparent text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums outline-none focus-visible:outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        <SegmentedControl
          size="sm"
          className="shrink-0 mt-6"
          options={[
            { value: 'NGN', label: '₦' },
            { value: 'USD', label: '$' },
          ]}
          value={displayCurrency}
          onChange={onCurrencyChange}
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
          className="relative grow rounded-full h-1"
          style={{ background: 'var(--bg-elevated)' }}
        >
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-white" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Amount"
          className="block w-5 h-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.4)] outline-none focus-visible:ring-4 focus-visible:ring-white/20 transition-transform duration-150 ease-out active:scale-110"
        />
      </SliderPrimitive.Root>

      <div className="flex items-center justify-between text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
        <span>{symbol}{(min / 1000).toFixed(0)}K</span>
        <span>{symbol}{(max / 1_000_000) >= 1 ? `${max / 1_000_000}M` : `${max / 1_000}K`}</span>
      </div>

      {/* Quick amounts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS[displayCurrency].map(amt => (
          <button
            key={amt}
            onClick={() => onChange(amt)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium tabular-nums transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]',
              value === amt
                ? 'bg-white/10 text-white'
                : 'bg-[var(--bg-elevated)] text-[#8B9BB4] hover:text-white',
            )}
          >
            {displayCurrency === 'NGN'
              ? amt >= 1_000_000 ? `₦${amt / 1_000_000}M` : `₦${amt / 1_000}K`
              : amt >= 1_000 ? `$${amt / 1_000}K` : `$${amt}`}
          </button>
        ))}
      </div>
    </div>
  )
}
