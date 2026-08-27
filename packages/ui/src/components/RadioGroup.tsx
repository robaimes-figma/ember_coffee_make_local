import { useId, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface RadioOption<T extends string> {
  value: T
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps<T extends string> {
  /** Announced as the group's name. Pass `labelHidden` to hide it visually. */
  legend: ReactNode
  legendHidden?: boolean
  options: readonly RadioOption<T>[]
  value: T
  onChange: (value: T) => void
  /** `card` renders each option as a selectable panel; `list` is a plain radio list. */
  appearance?: 'list' | 'card'
  className?: string
}

export function RadioGroup<T extends string>({
  legend,
  legendHidden = false,
  options,
  value,
  onChange,
  appearance = 'list',
  className,
}: RadioGroupProps<T>) {
  const name = useId()

  return (
    <fieldset className={cn('flex flex-col gap-2', className)}>
      <legend className={cn('mb-1 text-sm font-medium text-content', legendHidden && 'sr-only')}>
        {legend}
      </legend>

      {options.map((option) => {
        const id = `${name}-${option.value}`
        const selected = value === option.value

        return (
          <div
            key={option.value}
            className={cn(
              'flex gap-2.5',
              appearance === 'card' && [
                'rounded-lg border p-3 transition-colors',
                selected ? 'border-accent bg-accent-soft' : 'border-border hover:bg-surface-hover',
                option.disabled && 'opacity-50',
              ],
            )}
          >
            <span className="relative flex shrink-0 items-center">
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                disabled={option.disabled}
                onChange={() => onChange(option.value)}
                className="peer size-4 appearance-none rounded-full border border-border-strong bg-surface transition-colors checked:border-accent disabled:cursor-not-allowed"
              />
              <span
                className="pointer-events-none absolute left-1 size-2 rounded-full bg-accent opacity-0 peer-checked:opacity-100"
                aria-hidden
              />
            </span>

            <span className="flex flex-col gap-0.5">
              <label htmlFor={id} className="text-sm leading-tight text-content select-none">
                {option.label}
              </label>
              {option.description ? (
                <span className="text-xs text-muted">{option.description}</span>
              ) : null}
            </span>
          </div>
        )
      })}
    </fieldset>
  )
}
