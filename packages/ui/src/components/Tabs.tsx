import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface TabItem<T extends string> {
  value: T
  label: ReactNode
  /** Optional count shown after the label, e.g. an order count. */
  count?: number
}

export interface TabsProps<T extends string> {
  items: readonly TabItem<T>[]
  value: T
  onChange: (value: T) => void
  /** `underline` for page-level navigation, `pill` for filters inside a panel. */
  appearance?: 'underline' | 'pill'
  className?: string
  /** Describes the tab set for screen readers. */
  label: string
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  appearance = 'underline',
  className,
  label,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        'flex items-center',
        appearance === 'underline'
          ? 'gap-6 border-b border-border'
          : 'gap-1 rounded-lg bg-surface-sunken p-1',
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors',
              appearance === 'underline' && [
                '-mb-px border-b-2 pb-3',
                active
                  ? 'border-accent text-accent-text'
                  : 'border-transparent text-muted hover:text-content',
              ],
              appearance === 'pill' && [
                'rounded-md px-3 py-1.5',
                active ? 'bg-surface text-content shadow-xs' : 'text-muted hover:text-content',
              ],
            )}
          >
            {item.label}
            {item.count !== undefined ? (
              <span
                className={cn(
                  'rounded-full px-1.5 text-2xs',
                  active ? 'bg-accent-soft text-accent-text' : 'bg-surface-sunken text-muted',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
