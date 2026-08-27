import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

/**
 * Card
 *
 * The workhorse container. Composed as
 * Card > CardMedia? > CardHeader? > CardBody > CardFooter?
 */
const card = cva('overflow-hidden', {
  variants: {
    surface: {
      raised: 'bg-surface shadow-sm',
      flat: 'bg-surface',
      sunken: 'bg-surface-sunken',
      outline: 'bg-surface border border-border',
    },
    radius: {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
    },
    interactive: {
      true: 'transition-shadow duration-200 hover:shadow-md',
      false: '',
    },
  },
  defaultVariants: {
    surface: 'raised',
    radius: 'lg',
    interactive: false,
  },
})

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {}

export function Card({ className, surface, radius, interactive, ...props }: CardProps) {
  return <div className={cn(card({ surface, radius, interactive }), className)} {...props} />
}

export function CardMedia({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('relative bg-surface-sunken', className)} {...props} />
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-start justify-between gap-4 px-5 pt-5 pb-3', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg leading-snug', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted', className)} {...props} />
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-3 border-t border-border px-5 py-4', className)}
      {...props}
    />
  )
}
