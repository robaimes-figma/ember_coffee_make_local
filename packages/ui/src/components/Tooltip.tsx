import { useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export interface TooltipProps {
  content: ReactNode
  side?: 'top' | 'bottom'
  children: ReactNode
  className?: string
}

/**
 * Tooltip
 *
 * Hover and focus triggered. Deliberately CSS-positioned rather than
 * floating-ui: it only ever wraps small controls that sit well away from the
 * viewport edges, and that keeps it readable for anyone editing it.
 */
export function Tooltip({ content, side = 'top', children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocusCapture={() => setVisible(true)}
      onBlurCapture={() => setVisible(false)}
    >
      {children}

      {visible ? (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 animate-fade-in',
            'rounded-md bg-surface-inverse px-2 py-1 text-xs whitespace-nowrap text-inverse shadow-md',
            side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}
