'use client'

interface SparklineProps {
  data: number[]
  positive: boolean
  height?: number
}

export function Sparkline({ data, positive, height = 40 }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 100
  const h = height

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h * 0.85
    return `${x},${y}`
  })

  const path = `M ${points.join(' L ')}`
  const fillPath = `${path} L ${w},${h} L 0,${h} Z`

  const color = positive ? '#00E5A0' : '#FF4D6A'
  const fillId = `spark-fill-${positive ? 'green' : 'red'}`

  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${fillId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}
