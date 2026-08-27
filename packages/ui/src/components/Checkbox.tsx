import { Check, Minus } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  /** Secondary line below the label. */
  description?: ReactNode
  /** Renders the dash state. Visual only — the underlying value stays false. */
  indeterminate?: boolean
}

/**
 * Checkbox
 *
 * The native input stays in the DOM (visually hidden) so keyboard, form
 * submission and screen readers all behave natively; the visible box is a
 * sibling driven by `peer-*` variants.
 */
export function Checkbox({
  className,
  label,
  description,
  indeterminate = false,
  id: idProp,
  ...props
}: CheckboxProps) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <div className={cn('flex gap-2.5', className)}>
      <span className="relative flex shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          className="peer size-4 appearance-none rounded-xs border border-border-strong bg-surface transition-colors checked:border-accent checked:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-on-accent opacity-0 peer-checked:opacity-100"
          aria-hidden
        >
          {indeterminate ? <Minus className="size-3" /> : <Check className="size-3" />}
        </span>
      </span>

      <span className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-sm leading-tight text-content select-none">
          {label}
        </label>
        {description ? <span className="text-xs text-muted">{description}</span> : null}
      </span>
    </div>
  )
}
