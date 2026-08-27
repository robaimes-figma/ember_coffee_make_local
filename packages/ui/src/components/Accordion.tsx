import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
}

export interface AccordionProps {
  items: readonly AccordionItem[]
  /** Ids open on first render. */
  defaultOpen?: readonly string[]
  /** When true, opening one panel closes the others. */
  single?: boolean
  className?: string
}

export function Accordion({ items, defaultOpen = [], single = false, className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>([...defaultOpen])

  const toggle = (id: string) => {
    setOpen((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      return single ? [id] : [...current, id]
    })
  }

  return (
    <div className={cn('divide-y divide-border border-y border-border', className)}>
      {items.map((item) => {
        const expanded = open.includes(item.id)

        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`${item.id}-panel`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-sm font-medium text-content">{item.title}</span>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-muted transition-transform duration-200',
                  expanded && 'rotate-180',
                )}
                aria-hidden
              />
            </button>

            {expanded ? (
              <div id={`${item.id}-panel`} className="pb-4 text-sm text-muted">
                {item.content}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
