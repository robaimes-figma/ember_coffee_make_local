import { cn } from '../lib/cn'

export interface PriceProps {
  /** Amount in cents. Money is always integer cents in this codebase. */
  cents: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** A struck-through original price, also in cents. */
  compareAtCents?: number
  className?: string
}

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl',
}

/** Format integer cents as USD. */
export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

export function Price({ cents, size = 'md', compareAtCents, className }: PriceProps) {
  const onSale = compareAtCents !== undefined && compareAtCents > cents

  return (
    <span className={cn('inline-flex items-baseline gap-2', sizes[size], className)}>
      <span className={cn('font-semibold tabular-nums', onSale && 'text-danger-text')}>
        {formatPrice(cents)}
      </span>

      {onSale ? (
        <span className="text-sm text-subtle line-through tabular-nums">
          {formatPrice(compareAtCents)}
        </span>
      ) : null}
    </span>
  )
}
