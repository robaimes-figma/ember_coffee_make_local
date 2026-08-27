import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '../lib/cn'
import { IconButton } from './IconButton'

export type ToastTone = 'neutral' | 'success' | 'danger'

export interface Toast {
  id: number
  message: ReactNode
  tone: ToastTone
}

interface ToastContextValue {
  /** Show a toast. Auto-dismisses after `duration` ms; pass 0 to keep it. */
  toast: (message: ReactNode, options?: { tone?: ToastTone; duration?: number }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>')
  return context
}

const tones: Record<ToastTone, { className: string; Icon: typeof Info }> = {
  neutral: { className: 'bg-surface-inverse text-inverse', Icon: Info },
  success: { className: 'bg-success text-white', Icon: CheckCircle2 },
  danger: { className: 'bg-danger text-on-danger', Icon: XCircle },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback<ToastContextValue['toast']>(
    (message, options) => {
      const id = nextId.current++
      const duration = options?.duration ?? 4000

      setToasts((current) => [...current, { id, message, tone: options?.tone ?? 'neutral' }])

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-60 flex flex-col items-center gap-2 p-4"
      >
        {toasts.map(({ id, message, tone }) => {
          const { className, Icon } = tones[tone]
          return (
            <div
              key={id}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg px-4 py-3 shadow-lg animate-slide-up',
                className,
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <p className="flex-1 text-sm">{message}</p>
              <IconButton
                label="Dismiss"
                size="sm"
                icon={<X className="size-4" />}
                onClick={() => dismiss(id)}
                className="-mr-2 text-current hover:bg-white/15"
              />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
