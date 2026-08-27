import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { IconButton } from './IconButton'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  /** Which edge the panel slides in from. */
  side?: 'right' | 'left'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
}

/**
 * Drawer
 *
 * Used for the storefront cart and for the admin order detail panel.
 */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn(
          'absolute inset-y-0 flex w-full flex-col bg-surface shadow-xl animate-slide-in-right',
          side === 'right' ? 'right-0' : 'left-0',
          sizes[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 className="truncate text-lg">{title}</h2>
            {description ? <p className="truncate text-sm text-muted">{description}</p> : null}
          </div>
          <IconButton
            label="Close"
            size="sm"
            icon={<X className="size-4" />}
            onClick={onClose}
            className="-mr-2 shrink-0"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="border-t border-border px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}
