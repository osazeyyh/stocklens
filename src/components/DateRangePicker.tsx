'use client'

interface DateRangePickerProps {
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
}

const today = new Date().toISOString().split('T')[0]

export function DateRangePicker({ from, to, onFromChange, onToChange }: DateRangePickerProps) {
  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl px-5 py-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
    >
      <p className="text-sm shrink-0" style={{ color: 'var(--text-secondary)' }}>
        Date range
      </p>

      <div className="flex items-center gap-2 flex-1 flex-wrap">
        <DateInput label="From" value={from} max={to} onChange={onFromChange} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>to</span>
        <DateInput label="To" value={to} min={from} max={today} onChange={onToChange} />
      </div>
    </div>
  )
}

function DateInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: string
  min?: string
  max?: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(e.target.value)}
        className="rounded-lg px-3 py-1.5 text-sm tabular-nums text-white outline-none border border-[var(--border-color)] transition-colors duration-150 focus:border-white/30"
        style={{
          background: 'var(--bg-elevated)',
          colorScheme: 'dark',
        }}
      />
    </label>
  )
}
