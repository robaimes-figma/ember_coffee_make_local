import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

/**
 * Badge
 *
 * Small non-interactive status label. If it needs a click handler, you want
 * Chip instead.
 */
const badge = cva(
  [
    'inline-flex items-center gap-1.5',
    'font-medium whitespace-nowrap',
    'rounded-full border',
  ],
  {
    variants: {
      tone: {
        neutral: 'bg-surface-sunken text-muted border-border',
        accent: 'bg-accent-soft text-accent-text border-transparent',
        success: 'bg-success-soft text-success-text border-transparent',
        warning: 'bg-warning-soft text-warning-text border-transparent',
        danger: 'bg-danger-soft text-danger-text border-transparent',
        info: 'bg-info-soft text-info-text border-transparent',
        inverse: 'bg-surface-inverse text-inverse border-transparent',
      },
      size: {
        sm: 'h-5 px-2 text-2xs',
        md: 'h-6 px-2.5 text-xs',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {
  /** A small dot in the current tone, shown before the label. */
  dot?: boolean
  children: ReactNode
}

export function Badge({ className, tone, size, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badge({ tone, size }), className)} {...props}>
      {dot ? <span className="size-1.5 rounded-full bg-current" aria-hidden /> : null}
      {children}
    </span>
  )
}
