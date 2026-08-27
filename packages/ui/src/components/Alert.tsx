import { cva, type VariantProps } from 'class-variance-authority'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { IconButton } from './IconButton'

const alert = cva('flex gap-3 rounded-lg border p-4', {
  variants: {
    tone: {
      info: 'bg-info-soft border-info/30 text-info-text',
      success: 'bg-success-soft border-success/30 text-success-text',
      warning: 'bg-warning-soft border-warning/30 text-warning-text',
      danger: 'bg-danger-soft border-danger/30 text-danger-text',
    },
  },
  defaultVariants: { tone: 'info' },
})

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
}

export interface AlertProps extends VariantProps<typeof alert> {
  title?: ReactNode
  children?: ReactNode
  /** Shows a dismiss button and calls this when it is pressed. */
  onDismiss?: () => void
  /** Rendered at the bottom, for a "Retry" or "View order" style action. */
  action?: ReactNode
  className?: string
}

export function Alert({ tone = 'info', title, children, onDismiss, action, className }: AlertProps) {
  const Icon = icons[tone ?? 'info']

  return (
    <div role="alert" className={cn(alert({ tone }), className)}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        {children ? <div className="text-sm">{children}</div> : null}
        {action ? <div className="mt-2 flex gap-2">{action}</div> : null}
      </div>

      {onDismiss ? (
        <IconButton
          variant="ghost"
          size="sm"
          label="Dismiss"
          icon={<X className="size-4" />}
          onClick={onDismiss}
          className="-mt-1 -mr-1 shrink-0 text-current"
        />
      ) : null}
    </div>
  )
}
