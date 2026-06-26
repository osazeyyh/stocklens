import type { ConfidenceScore } from '@/types/stock'
import { EducationCard } from './EducationCard'

interface ConfidenceBarProps {
  confidence: ConfidenceScore
  compact?: boolean
}

const LABEL_COLORS = {
  High: '#00E5A0',
  Medium: '#FFB800',
  Low: '#FF4D6A',
}

export function ConfidenceBar({ confidence, compact = false }: ConfidenceBarProps) {
  const color = LABEL_COLORS[confidence.label]
  const bgColor =
    confidence.label === 'High'
      ? 'rgba(0,229,160,0.15)'
      : confidence.label === 'Medium'
      ? 'rgba(255,184,0,0.15)'
      : 'rgba(255,77,106,0.15)'

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${confidence.score}%`, background: color }}
          />
        </div>
        <span className="text-xs font-semibold tabular-nums" style={{ color, minWidth: 32 }}>
          {confidence.score}%
        </span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
          style={{ background: bgColor, color }}
        >
          {confidence.label}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <EducationCard term="confidence">Confidence</EducationCard>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tabular-nums" style={{ color }}>
            {confidence.score}%
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ background: bgColor, color }}
          >
            {confidence.label}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${confidence.score}%`, background: color }}
        />
      </div>
    </div>
  )
}
