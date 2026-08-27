import {
  Accordion,
  Alert,
  Avatar,
  AvatarGroup,
  BagArtwork,
  Badge,
  Breadcrumbs,
  Button,
  COLORWAYS,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  Container,
  Divider,
  Drawer,
  EmptyState,
  Field,
  IconButton,
  Input,
  Modal,
  Pagination,
  Price,
  QuantityStepper,
  ROAST_LABELS,
  ROAST_LEVELS,
  RadioGroup,
  RoastMeter,
  Select,
  Skeleton,
  Spinner,
  Stars,
  StatTile,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableScroll,
  Tabs,
  Textarea,
  Tooltip,
  useToast,
} from '@ember/ui'
import { Coffee, Heart, Moon, Search, Sun, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTheme } from '../lib/theme'

/**
 * The gallery.
 *
 * Every component, in every state, on one page. This is the fastest way to
 * see what a token change actually did — edit a value in tokens.css, look
 * here, and the whole system is in front of you at once.
 *
 * Not linked from the storefront navigation; reachable at /_gallery.
 */
export function GalleryPage() {
  const { mode, toggle } = useTheme()
  const { toast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checked, setChecked] = useState(true)
  const [switched, setSwitched] = useState(true)
  const [radio, setRadio] = useState<'filter' | 'espresso' | 'press'>('filter')
  const [quantity, setQuantity] = useState(2)
  const [tab, setTab] = useState<'overview' | 'notes'>('overview')
  const [pillTab, setPillTab] = useState<'all' | 'active'>('all')
  const [page, setPage] = useState(3)
  const [chips, setChips] = useState<string[]>(['light'])

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-canvas/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex flex-col leading-tight">
            <h1 className="font-display text-lg font-semibold">Ember design system</h1>
            <p className="text-xs text-subtle">
              Every component, every state · {mode} mode
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leadingIcon={
                mode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />
              }
              onClick={toggle}
            >
              {mode === 'light' ? 'Dark' : 'Light'}
            </Button>
          </div>
        </Container>
      </header>

      <Container className="flex flex-col gap-16 py-12">
        {/* ---- Tokens ---- */}
        <Section
          title="Colour tokens"
          description="Semantic roles, not palette values. These are what components reference."
        >
          <div className="flex flex-col gap-6">
            <SwatchRow
              label="Surfaces"
              swatches={[
                ['canvas', 'bg-canvas'],
                ['surface', 'bg-surface'],
                ['surface-sunken', 'bg-surface-sunken'],
                ['surface-hover', 'bg-surface-hover'],
                ['surface-inverse', 'bg-surface-inverse'],
              ]}
            />
            <SwatchRow
              label="Accent"
              swatches={[
                ['accent', 'bg-accent'],
                ['accent-hover', 'bg-accent-hover'],
                ['accent-soft', 'bg-accent-soft'],
              ]}
            />
            <SwatchRow
              label="Status"
              swatches={[
                ['success', 'bg-success'],
                ['warning', 'bg-warning'],
                ['danger', 'bg-danger'],
                ['info', 'bg-info'],
              ]}
            />
            <SwatchRow
              label="Roast levels"
              swatches={[
                ['roast-light', 'bg-roast-light'],
                ['roast-medium', 'bg-roast-medium'],
                ['roast-medium-dark', 'bg-roast-medium-dark'],
                ['roast-dark', 'bg-roast-dark'],
              ]}
            />

            <div>
              <p className="mb-3 text-xs font-semibold tracking-widest text-subtle uppercase">
                Text on canvas
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-content">text-content — primary body copy</p>
                <p className="text-muted">text-muted — secondary copy and captions</p>
                <p className="text-subtle">text-subtle — timestamps, placeholders, meta</p>
                <p className="text-accent-text">text-accent-text — links and emphasis</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Type scale" description="Each step carries its own leading and tracking.">
          <div className="flex flex-col gap-3">
            {[
              ['text-5xl', 'Coffee with a harvest date'],
              ['text-4xl', 'Coffee with a harvest date'],
              ['text-3xl', 'Coffee with a harvest date'],
              ['text-2xl', 'Coffee with a harvest date'],
              ['text-xl', 'Coffee with a harvest date'],
              ['text-lg', 'Coffee with a harvest date'],
              ['text-base', 'Coffee with a harvest date'],
              ['text-sm', 'Coffee with a harvest date'],
              ['text-xs', 'Coffee with a harvest date'],
              ['text-2xs', 'COFFEE WITH A HARVEST DATE'],
            ].map(([className, sample]) => (
              <div key={className} className="flex items-baseline gap-6 border-b border-border pb-3">
                <code className="w-24 shrink-0 font-mono text-xs text-subtle">{className}</code>
                <span className={`${className} font-display`}>{sample}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Radius, shadow and spacing">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Radius</p>
              <div className="flex flex-wrap gap-3">
                {['rounded-xs', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl'].map(
                  (radius) => (
                    <div key={radius} className="flex flex-col items-center gap-1.5">
                      <div className={`size-14 border border-border bg-surface-sunken ${radius}`} />
                      <code className="font-mono text-2xs text-subtle">
                        {radius.replace('rounded-', '')}
                      </code>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Shadow</p>
              <div className="flex flex-wrap gap-4">
                {['shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl'].map((shadow) => (
                  <div key={shadow} className="flex flex-col items-center gap-1.5">
                    <div className={`size-14 rounded-lg bg-surface ${shadow}`} />
                    <code className="font-mono text-2xs text-subtle">
                      {shadow.replace('shadow-', '')}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Spacing</p>
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4, 6, 8, 12].map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <code className="w-8 font-mono text-2xs text-subtle">{step}</code>
                    <div className="h-3 rounded-xs bg-accent-soft" style={{ width: step * 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Divider />

        {/* ---- Buttons ---- */}
        <Section title="Button" description="Six variants, three sizes, plus loading and disabled.">
          <div className="flex flex-col gap-6">
            <Row label="Variants">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
            </Row>

            <Row label="Sizes">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>

            <Row label="With icons">
              <Button leadingIcon={<Coffee className="size-4" />}>Leading</Button>
              <Button variant="outline" trailingIcon={<Heart className="size-4" />}>
                Trailing
              </Button>
            </Row>

            <Row label="States">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button variant="danger" disabled>
                Disabled danger
              </Button>
            </Row>

            <Row label="Full width">
              <Button fullWidth>Full width</Button>
            </Row>

            <Row label="IconButton">
              <IconButton label="Primary" variant="primary" icon={<Heart className="size-4" />} />
              <IconButton
                label="Secondary"
                variant="secondary"
                icon={<Heart className="size-4" />}
              />
              <IconButton label="Outline" variant="outline" icon={<Heart className="size-4" />} />
              <IconButton label="Ghost" variant="ghost" icon={<Heart className="size-4" />} />
              <IconButton label="Delete" variant="danger" icon={<Trash2 className="size-4" />} />
              <IconButton label="Small" size="sm" icon={<Heart className="size-4" />} />
              <IconButton label="Large" size="lg" icon={<Heart className="size-4" />} />
            </Row>
          </div>
        </Section>

        {/* ---- Badges and chips ---- */}
        <Section title="Badge and Chip">
          <div className="flex flex-col gap-6">
            <Row label="Badge tones">
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="accent">Accent</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="danger">Danger</Badge>
              <Badge tone="info">Info</Badge>
              <Badge tone="inverse">Inverse</Badge>
            </Row>

            <Row label="Badge with dot / small">
              <Badge tone="success" dot>
                Delivered
              </Badge>
              <Badge tone="warning" dot size="sm">
                Roasting
              </Badge>
              <Badge tone="neutral" size="sm">
                250g
              </Badge>
            </Row>

            <Row label="Chip — toggle">
              {ROAST_LEVELS.map((roast) => (
                <Chip
                  key={roast}
                  selected={chips.includes(roast)}
                  swatchClassName={`bg-roast-${roast}`}
                  onClick={() =>
                    setChips((current) =>
                      current.includes(roast)
                        ? current.filter((entry) => entry !== roast)
                        : [...current, roast],
                    )
                  }
                >
                  {ROAST_LABELS[roast]}
                </Chip>
              ))}
            </Row>

            <Row label="Chip — removable">
              <Chip onRemove={() => undefined}>Washed</Chip>
              <Chip onRemove={() => undefined} swatchClassName="bg-roast-light">
                Light roast
              </Chip>
            </Row>
          </div>
        </Section>

        {/* ---- Forms ---- */}
        <Section title="Form controls" description="All of them sit inside a Field.">
          <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
            <Field label="Email" hint="We only email about your order.">
              <Input type="email" placeholder="you@example.com" />
            </Field>

            <Field label="Email" error="That address doesn't look right.">
              <Input type="email" defaultValue="not-an-email" />
            </Field>

            <Field label="Search" labelHidden>
              <Input type="search" placeholder="Search coffees" prefix={<Search className="size-4" />} />
            </Field>

            <Field label="Disabled">
              <Input disabled defaultValue="Can't touch this" />
            </Field>

            <Field label="Grind">
              <Select defaultValue="filter">
                <option value="whole-bean">Whole bean</option>
                <option value="filter">Filter</option>
                <option value="espresso">Espresso</option>
              </Select>
            </Field>

            <Field label="Small select">
              <Select size="sm" defaultValue="250g">
                <option>250g</option>
                <option>500g</option>
                <option>1kg</option>
              </Select>
            </Field>

            <Field label="Tasting notes" hint="What did you taste?" className="sm:col-span-2">
              <Textarea placeholder="Blueberry, jasmine, dark chocolate…" />
            </Field>

            <div className="flex flex-col gap-3">
              <Checkbox
                label="Send me the weekly roast list"
                description="One email a week."
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
              />
              <Checkbox label="Unchecked" />
              <Checkbox label="Indeterminate" indeterminate checked readOnly />
              <Checkbox label="Disabled" disabled />
            </div>

            <div className="flex flex-col gap-4">
              <Switch
                controlFirst
                checked={switched}
                onChange={setSwitched}
                label="Subscription"
                description="Save 10% on every bag."
              />
              <Switch checked={false} onChange={() => undefined} label="Justified label" />
              <Switch checked disabled onChange={() => undefined} label="Disabled" />
            </div>

            <RadioGroup
              legend="Radio — list"
              options={[
                { value: 'filter', label: 'Filter' },
                { value: 'espresso', label: 'Espresso' },
                { value: 'press', label: 'French press', disabled: true },
              ]}
              value={radio}
              onChange={setRadio}
            />

            <RadioGroup
              legend="Radio — card"
              appearance="card"
              options={[
                { value: 'filter', label: 'Filter', description: 'Pour-over and batch' },
                { value: 'espresso', label: 'Espresso', description: 'Fine, for a pump machine' },
              ]}
              value={radio}
              onChange={setRadio}
            />

            <Row label="QuantityStepper">
              <QuantityStepper label="Demo quantity" value={quantity} onChange={setQuantity} />
              <QuantityStepper
                size="sm"
                label="Small demo quantity"
                value={quantity}
                onChange={setQuantity}
              />
            </Row>
          </div>
        </Section>

        {/* ---- Feedback ---- */}
        <Section title="Feedback">
          <div className="flex flex-col gap-4">
            <Alert tone="info" title="Roast day is Thursday">
              Orders placed before 9am go out this evening.
            </Alert>
            <Alert tone="success" title="Order confirmed">
              Reference EMB-4284. We'll email tracking when it ships.
            </Alert>
            <Alert tone="warning" title="Only 4 bags left">
              This lot is nearly gone and we don't expect to see it again this harvest.
            </Alert>
            <Alert
              tone="danger"
              title="Payment failed"
              onDismiss={() => undefined}
              action={
                <Button size="sm" variant="secondary">
                  Try again
                </Button>
              }
            >
              Your card was declined. Nothing has been charged.
            </Alert>

            <Row label="Toasts">
              <Button variant="secondary" onClick={() => toast('Saved')}>
                Neutral
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast('Added to your cart', { tone: 'success' })}
              >
                Success
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast('Could not update that order', { tone: 'danger' })}
              >
                Danger
              </Button>
            </Row>

            <Row label="Spinner">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </Row>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-widest text-subtle uppercase">
                Skeleton
              </p>
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-3">
                <Skeleton shape="circle" className="size-10" />
                <Skeleton shape="block" className="h-16 w-48" />
              </div>
            </div>

            <Card surface="outline">
              <EmptyState
                icon={<Coffee className="size-6" aria-hidden />}
                title="Nothing here yet"
                description="Empty states always get an icon, a title, a sentence and a way out."
                action={<Button variant="secondary">Browse coffee</Button>}
              />
            </Card>
          </div>
        </Section>

        {/* ---- Overlays ---- */}
        <Section title="Overlays">
          <Row label="Triggers">
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
            <Tooltip content="Tooltip on top">
              <Button variant="outline">Hover me</Button>
            </Tooltip>
            <Tooltip content="Tooltip below" side="bottom">
              <IconButton label="Tooltip demo" variant="outline" icon={<Heart className="size-4" />} />
            </Tooltip>
          </Row>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Cancel this subscription?"
            description="The next shipment is scheduled for 3 September."
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Keep it
                </Button>
                <Button variant="danger" onClick={() => setModalOpen(false)}>
                  Cancel subscription
                </Button>
              </>
            }
          >
            <p className="text-sm text-muted">
              You'll keep access to subscriber pricing until the end of the current period. You can
              restart at any time without losing your grind and roast preferences.
            </p>
          </Modal>

          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="EMB-4271"
            description="Amara Okonkwo · Portland"
            footer={
              <Button fullWidth onClick={() => setDrawerOpen(false)}>
                Close
              </Button>
            }
          >
            <p className="text-sm text-muted">
              Drawers are used for the storefront cart and the admin order detail panel.
            </p>
          </Drawer>
        </Section>

        {/* ---- Navigation ---- */}
        <Section title="Navigation">
          <div className="flex flex-col gap-8">
            <Row label="Breadcrumbs">
              <Breadcrumbs
                items={[
                  { label: 'Shop', href: '#' },
                  { label: 'Ethiopia', href: '#' },
                  { label: 'Guji Uraga' },
                ]}
              />
            </Row>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest text-subtle uppercase">
                Tabs — underline
              </p>
              <Tabs
                label="Gallery underline tabs"
                items={[
                  { value: 'overview', label: 'The story' },
                  { value: 'notes', label: 'Reviews', count: 18 },
                ]}
                value={tab}
                onChange={setTab}
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest text-subtle uppercase">
                Tabs — pill
              </p>
              <Tabs
                label="Gallery pill tabs"
                appearance="pill"
                className="self-start"
                items={[
                  { value: 'all', label: 'All' },
                  { value: 'active', label: 'Active', count: 26 },
                ]}
                value={pillTab}
                onChange={setPillTab}
              />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest text-subtle uppercase">
                Pagination
              </p>
              <Pagination
                page={page}
                pageCount={12}
                onPageChange={setPage}
                summary="Showing 25–36 of 142"
              />
            </div>

            <div className="max-w-prose">
              <p className="mb-3 text-xs font-semibold tracking-widest text-subtle uppercase">
                Accordion
              </p>
              <Accordion
                defaultOpen={['one']}
                items={[
                  {
                    id: 'one',
                    title: 'Can I pick the specific coffee?',
                    content:
                      'Yes — set a roast preference and we stay inside it, or subscribe to a single coffee from its own product page.',
                  },
                  {
                    id: 'two',
                    title: 'Should I get it ground?',
                    content:
                      'Whole bean if you own a burr grinder, ground if you do not.',
                  },
                ]}
              />
            </div>
          </div>
        </Section>

        {/* ---- Data display ---- */}
        <Section title="Data display">
          <div className="flex flex-col gap-8">
            <Row label="Avatar">
              <Avatar name="Amara Okonkwo" size="xs" />
              <Avatar name="Tobias Lindqvist" size="sm" />
              <Avatar name="Priya Raghunathan" size="md" />
              <Avatar name="Idris Mbeki" size="lg" />
              <AvatarGroup
                names={['Amara Okonkwo', 'Tobias Lindqvist', 'Priya Raghunathan', 'Idris Mbeki', 'Noor Alvarez', 'Wren Whitlock']}
              />
            </Row>

            <Row label="Stars">
              <Stars rating={5} />
              <Stars rating={4.5} showValue />
              <Stars rating={3.2} reviewCount={214} />
              <Stars rating={1} size="sm" />
            </Row>

            <Row label="Price">
              <Price cents={1950} size="sm" />
              <Price cents={1950} size="md" />
              <Price cents={1950} size="lg" />
              <Price cents={1755} compareAtCents={1950} size="xl" />
            </Row>

            <Row label="RoastMeter">
              {ROAST_LEVELS.map((roast) => (
                <RoastMeter key={roast} level={roast} />
              ))}
              <RoastMeter level="medium" compact />
            </Row>

            <div className="grid gap-4 sm:grid-cols-4">
              <StatTile label="Revenue, 7 days" value="$4,182.50" deltaPercent={12.4} deltaCaption="vs. prev 7 days" />
              <StatTile label="Orders" value="38" deltaPercent={-6.2} deltaCaption="vs. prev 7 days" />
              <StatTile label="Refund rate" value="1.4%" deltaPercent={-0.8} deltaCaption="vs. prev 7 days" invertDelta />
              <StatTile label="Coffees" value="14" />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Table</p>
              <Card surface="outline" radius="md">
                <TableScroll>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Reference</TableHeaderCell>
                        <TableHeaderCell>Customer</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell align="right">Total</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        ['EMB-4281', 'Amara Okonkwo', 'success', 'Delivered', '$42.50'],
                        ['EMB-4280', 'Tobias Lindqvist', 'warning', 'Roasting', '$19.50'],
                        ['EMB-4279', 'Priya Raghunathan', 'info', 'Shipped', '$66.00'],
                      ].map(([reference, customer, tone, status, total]) => (
                        <TableRow key={reference} clickable>
                          <TableCell className="font-mono text-xs">{reference}</TableCell>
                          <TableCell>{customer}</TableCell>
                          <TableCell>
                            <Badge tone={tone as 'success'} size="sm" dot>
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell align="right" className="tabular-nums">
                            {total}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableScroll>
              </Card>
            </div>
          </div>
        </Section>

        {/* ---- Cards ---- */}
        <Section title="Card surfaces">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(['raised', 'flat', 'sunken', 'outline'] as const).map((surface) => (
              <Card key={surface} surface={surface}>
                <CardHeader>
                  <CardTitle className="text-base">{surface}</CardTitle>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-sm text-muted">
                    Composed as Card, CardHeader, CardBody, CardFooter.
                  </p>
                </CardBody>
                <CardFooter>
                  <Button size="sm" variant="ghost">
                    Action
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>

        {/* ---- Product artwork ---- */}
        <Section
          title="BagArtwork"
          description="Product imagery, drawn from tokens. Six colourways, assigned deterministically per product."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {COLORWAYS.map((colorway) => (
              <div key={colorway} className="flex flex-col gap-2">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <BagArtwork colorway={colorway} origin="Ethiopia" caption="Natural" />
                </div>
                <code className="font-mono text-2xs text-subtle">{colorway}</code>
              </div>
            ))}
          </div>
        </Section>
      </Container>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-xl font-semibold">{title}</h2>
        {description ? <p className="max-w-prose text-sm text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-widest text-subtle uppercase">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function SwatchRow({ label, swatches }: { label: string; swatches: [string, string][] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-widest text-subtle uppercase">{label}</p>
      <div className="flex flex-wrap gap-3">
        {swatches.map(([name, className]) => (
          <div key={name} className="flex flex-col items-start gap-1.5">
            <div className={`size-16 rounded-lg border border-border ${className}`} />
            <code className="font-mono text-2xs text-subtle">{name}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
