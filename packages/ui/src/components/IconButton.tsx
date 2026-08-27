import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../lib/cn'

/**
 * IconButton
 *
 * A square button with no visible text. `label` is required — it becomes the
 * accessible name, so an icon-only control can never ship unlabelled.
 */
const iconButton = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-md border border-transparent',
    'transition-colors duration-150',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-accent-hover',
        secondary: 'bg-surface-sunken text-content border-border hover:bg-surface-hover',
        outline: 'bg-transparent text-content border-border-strong hover:bg-surface-hover',
        ghost: 'bg-transparent text-muted hover:bg-surface-hover hover:text-content',
        danger: 'bg-transparent text-danger hover:bg-danger-soft',
      },
      size: {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-12',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
)

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof iconButton> {
  /** The accessible name. Also used as the tooltip text by callers. */
  label: string
  icon: ReactNode
  ref?: Ref<HTMLButtonElement>
}

export function IconButton({ className, variant, size, label, icon, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(iconButton({ variant, size }), className)}
      {...props}
    >
      {icon}
    </button>
  )
}
