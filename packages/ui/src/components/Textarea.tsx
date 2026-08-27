import type { Ref, TextareaHTMLAttributes } from 'react'
import { cn } from '../lib/cn'
import { controlBorder, controlBox, useField } from './Field'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  const field = useField()
  const invalid = field?.invalid ?? false

  return (
    <textarea
      id={props.id ?? field?.controlId}
      aria-describedby={field?.errorId ?? field?.hintId}
      aria-invalid={invalid || undefined}
      rows={rows}
      className={cn(controlBox, controlBorder(invalid), 'resize-y px-3 py-2 text-sm', className)}
      {...props}
    />
  )
}
