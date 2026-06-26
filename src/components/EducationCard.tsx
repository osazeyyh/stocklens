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
      <p className="text-[#00E5A0] text-xs italic">e.g. {content.example}</p>
    </div>
  )

  return (
    <Tooltip content={tooltip}>
      {children ? (
        <span className="cursor-help underline decoration-dotted decoration-[#8B9BB4] underline-offset-2">
          {children}
        </span>
      ) : (
        <button className="text-[#8B9BB4] hover:text-[#00E5A0] transition-colors">
          <HelpCircle size={13} />
        </button>
      )}
    </Tooltip>
  )
}
