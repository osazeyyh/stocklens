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

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${confidence.score}%`, background: color }}
          />
        </div>
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-medium" style={{ color }}>{confidence.label}</span> · {confidence.score}
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
          <span className="text-sm font-medium" style={{ color }}>
            {confidence.label}
          </span>
          <span className="text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
            {confidence.score}/100
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${confidence.score}%`, background: color }}
        />
      </div>
    </div>
  )
}
