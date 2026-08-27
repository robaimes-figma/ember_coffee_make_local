import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface SectionHeadingProps {
  /** Small line above the title, e.g. "This month's pick". */
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** A link or button, right-aligned on wide screens. */
  action?: ReactNode
  align?: 'left' | 'center'
  size?: 'md' | 'lg'
  className?: string
}

/**
 * SectionHeading
 *
 * The eyebrow / title / description block that opens each storefront section.
 * Using this everywhere is what keeps section rhythm consistent down the page.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  size = 'md',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-2',
          align === 'center' && 'items-center text-center',
        )}
      >
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-widest text-accent-text uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h2 className={cn(size === 'lg' ? 'text-3xl' : 'text-2xl', 'text-balance')}>{title}</h2>

        {description ? (
          <p className="max-w-prose text-base text-muted text-pretty">{description}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
