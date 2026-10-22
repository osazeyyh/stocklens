'use client'

import { HelpCircle } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { EDUCATION, type EducationTerm } from '@/lib/education-content'

interface EducationCardProps {
  term: EducationTerm
  children?: React.ReactNode
}

export function EducationCard({ term, children }: EducationCardProps) {
  const content = EDUCATION[term]

  const tooltip = (
    <div className="space-y-1.5">
      <p className="font-semibold text-white text-sm">{content.title}</p>
      <p className="text-[#8B9BB4] text-xs leading-relaxed">{content.explanation}</p>
      <p className="text-[#8B9BB4] text-xs">
        <span className="text-white/70">Example:</span> {content.example}
      </p>
    </div>
  )

  return (
    <Tooltip content={tooltip}>
      {children ? (
        <span className="cursor-help underline decoration-dotted decoration-white/30 underline-offset-4">
          {children}
        </span>
      ) : (
        <button
          aria-label={content.title}
          className="text-[#8B9BB4] hover:text-white transition-colors duration-150"
        >
          <HelpCircle size={13} />
        </button>
      )}
    </Tooltip>
  )
}
