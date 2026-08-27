import { buttonVariants, cn, type ButtonVariantProps } from '@ember/ui'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface ButtonLinkProps extends ButtonVariantProps {
  to: string
  children: ReactNode
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  className?: string
}

/**
 * ButtonLink
 *
 * A router link that looks like a Button. Use this — never a <Link> inside a
 * <Button> — whenever the control navigates rather than acts, so the element
 * in the DOM matches what it actually does.
 */
export function ButtonLink({
  to,
  children,
  variant,
  size,
  fullWidth,
  leadingIcon,
  trailingIcon,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </Link>
  )
}
