import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../lib/cn'
import { controlBorder, controlBox, useField } from './Field'

// `size` and `prefix` are both native HTML attributes with different meanings,
// so they are replaced rather than extended.
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: 'sm' | 'md' | 'lg'
  /** Icon or text rendered inside the control, before the value. */
  prefix?: ReactNode
  /** Icon or text rendered inside the control, after the value. */
  suffix?: ReactNode
  ref?: Ref<HTMLInputElement>
}

const sizes = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

const padding = {
  sm: 'px-2.5',
  md: 'px-3',
  lg: 'px-4',
}

export function Input({ className, size = 'md', prefix, suffix, ...props }: InputProps) {
  const field = useField()
  const invalid = field?.invalid ?? false

  const input = (
    <input
      id={props.id ?? field?.controlId}
      aria-describedby={field?.errorId ?? field?.hintId}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBox,
        controlBorder(invalid),
        sizes[size],
        prefix || suffix ? 'border-0 bg-transparent px-0 hover:border-0' : padding[size],
        className,
      )}
      {...props}
    />
  )

  if (!prefix && !suffix) return input

  // With an affix, the border moves to the wrapper so the icon sits inside
  // the control rather than beside it.
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        controlBox,
        controlBorder(invalid),
        sizes[size],
        padding[size],
        'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
      )}
    >
      {prefix ? <span className="shrink-0 text-subtle">{prefix}</span> : null}
      {input}
      {suffix ? <span className="shrink-0 text-subtle">{suffix}</span> : null}
    </div>
  )
}
