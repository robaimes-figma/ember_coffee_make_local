import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../lib/cn'
import { Spinner } from './Spinner'

/**
 * Button
 *
 * Variant names match the Figma library exactly: Primary, Secondary,
 * Outline, Ghost, Danger, Link.
 */
export const buttonVariants = cva(
  // Shared across every variant. Note there is no focus styling here —
  // the global :focus-visible ring in base.css handles it for the whole
  // product, so a button can never drift out of sync with an input.
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium whitespace-nowrap',
    'rounded-md border border-transparent',
    'transition-colors duration-150',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-accent-hover',
        secondary: 'bg-surface-sunken text-content hover:bg-surface-hover border-border',
        outline: 'bg-transparent text-content border-border-strong hover:bg-surface-hover',
        ghost: 'bg-transparent text-content hover:bg-surface-hover',
        danger: 'bg-danger text-on-danger hover:bg-danger-hover',
        link: 'bg-transparent text-accent-text underline underline-offset-4 hover:text-accent',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

/**
 * The visual props of a Button, without the button element itself. Exported so
 * a link that should look like a button (see ButtonLink in the app) can accept
 * exactly the same options without depending on cva directly.
 */
export type ButtonVariantProps = VariantProps<typeof buttonVariants>

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  /** Shows a spinner and blocks interaction. Keeps the button's width stable. */
  loading?: boolean
  /** Rendered before the label. */
  leadingIcon?: ReactNode
  /** Rendered after the label. */
  trailingIcon?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  loading = false,
  leadingIcon,
  trailingIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
}
