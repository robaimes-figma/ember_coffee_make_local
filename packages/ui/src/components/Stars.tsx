import { Star } from 'lucide-react'
import { cn } from '../lib/cn'

export interface StarsProps {
  /** 0–5, halves allowed. */
  rating: number
  size?: 'sm' | 'md'
  /** Shows the numeric rating after the stars. */
  showValue?: boolean
  /** Shows "(N)" after the rating. */
  reviewCount?: number
  className?: string
}

const sizes = {
  sm: 'size-3.5',
  md: 'size-4',
}

export function Stars({ rating, size = 'md', showValue = false, reviewCount, className }: StarsProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.max(0, Math.min(1, rating - index))

          return (
            <span key={index} className="relative inline-block">
              <Star className={cn(sizes[size], 'text-border-strong')} />
              {/* Clipped overlay of the filled star. Anchored top-left only —
                  with `inset-0` the width below would be over-constrained and
                  silently ignored, leaving every star empty. */}
              <span
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={cn(sizes[size], 'fill-warning text-warning')} />
              </span>
            </span>
          )
        })}
      </span>

      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>

      {showValue ? (
        <span className="text-sm font-medium text-content">{rating.toFixed(1)}</span>
      ) : null}

      {reviewCount !== undefined ? (
        <span className="text-sm text-muted">({reviewCount})</span>
      ) : null}
    </span>
  )
}
