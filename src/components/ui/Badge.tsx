import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'muted', className }: BadgeProps) {
  const styles = {
    green: 'bg-[rgba(0,229,160,0.12)] text-[#00E5A0] border border-[rgba(0,229,160,0.25)]',
    red: 'bg-[rgba(255,77,106,0.12)] text-[#FF4D6A] border border-[rgba(255,77,106,0.25)]',
    amber: 'bg-[rgba(255,184,0,0.12)] text-[#FFB800] border border-[rgba(255,184,0,0.25)]',
    blue: 'bg-[rgba(61,123,255,0.12)] text-[#3D7BFF] border border-[rgba(61,123,255,0.25)]',
    muted: 'bg-[rgba(255,255,255,0.06)] text-[#8B9BB4] border border-[rgba(255,255,255,0.1)]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
