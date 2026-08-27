import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface ChipProps {
  children: ReactNode
  /** Toggle chips (shop filters) render pressed when true. */
  selected?: boolean
  onClick?: () => void
  /** Shows an × and calls this instead of rendering a toggle. */
  onRemove?: () => void
  /** A swatch dot before the label, e.g. a roast colour. */
  swatchClassName?: string
  className?: string
}

/**
 * Chip
 *
 * The interactive counterpart to Badge — used for shop filters and for the
 * removable "active filter" row above the product grid.
 */
export function Chip({
  children,
  selected = false,
  onClick,
  onRemove,
  swatchClassName,
  className,
}: ChipProps) {
  const content = (
    <>
      {swatchClassName ? (
        <span className={cn('size-2 rounded-full', swatchClassName)} aria-hidden />
      ) : null}
      {children}
    </>
  )

  const shared = [
    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5',
    'text-sm font-medium transition-colors',
  ]

  if (onRemove) {
    return (
      <span className={cn(shared, 'border-border bg-surface-sunken text-content', className)}>
        {content}
        <button
          type="button"
          onClick={onRemove}
          className="-mr-1 rounded-full p-0.5 text-muted hover:bg-surface-hover hover:text-content"
          aria-label={`Remove filter ${typeof children === 'string' ? children : ''}`.trim()}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        shared,
        selected
          ? 'border-accent bg-accent-soft text-accent-text'
          : 'border-border bg-surface text-muted hover:border-border-strong hover:text-content',
        className,
      )}
    >
      {content}
    </button>
  )
}
