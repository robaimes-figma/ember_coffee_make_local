import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface Crumb {
  label: string
  /** Omit on the final crumb — the current page is not a link. */
  href?: string
}

export interface BreadcrumbsProps {
  items: readonly Crumb[]
  /** Lets the app supply its router's Link component. */
  linkAs?: (props: { href: string; children: ReactNode; className: string }) => ReactNode
  className?: string
}

export function Breadcrumbs({ items, linkAs, className }: BreadcrumbsProps) {
  const linkClassName = 'text-muted transition-colors hover:text-content'

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
      {items.map((item, index) => {
        const last = index === items.length - 1

        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight className="size-3.5 shrink-0 text-subtle" aria-hidden />
            ) : null}

            {last || !item.href ? (
              <span aria-current={last ? 'page' : undefined} className="font-medium text-content">
                {item.label}
              </span>
            ) : linkAs ? (
              linkAs({ href: item.href, children: item.label, className: linkClassName })
            ) : (
              <a href={item.href} className={linkClassName}>
                {item.label}
              </a>
            )}
          </span>
        )
      })}
    </nav>
  )
}
