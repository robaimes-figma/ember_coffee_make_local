import {
  Alert,
  Button,
  Card,
  CardBody,
  Checkbox,
  Container,
  Divider,
  EmptyState,
  Field,
  Input,
  RadioGroup,
  Select,
  formatPrice,
} from '@ember/ui'
import { CheckCircle2, Lock, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { ButtonLink } from '../components/ButtonLink'
import { apiSend } from '../lib/api'
import { useCart } from '../lib/cart'

type Step = 'contact' | 'shipping' | 'payment'

const STEPS: { id: Step; label: string }[] = [
  { id: 'contact', label: 'Contact' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
]

const SHIPPING_METHODS = [
  {
    value: 'standard',
    label: 'Standard — 3 to 5 days',
    description: 'Free over $60, otherwise $6.50',
  },
  { value: 'express', label: 'Express — next day', description: '$14.00, ordered before 9am' },
  { value: 'pickup', label: 'Collect from the roastery', description: 'Free, ready in 24 hours' },
] as const

export function CheckoutPage() {
  const cart = useCart()
  const [step, setStep] = useState<Step>('contact')
  const [shippingMethod, setShippingMethod] =
    useState<(typeof SHIPPING_METHODS)[number]['value']>('standard')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState<string>()
  const [failed, setFailed] = useState(false)

  if (reference) {
    return (
      <Container width="prose" className="py-20">
        <Card surface="outline">
          <EmptyState
            icon={<CheckCircle2 className="size-6 text-success" aria-hidden />}
            title="Order confirmed"
            description={`Reference ${reference}. We'll email you when it goes on the roaster — no payment was taken, this is a demo storefront.`}
            action={<ButtonLink to="/shop">Keep browsing</ButtonLink>}
          />
        </Card>
      </Container>
    )
  }

  if (cart.lines.length === 0) {
    return (
      <Container className="py-16">
        <h1 className="text-3xl">Checkout</h1>
        <Card surface="outline" className="mt-8">
          <EmptyState
            icon={<ShoppingBag className="size-6" aria-hidden />}
            title="There's nothing to check out"
            description="Add a coffee to your cart and come back."
            action={<ButtonLink to="/shop">Browse coffee</ButtonLink>}
          />
        </Card>
      </Container>
    )
  }

  const submit = async () => {
    if (!email.includes('@')) {
      setEmailError('Enter an email address we can send the receipt to.')
      setStep('contact')
      return
    }

    setSubmitting(true)
    setFailed(false)

    try {
      const result = await apiSend<{ reference: string }>('/checkout', 'POST', {
        email,
        shippingMethod,
        lines: cart.lines,
      })

      setReference(result.reference)
      cart.clear()
    } catch {
      setFailed(true)
    } finally {
      setSubmitting(false)
    }
  }

  const stepIndex = STEPS.findIndex((entry) => entry.id === step)

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl">Checkout</h1>

      {/* Step indicator */}
      <ol className="mt-8 flex flex-wrap items-center gap-3">
        {STEPS.map((entry, index) => {
          const done = index < stepIndex
          const current = index === stepIndex

          return (
            <li key={entry.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(entry.id)}
                className="flex items-center gap-2"
                aria-current={current ? 'step' : undefined}
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    current
                      ? 'bg-accent text-on-accent'
                      : done
                        ? 'bg-success-soft text-success-text'
                        : 'bg-surface-sunken text-muted'
                  }`}
                >
                  {done ? <CheckCircle2 className="size-4" aria-hidden /> : index + 1}
                </span>
                <span
                  className={`text-sm font-medium ${current ? 'text-content' : 'text-muted'}`}
                >
                  {entry.label}
                </span>
              </button>

              {index < STEPS.length - 1 ? (
                <span className="hidden h-px w-8 bg-border sm:block" aria-hidden />
              ) : null}
            </li>
          )
        })}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-6">
          {failed ? (
            <Alert
              tone="danger"
              title="We couldn't place that order"
              action={
                <Button size="sm" variant="secondary" onClick={submit}>
                  Try again
                </Button>
              }
            >
              Something went wrong on our side. Your cart is untouched.
            </Alert>
          ) : null}

          {step === 'contact' ? (
            <Card surface="outline">
              <CardBody className="flex flex-col gap-5">
                <h2 className="font-sans text-lg font-semibold">Contact</h2>

                <Field
                  label="Email"
                  required
                  error={emailError}
                  hint="Roast notes and tracking go here. No marketing unless you ask."
                >
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setEmailError(undefined)
                    }}
                  />
                </Field>

                <Checkbox
                  label="Send me the weekly roast list"
                  description="One email a week, listing what came off the roaster."
                />

                <div className="flex justify-end">
                  <Button onClick={() => setStep('shipping')}>Continue to shipping</Button>
                </div>
              </CardBody>
            </Card>
          ) : null}

          {step === 'shipping' ? (
            <Card surface="outline">
              <CardBody className="flex flex-col gap-5">
                <h2 className="font-sans text-lg font-semibold">Shipping address</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name" required>
                    <Input autoComplete="given-name" />
                  </Field>
                  <Field label="Last name" required>
                    <Input autoComplete="family-name" />
                  </Field>
                </div>

                <Field label="Address" required>
                  <Input autoComplete="address-line1" />
                </Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="City" required className="sm:col-span-1">
                    <Input autoComplete="address-level2" />
                  </Field>
                  <Field label="Postcode" required>
                    <Input autoComplete="postal-code" />
                  </Field>
                  <Field label="Country" required>
                    <Select autoComplete="country-name" defaultValue="US">
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </Select>
                  </Field>
                </div>

                <Divider />

                <RadioGroup
                  legend="Shipping method"
                  appearance="card"
                  options={SHIPPING_METHODS}
                  value={shippingMethod}
                  onChange={setShippingMethod}
                />

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep('contact')}>
                    Back
                  </Button>
                  <Button onClick={() => setStep('payment')}>Continue to payment</Button>
                </div>
              </CardBody>
            </Card>
          ) : null}

          {step === 'payment' ? (
            <Card surface="outline">
              <CardBody className="flex flex-col gap-5">
                <h2 className="font-sans text-lg font-semibold">Payment</h2>

                <Alert tone="info" title="Demo storefront">
                  No payment provider is connected and no card details are stored. Any values you
                  type here go nowhere.
                </Alert>

                <Field label="Card number" required>
                  <Input placeholder="4242 4242 4242 4242" inputMode="numeric" />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Expiry" required>
                    <Input placeholder="MM / YY" inputMode="numeric" />
                  </Field>
                  <Field label="Security code" required>
                    <Input placeholder="123" inputMode="numeric" />
                  </Field>
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep('shipping')}>
                    Back
                  </Button>
                  <Button
                    loading={submitting}
                    onClick={submit}
                    leadingIcon={<Lock className="size-4" />}
                  >
                    Place order · {formatPrice(cart.totalCents)}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : null}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <Card surface="sunken">
            <CardBody className="flex flex-col gap-4">
              <h2 className="font-sans text-base font-semibold">
                {cart.itemCount} {cart.itemCount === 1 ? 'bag' : 'bags'}
              </h2>

              <ul className="flex flex-col gap-3">
                {cart.lines.map((line) => (
                  <li key={line.key} className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{line.productName}</span>
                      <span className="text-muted">
                        {line.size} × {line.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {formatPrice(line.unitPriceCents * line.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <Divider />

              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(cart.subtotalCents)}</dd>
                </div>
                {cart.discountCents > 0 ? (
                  <div className="flex justify-between text-success-text">
                    <dt>Subscription saving</dt>
                    <dd className="tabular-nums">−{formatPrice(cart.discountCents)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="tabular-nums">
                    {cart.shippingCents === 0 ? 'Free' : formatPrice(cart.shippingCents)}
                  </dd>
                </div>
                <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatPrice(cart.totalCents)}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        </aside>
      </div>
    </Container>
  )
}
