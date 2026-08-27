import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

/**
 * Container
 *
 * Horizontal page gutters and max width. Every top-level page section should
 * sit in one of these rather than setting its own padding, which is what
 * keeps the left edge of the page aligned all the way down.
 */
const container = cva('mx-auto w-full', {
  variants: {
    width: {
      prose: 'max-w-prose',
      page: 'max-w-page',
      wide: 'max-w-wide',
      full: 'max-w-none',
    },
    gutter: {
      true: 'px-5 sm:px-8',
      false: '',
    },
  },
  defaultVariants: {
    width: 'page',
    gutter: true,
  },
})

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof container> {}

export function Container({ className, width, gutter, ...props }: ContainerProps) {
  return <div className={cn(container({ width, gutter }), className)} {...props} />
}
