import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

/**
 * Table
 *
 * Thin styled wrappers around the native table elements. Sorting, filtering
 * and pagination stay in the page — this is presentation only.
 *
 * Always wrap a Table in TableScroll so a wide table scrolls inside its own
 * container instead of pushing the page sideways.
 */

export function TableScroll({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full overflow-x-auto', className)} {...props} />
}

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn('w-full border-collapse text-left text-sm', className)}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('bg-surface-sunken text-xs font-semibold text-muted uppercase', className)}
      {...props}
    />
  )
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-border', className)} {...props} />
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Adds hover feedback and a pointer cursor. */
  clickable?: boolean
  selected?: boolean
}

export function TableRow({ className, clickable, selected, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        'transition-colors',
        clickable && 'cursor-pointer hover:bg-surface-hover',
        selected && 'bg-accent-soft',
        className,
      )}
      {...props}
    />
  )
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center'
  children?: ReactNode
}

export function TableHeaderCell({ className, align = 'left', ...props }: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 font-semibold tracking-wide whitespace-nowrap',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    />
  )
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center'
}

export function TableCell({ className, align = 'left', ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        'px-4 py-3 align-middle',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    />
  )
}
