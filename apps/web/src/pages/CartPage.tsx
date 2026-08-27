import { GRIND_LABELS } from '@ember/api/types'
import {
  BagArtwork,
  Badge,
  Card,
  CardBody,
  Container,
  EmptyState,
  IconButton,
  QuantityStepper,
  colorwayFor,
  formatPrice,
} from '@ember/ui'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { FreeShippingMeter } from '../components/FreeShippingMeter'
import { useCart } from '../lib/cart'

export function CartPage() {
  const cart = useCart()

  if (cart.lines.length === 0) {
    return (
      <Container className="py-16">
        <h1 className="text-3xl">Your cart</h1>
        <Card surface="outline" className="mt-8">
          <EmptyState
            icon={<ShoppingBag className="size-6" aria-hidden />}
            title="Your cart is empty"
            description="Fourteen coffees are on the shelf right now, and all of them are roasted to order."
            action={<ButtonLink to="/shop">Browse coffee</ButtonLink>}
          />
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl">Your cart</h1>
      <p className="mt-2 text-muted">
        {cart.itemCount} {cart.itemCount === 1 ? 'bag' : 'bags'} · roasted on the next roast day
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        {/* Lines */}
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {cart.lines.map((line) => (
            <li key={line.key} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-start">
              <Link
                to={`/shop/${line.productSlug}`}
                className="size-28 shrink-0 overflow-hidden rounded-lg bg-surface-sunken"
              >
                <BagArtwork
                  colorway={colorwayFor(line.productId)}
                  origin={line.productName}
                  pattern={false}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      to={`/shop/${line.productSlug}`}
                      className="text-lg font-semibold hover:text-accent-text"
                    >
                      {line.productName}
                    </Link>
                    <p className="text-sm text-muted">
                      {line.size} · {GRIND_LABELS[line.grind]}
                    </p>
                  </div>

                  <IconButton
                    label={`Remove ${line.productName}`}
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="size-4" />}
                    onClick={() => cart.remove(line.key)}
                  />
                </div>

                {line.subscription ? (
                  <Badge tone="success" size="sm">
                    Subscription · save 10%
                  </Badge>
                ) : null}

                <div className="mt-2 flex items-center justify-between gap-4">
                  <QuantityStepper
                    label={`${line.productName} quantity`}
                    value={line.quantity}
                    onChange={(quantity) => cart.setQuantity(line.key, quantity)}
                    min={0}
                  />

                  <div className="text-right">
                    <p className="font-semibold tabular-nums">
                      {formatPrice(line.unitPriceCents * line.quantity)}
                    </p>
                    {line.quantity > 1 ? (
                      <p className="text-xs text-subtle tabular-nums">
                        {formatPrice(line.unitPriceCents)} each
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <Card surface="outline">
            <CardBody className="flex flex-col gap-4">
              <h2 className="font-sans text-base font-semibold">Order summary</h2>

              <FreeShippingMeter remainingCents={cart.remainingForFreeShippingCents} />

              <dl className="flex flex-col gap-2 text-sm">
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

                <div className="mt-2 flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-semibold tabular-nums">{formatPrice(cart.totalCents)}</dd>
                </div>
              </dl>

              <ButtonLink to="/checkout" size="lg" fullWidth>
                Checkout
              </ButtonLink>

              <p className="text-center text-xs text-subtle">
                Taxes calculated at checkout. This is a demo — no payment is taken.
              </p>
            </CardBody>
          </Card>
        </aside>
      </div>
    </Container>
  )
}
