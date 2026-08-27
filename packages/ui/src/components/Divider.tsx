import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface DividerProps {
  /** Centred text inside the rule, e.g. "or". */
  label?: ReactNode
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn('border-t border-border', className)} />
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <hr className="flex-1 border-t border-border" />
      <span className="text-xs font-medium tracking-wide text-subtle uppercase">{label}</span>
      <hr className="flex-1 border-t border-border" />
    </div>
  )
}
