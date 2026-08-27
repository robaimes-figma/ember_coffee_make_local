import type { BagSize, GrindOption, RoastLevel } from '@ember/api/types'
import { GRIND_LABELS } from '@ember/api/types'
import {
  Accordion,
  Badge,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  RadioGroup,
  ROAST_LABELS,
  SectionHeading,
  formatPrice,
  useToast,
} from '@ember/ui'
import { Coffee, Repeat, Truck } from 'lucide-react'
import { useState } from 'react'

type Cadence = 'weekly' | 'fortnightly' | 'monthly'
type RoastPreference = RoastLevel | 'rotating'

const CADENCES = [
  { value: 'weekly', label: 'Every week', description: 'For households drinking a bag a week' },
  { value: 'fortnightly', label: 'Every two weeks', description: 'The most popular choice' },
  { value: 'monthly', label: 'Every month', description: 'One bag, one month, no waste' },
] as const

const SIZES = [
  { value: '250g', label: '250g', description: 'About 16 cups' },
  { value: '500g', label: '500g', description: 'About 33 cups' },
  { value: '1kg', label: '1kg', description: 'About 66 cups' },
] as const

const GRINDS = [
  { value: 'whole-bean', label: 'Whole bean', description: 'You grind it — best flavour' },
  { value: 'filter', label: 'Filter', description: 'Pour-over and batch brew' },
  { value: 'espresso', label: 'Espresso', description: 'Fine, for a pump machine' },
  { value: 'french-press', label: 'French press', description: 'Coarse, for immersion' },
] as const

const ROASTS = [
  {
    value: 'rotating',
    label: "Let us choose",
    description: 'We rotate through the lots we are most excited about',
  },
  { value: 'light', label: 'Light roasts only', description: 'Fruit-forward, tea-like, acidic' },
  { value: 'medium', label: 'Medium roasts only', description: 'Balanced, sweet, versatile' },
  { value: 'dark', label: 'Dark roasts only', description: 'Chocolate, nuts, low acidity' },
] as const

/** Base price per bag before the subscription discount, in cents. */
const BASE_PRICE: Record<BagSize, number> = {
  '250g': 1950,
  '500g': 3600,
  '1kg': 6600,
}

const DISCOUNT = 0.1

export function SubscribePage() {
  const { toast } = useToast()
  const [cadence, setCadence] = useState<Cadence>('fortnightly')
  const [size, setSize] = useState<BagSize>('250g')
  const [grind, setGrind] = useState<GrindOption>('whole-bean')
  const [roast, setRoast] = useState<RoastPreference>('rotating')

  const perBag = Math.round(BASE_PRICE[size] * (1 - DISCOUNT))
  const shipmentsPerYear = cadence === 'weekly' ? 52 : cadence === 'fortnightly' ? 26 : 12
  const annualSaving = Math.round(BASE_PRICE[size] * DISCOUNT) * shipmentsPerYear

  return (
    <>
      <section className="border-b border-border bg-surface-sunken">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            align="center"
            size="lg"
            eyebrow="Subscriptions"
            title="A standing order for good coffee"
            description="Pick how you brew and how fast you drink it. We handle the rest — including choosing coffees you would not have picked yourself."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Coffee,
                title: 'Save 10%, always',
                body: 'Every recurring bag is 10% below the shelf price. No introductory rate that quietly expires.',
              },
              {
                icon: Truck,
                title: 'Roasted, then shipped',
                body: 'Your bag is roasted on the roast day before it ships. It never sits in a box waiting.',
              },
              {
                icon: Repeat,
                title: 'Skip or stop anytime',
                body: 'Two clicks in any email. No phone call, no retention offer, no dark pattern.',
              },
            ].map((item) => (
              <Card key={item.title} surface="flat">
                <CardBody className="flex flex-col gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="text-sm text-muted text-pretty">{item.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          {/* Builder */}
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl">Build your subscription</h2>

            <RadioGroup
              legend="How often?"
              appearance="card"
              options={CADENCES}
              value={cadence}
              onChange={setCadence}
            />

            <RadioGroup
              legend="How much?"
              appearance="card"
              options={SIZES}
              value={size}
              onChange={setSize}
            />

            <RadioGroup
              legend="Ground how?"
              appearance="card"
              options={GRINDS}
              value={grind}
              onChange={setGrind}
            />

            <RadioGroup
              legend="Which roasts?"
              appearance="card"
              options={ROASTS}
              value={roast}
              onChange={setRoast}
            />

            <Divider />

            <div className="max-w-prose">
              <h3 className="text-lg">Questions people actually ask</h3>
              <Accordion
                className="mt-4"
                single
                items={[
                  {
                    id: 'skip',
                    title: 'What if I go away and coffee piles up?',
                    content:
                      'Skip the next delivery from the link at the bottom of any email, or change your cadence entirely. Skipping does not count as cancelling and does not affect your discount.',
                  },
                  {
                    id: 'choose',
                    title: 'Can I pick the specific coffee?',
                    content:
                      'Yes — set a roast preference and we stay inside it, or subscribe to a single coffee from its own product page. "Let us choose" is the option most subscribers stay on after the first few months.',
                  },
                  {
                    id: 'grind',
                    title: 'Should I get it ground?',
                    content:
                      'Whole bean if you own a burr grinder, ground if you do not. Pre-ground coffee is meaningfully worse after about a week, but it is much better than coffee you never brew because grinding is a hassle.',
                  },
                  {
                    id: 'shipping',
                    title: 'Is shipping included?',
                    content:
                      'Free on every subscription shipment, regardless of size. One-off orders need to reach $60.',
                  },
                ]}
              />
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <Card surface="outline">
              <CardBody className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-sans text-base font-semibold">Your plan</h2>
                  <Badge tone="success" size="sm">
                    Save 10%
                  </Badge>
                </div>

                <dl className="flex flex-col gap-2.5 text-sm">
                  {[
                    ['Frequency', CADENCES.find((entry) => entry.value === cadence)?.label],
                    ['Bag size', size],
                    ['Grind', GRIND_LABELS[grind]],
                    [
                      'Roast',
                      roast === 'rotating' ? 'Our choice, rotating' : `${ROAST_LABELS[roast]} only`,
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt className="text-muted">{label}</dt>
                      <dd className="text-right font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>

                <Divider />

                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted">Per bag</span>
                  <span className="font-display text-2xl font-semibold tabular-nums">
                    {formatPrice(perBag)}
                  </span>
                </div>

                <p className="text-sm text-muted">
                  {shipmentsPerYear} shipments a year · saves{' '}
                  <span className="font-medium text-success-text">
                    {formatPrice(annualSaving)}
                  </span>{' '}
                  annually
                </p>

                <Button
                  size="lg"
                  fullWidth
                  onClick={() =>
                    toast('Subscription started — first bag roasts Monday', { tone: 'success' })
                  }
                >
                  Start subscription
                </Button>

                <p className="text-center text-xs text-subtle">
                  Free shipping on every subscription bag. Cancel anytime.
                </p>
              </CardBody>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  )
}
