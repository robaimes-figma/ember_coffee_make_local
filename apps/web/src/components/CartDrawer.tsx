import { GRIND_LABELS } from '@ember/api/types'
import {
  BagArtwork,
  Badge,
  Button,
  Drawer,
  EmptyState,
  IconButton,
  QuantityStepper,
  colorwayFor,
  formatPrice,
} from '@ember/ui'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { FreeShippingMeter } from './FreeShippingMeter'

export interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const cart = useCart()
  const navigate = useNavigate()

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Your cart"
      description={cart.itemCount > 0 ? `${cart.itemCount} bags` : undefined}
      footer={
        cart.lines.length > 0 ? (
          <div className="flex flex-col gap-3">
            <FreeShippingMeter remainingCents={cart.remainingForFreeShippingCents} />

            <dl className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium tabular-nums">{formatPrice(cart.subtotalCents)}</dd>
              </div>

              {cart.discountCents > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-success-text">Subscription saving</dt>
                  <dd className="font-medium text-success-text tabular-nums">
                    −{formatPrice(cart.discountCents)}
                  </dd>
                </div>
              ) : null}

              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium tabular-nums">
                  {cart.shippingCents === 0 ? 'Free' : formatPrice(cart.shippingCents)}
                </dd>
              </div>

              <div className="mt-1 flex justify-between border-t border-border pt-2 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold tabular-nums">{formatPrice(cart.totalCents)}</dd>
              </div>
            </dl>

            <Button
              fullWidth
              size="lg"
              onClick={() => {
                onClose()
                navigate('/checkout')
              }}
            >
              Checkout
            </Button>
          </div>
        ) : null
      }
    >
      {cart.lines.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="size-6" aria-hidden />}
          title="Nothing in the cart yet"
          description="Pick a coffee and we'll roast it on the next roast day."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                onClose()
                navigate('/shop')
              }}
            >
              Browse coffee
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {cart.lines.map((line) => (
            <li key={line.key} className="flex gap-3 py-4 first:pt-0">
              <Link
                to={`/shop/${line.productSlug}`}
                onClick={onClose}
                className="size-20 shrink-0 overflow-hidden rounded-md bg-surface-sunken"
              >
                <BagArtwork
                  colorway={colorwayFor(line.productId)}
                  origin={line.productName}
                  pattern={false}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{line.productName}</p>
                    <p className="text-xs text-muted">
                      {line.size} · {GRIND_LABELS[line.grind]}
                    </p>
                  </div>
                  <IconButton
                    label={`Remove ${line.productName}`}
                    size="sm"
                    variant="danger"
                    icon={<Trash2 className="size-4" />}
                    onClick={() => cart.remove(line.key)}
                    className="-mt-1 -mr-2 shrink-0"
                  />
                </div>

                {line.subscription ? (
                  <Badge tone="success" size="sm">
                    Subscription · save 10%
                  </Badge>
                ) : null}

                <div className="mt-1 flex items-center justify-between gap-2">
                  <QuantityStepper
                    size="sm"
                    label={`${line.productName} quantity`}
                    value={line.quantity}
                    onChange={(quantity) => cart.setQuantity(line.key, quantity)}
                    min={0}
                  />
                  <span className="text-sm font-semibold tabular-nums">
                    {formatPrice(line.unitPriceCents * line.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}
