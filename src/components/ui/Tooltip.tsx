'use client'

import * as RadixTooltip from '@radix-ui/react-tooltip'

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <RadixTooltip.Provider delayDuration={300}>{children}</RadixTooltip.Provider>
}

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className="z-50 max-w-xs rounded-xl p-3 text-sm"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
          sideOffset={6}
        >
          {content}
          <RadixTooltip.Arrow style={{ fill: 'var(--bg-elevated)' }} />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
