import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { IconButton } from './IconButton'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Rendered in the footer, right-aligned. */
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  // Escape closes, and the page behind stops scrolling while we're open.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn(
          'relative flex w-full flex-col rounded-xl bg-surface shadow-xl animate-slide-up',
          'max-h-[calc(100vh-2rem)]',
          sizes[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl">{title}</h2>
            {description ? <p className="text-sm text-muted">{description}</p> : null}
          </div>
          <IconButton
            label="Close"
            size="sm"
            icon={<X className="size-4" />}
            onClick={onClose}
            className="-mt-1 -mr-2 shrink-0"
          />
        </div>

        {children ? <div className="flex-1 overflow-y-auto px-6 pb-2">{children}</div> : null}

        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            {footer}
          </div>
        ) : (
          <div className="pb-6" />
        )}
      </div>
    </div>
  )
}
