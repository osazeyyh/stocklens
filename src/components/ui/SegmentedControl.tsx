'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: React.ReactNode }[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  const id = useId()

  return (
    <div
      role="radiogroup"
      className={cn('inline-flex rounded-xl p-1 gap-0.5', className)}
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
    >
      {options.map(o => {
        const selected = o.value === value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative rounded-lg font-medium transition-[color,transform] duration-150 ease-out active:scale-[0.97]',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-2.5 sm:px-3.5 py-1.5 text-sm',
              selected ? 'text-white' : 'text-[#8B9BB4] hover:text-white',
            )}
          >
            {selected && (
              <motion.span
                layoutId={`segment-${id}`}
                className="absolute inset-0 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
