import { cn } from '../lib/cn'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Announced to screen readers. Set to null on decorative spinners. */
  label?: string | null
}

const sizes = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-9 border-[3px]',
}

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      className={cn(
        'inline-block animate-spin rounded-full',
        'border-current border-t-transparent',
        sizes[size],
        className,
      )}
    >
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
}
