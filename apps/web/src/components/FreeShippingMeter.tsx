import { formatPrice } from '@ember/ui'
import { Truck } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD_CENTS } from '../lib/cart'

export interface FreeShippingMeterProps {
  /** Cents still needed to qualify. 0 means already qualified. */
  remainingCents: number
}

/**
 * Progress towards the free shipping threshold. Shown in the cart drawer and
 * on the cart page.
 */
export function FreeShippingMeter({ remainingCents }: FreeShippingMeterProps) {
  const qualified = remainingCents <= 0
  const progress = qualified
    ? 1
    : (FREE_SHIPPING_THRESHOLD_CENTS - remainingCents) / FREE_SHIPPING_THRESHOLD_CENTS

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface-sunken p-3">
      <div className="flex items-center gap-2 text-sm">
        <Truck className="size-4 shrink-0 text-muted" aria-hidden />
        {qualified ? (
          <p className="font-medium text-success-text">Free shipping unlocked</p>
        ) : (
          <p className="text-muted">
            <span className="font-medium text-content">{formatPrice(remainingCents)}</span> away
            from free shipping
          </p>
        )}
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Progress towards free shipping"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            qualified ? 'bg-success' : 'bg-accent'
          }`}
          style={{ width: `${Math.max(4, progress * 100)}%` }}
        />
      </div>
    </div>
  )
}
