import { Minus, Plus } from 'lucide-react'
import { cn } from '../lib/cn'

export interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  /** Describes what is being counted, e.g. "Ethiopia Guji quantity". */
  label: string
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  label,
  className,
}: QuantityStepperProps) {
  const height = size === 'sm' ? 'h-8' : 'h-10'
  const button = size === 'sm' ? 'size-8' : 'size-10'

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-border-strong bg-surface',
        height,
        className,
      )}
    >
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          'inline-flex items-center justify-center rounded-l-md text-muted transition-colors',
          'hover:bg-surface-hover hover:text-content',
          'disabled:pointer-events-none disabled:opacity-40',
          button,
        )}
      >
        <Minus className="size-4" aria-hidden />
      </button>

      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(event) => {
          const next = Number.parseInt(event.target.value.replace(/\D/g, ''), 10)
          if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)))
        }}
        className="w-10 border-x border-border bg-transparent text-center text-sm font-medium tabular-nums"
      />

      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          'inline-flex items-center justify-center rounded-r-md text-muted transition-colors',
          'hover:bg-surface-hover hover:text-content',
          'disabled:pointer-events-none disabled:opacity-40',
          button,
        )}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  )
}
