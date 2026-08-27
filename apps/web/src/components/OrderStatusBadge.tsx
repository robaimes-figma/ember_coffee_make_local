import type { OrderStatus } from '@ember/api/types'
import { ORDER_STATUS_LABELS } from '@ember/api/types'
import { Badge } from '@ember/ui'

/**
 * The one place order status maps to a colour.
 *
 * Both the orders table and the order drawer use this, so a status can never
 * be green in one view and grey in another.
 */
const tones: Record<OrderStatus, 'neutral' | 'info' | 'warning' | 'success' | 'danger'> = {
  pending: 'neutral',
  roasting: 'warning',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'neutral',
  refunded: 'danger',
}

export interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md'
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  return (
    <Badge tone={tones[status]} size={size} dot>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  )
}
