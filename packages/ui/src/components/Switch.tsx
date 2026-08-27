import { useId, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  description?: ReactNode
  /** Puts the control before the label instead of after it. */
  controlFirst?: boolean
  disabled?: boolean
  className?: string
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  controlFirst = false,
  disabled = false,
  className,
}: SwitchProps) {
  const id = useId()

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        controlFirst ? 'flex-row' : 'flex-row-reverse justify-between',
        disabled && 'opacity-50',
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200',
          'focus:outline-none',
          'disabled:cursor-not-allowed',
          checked ? 'bg-accent' : 'bg-border-strong',
        )}
      >
        <span
          className={cn(
            'block size-5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
          aria-hidden
        />
      </button>

      <span className="flex flex-col gap-0.5">
        <label
          id={`${id}-label`}
          htmlFor={id}
          className="text-sm font-medium text-content select-none"
        >
          {label}
        </label>
        {description ? <span className="text-xs text-muted">{description}</span> : null}
      </span>
    </div>
  )
}
