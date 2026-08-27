import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface StatTileProps {
  label: string
  value: ReactNode
  /** Percentage change against the previous period. */
  deltaPercent?: number
  /** What the delta is measured against, e.g. "vs. last week". */
  deltaCaption?: string
  /** For a metric where down is good (e.g. refund rate). */
  invertDelta?: boolean
  icon?: ReactNode
  className?: string
}

/**
 * StatTile
 *
 * A single KPI in the admin dashboard. Trend colour is semantic, not literal:
 * `invertDelta` lets a falling number read as good.
 */
export function StatTile({
  label,
  value,
  deltaPercent,
  deltaCaption,
  invertDelta = false,
  icon,
  className,
}: StatTileProps) {
  const flat = deltaPercent === undefined || Math.abs(deltaPercent) < 0.05
  const rising = (deltaPercent ?? 0) > 0
  const good = invertDelta ? !rising : rising
  const TrendIcon = flat ? Minus : rising ? ArrowUpRight : ArrowDownRight

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-border bg-surface p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
        {icon ? <span className="text-subtle">{icon}</span> : null}
      </div>

      <p className="font-display text-2xl leading-none font-semibold tabular-nums text-content">
        {value}
      </p>

      {deltaPercent !== undefined ? (
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium',
              flat ? 'text-muted' : good ? 'text-success-text' : 'text-danger-text',
            )}
          >
            <TrendIcon className="size-3.5" aria-hidden />
            {Math.abs(deltaPercent).toFixed(1)}%
          </span>
          {deltaCaption ? <span className="text-subtle">{deltaCaption}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
