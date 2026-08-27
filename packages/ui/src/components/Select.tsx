import { ChevronDown } from 'lucide-react'
import type { Ref, SelectHTMLAttributes } from 'react'
import { cn } from '../lib/cn'
import { controlBorder, controlBox, useField } from './Field'

// Native `size` on a <select> means "visible rows"; ours means control height.
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  ref?: Ref<HTMLSelectElement>
}

const sizes = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

export function Select({ className, size = 'md', children, ...props }: SelectProps) {
  const field = useField()
  const invalid = field?.invalid ?? false

  return (
    <div className="relative">
      <select
        id={props.id ?? field?.controlId}
        aria-describedby={field?.errorId ?? field?.hintId}
        aria-invalid={invalid || undefined}
        className={cn(
          controlBox,
          controlBorder(invalid),
          sizes[size],
          'appearance-none pr-9 pl-3',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-subtle"
        aria-hidden
      />
    </div>
  )
}
