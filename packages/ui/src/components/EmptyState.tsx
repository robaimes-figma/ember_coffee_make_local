import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface EmptyStateProps {
  /** Usually a lucide icon at size-6. */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** The primary way out of the empty state. */
  action?: ReactNode
  size?: 'sm' | 'md'
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'md' ? 'gap-3 px-6 py-16' : 'gap-2 px-4 py-10',
        className,
      )}
    >
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-surface-sunken text-muted">
          {icon}
        </div>
      ) : null}

      <p className={cn('font-semibold text-content', size === 'md' ? 'text-lg' : 'text-base')}>
        {title}
      </p>

      {description ? (
        <p className="max-w-sm text-sm text-muted text-balance">{description}</p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
