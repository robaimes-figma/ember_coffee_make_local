import { cn } from '../lib/cn'

export interface SkeletonProps {
  /** Tailwind height/width utilities, e.g. "h-4 w-32". */
  className?: string
  shape?: 'line' | 'block' | 'circle'
}

const shapes = {
  line: 'h-4 rounded-xs',
  block: 'rounded-lg',
  circle: 'rounded-full',
}

/**
 * Skeleton
 *
 * Placeholder shown while data loads. Skeletons should mirror the shape of
 * the content they replace so the layout doesn't jump when data arrives.
 */
export function Skeleton({ className, shape = 'line' }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-shimmer bg-surface-sunken', shapes[shape], className)}
    />
  )
}
