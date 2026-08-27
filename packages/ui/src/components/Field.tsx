import { createContext, useContext, useId, type ReactNode } from 'react'
import { cn } from '../lib/cn'

/**
 * Field
 *
 * Wraps a form control with its label, hint and error message, and wires up
 * the ids so the control is correctly described. Every form control in the
 * product should sit inside a Field — that is what guarantees a label exists.
 */

interface FieldContextValue {
  controlId: string
  hintId?: string
  errorId?: string
  invalid: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

/** Read the ids and invalid state provided by the surrounding Field. */
export function useField() {
  return useContext(FieldContext)
}

export interface FieldProps {
  label: ReactNode
  /** Helper text shown below the control when there is no error. */
  hint?: ReactNode
  /** When set, the control renders in its error state and this replaces the hint. */
  error?: ReactNode
  /** Adds the required marker to the label. */
  required?: boolean
  /** Hides the label visually but keeps it for screen readers. */
  labelHidden?: boolean
  className?: string
  children: ReactNode
}

export function Field({
  label,
  hint,
  error,
  required = false,
  labelHidden = false,
  className,
  children,
}: FieldProps) {
  const id = useId()
  const controlId = `${id}-control`
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <FieldContext.Provider value={{ controlId, hintId, errorId, invalid: Boolean(error) }}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        <label
          htmlFor={controlId}
          className={cn(
            'text-sm font-medium text-content',
            labelHidden && 'sr-only',
          )}
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>

        {children}

        {error ? (
          <p id={errorId} className="text-sm text-danger-text">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  )
}

/**
 * Shared styling for the box-shaped controls (Input, Textarea, Select) so
 * they line up with each other pixel for pixel.
 */
export const controlBox = [
  'w-full rounded-md border bg-surface text-content',
  'placeholder:text-subtle',
  'transition-colors duration-150',
  'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-subtle',
]

export function controlBorder(invalid: boolean) {
  return invalid ? 'border-danger' : 'border-border-strong hover:border-subtle'
}
