import type { BagSize, GrindOption, Product, Review, Variant } from '@ember/api/types'
import { GRIND_LABELS, PROCESS_LABELS } from '@ember/api/types'
import {
  Accordion,
  BagArtwork,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Price,
  QuantityStepper,
  ROAST_LABELS,
  RoastMeter,
  Skeleton,
  Stars,
  Switch,
  Tabs,
  colorwayFor,
  useToast,
} from '@ember/ui'
import { Check, MapPin, Mountain, ShoppingBag, Sprout } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useQuery } from '../lib/api'
import { useCart } from '../lib/cart'

interface ProductResponse {
  product: Product
  related: Product[]
  reviews: Review[]
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading, error } = useQuery<ProductResponse>(`/products/${slug}`)

  if (loading) return <ProductSkeleton />

  if (error || !data) {
    return (
      <Container className="py-24">
        <h1 className="text-2xl">We couldn't find that coffee</h1>
        <p className="mt-2 text-muted">
          It may have sold out and been retired.{' '}
          <Link to="/shop" className="font-medium text-accent-text hover:underline">
            Browse what's on the shelf
          </Link>
          .
        </p>
      </Container>
    )
  }

  return <ProductDetail data={data} />
}

function ProductDetail({ data }: { data: ProductResponse }) {
  const { product, related, reviews } = data
  const cart = useCart()
  const { toast } = useToast()

  const firstAvailable =
    product.variants.find((variant) => variant.stock > 0) ?? product.variants[0]

  const [variant, setVariant] = useState<Variant>(firstAvailable)
  const [grind, setGrind] = useState<GrindOption>(product.brewMethods[0] ?? 'whole-bean')
  const [quantity, setQuantity] = useState(1)
  const [subscribe, setSubscribe] = useState(false)
  const [tab, setTab] = useState<'story' | 'reviews'>('story')

  const soldOut = variant.stock === 0
  const lowStock = variant.stock > 0 && variant.stock < 12

  const addToCart = () => {
    cart.add({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      size: variant.size as BagSize,
      grind,
      unitPriceCents: variant.priceCents,
      quantity,
      subscription: subscribe,
    })

    toast(`${product.name} added to your cart`, { tone: 'success' })
  }

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: product.origin, href: `/shop?search=${product.origin}` },
          { label: product.name },
        ]}
        linkAs={({ href, children, className }) => (
          <Link to={href} className={className}>
            {children}
          </Link>
        )}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Artwork */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl bg-surface-sunken">
            <div className="aspect-square">
              <BagArtwork
                colorway={colorwayFor(product.id)}
                origin={product.origin}
                caption={product.process}
              />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: MapPin, label: 'Region', value: product.region },
              { icon: Mountain, label: 'Altitude', value: `${product.altitudeMeters}m` },
              { icon: Sprout, label: 'Varietal', value: product.varietal },
              { icon: Check, label: 'Process', value: PROCESS_LABELS[product.process] },
            ].map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3"
              >
                <dt className="flex items-center gap-1.5 text-2xs font-semibold tracking-wide text-subtle uppercase">
                  <fact.icon className="size-3.5" aria-hidden />
                  {fact.label}
                </dt>
                <dd className="text-sm font-medium text-content">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Buy box */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {product.limitedRelease ? <Badge tone="accent">Limited release</Badge> : null}
              <Badge tone="neutral">{ROAST_LABELS[product.roast]} roast</Badge>
              <Badge tone="neutral">{PROCESS_LABELS[product.process]}</Badge>
            </div>

            <p className="text-sm font-semibold tracking-widest text-subtle uppercase">
              {product.origin}
            </p>

            <h1 className="text-3xl sm:text-4xl">{product.name}</h1>

            <Stars rating={product.rating} showValue reviewCount={product.reviewCount} />

            <p className="text-lg text-muted text-pretty">{product.blurb}</p>
          </div>

          {/* Tasting notes */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-widest text-subtle uppercase">
              Tasting notes
            </p>
            <div className="flex flex-wrap gap-2">
              {product.tastingNotes.map((note) => (
                <Badge key={note} tone="accent">
                  {note}
                </Badge>
              ))}
            </div>
          </div>

          <RoastMeter level={product.roast} />

          <Divider />

          {/* Size */}
          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-1 text-sm font-medium">Bag size</legend>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((entry) => {
                const selected = entry.id === variant.id
                const unavailable = entry.stock === 0

                return (
                  <button
                    key={entry.id}
                    type="button"
                    disabled={unavailable}
                    aria-pressed={selected}
                    onClick={() => setVariant(entry)}
                    className={`flex min-w-24 flex-col items-start gap-0.5 rounded-lg border px-3 py-2 transition-colors ${
                      selected
                        ? 'border-accent bg-accent-soft'
                        : 'border-border hover:border-border-strong'
                    } ${unavailable ? 'cursor-not-allowed opacity-45' : ''}`}
                  >
                    <span className="text-sm font-semibold">{entry.size}</span>
                    <span className="text-xs text-muted tabular-nums">
                      {unavailable ? 'Sold out' : `$${(entry.priceCents / 100).toFixed(2)}`}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Grind */}
          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-1 text-sm font-medium">Grind</legend>
            <div className="flex flex-wrap gap-2">
              {product.brewMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  aria-pressed={grind === method}
                  onClick={() => setGrind(method)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    grind === method
                      ? 'border-accent bg-accent-soft text-accent-text'
                      : 'border-border text-muted hover:border-border-strong hover:text-content'
                  }`}
                >
                  {GRIND_LABELS[method]}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Subscription toggle */}
          <div className="rounded-lg border border-border bg-surface-sunken p-4">
            <Switch
              controlFirst
              checked={subscribe}
              onChange={setSubscribe}
              label="Make it a subscription — save 10%"
              description="Delivered on your schedule. Skip or cancel from any email."
            />
          </div>

          {/* Add to cart */}
          <div className="flex flex-col gap-3">
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Quantity</span>
                <QuantityStepper
                  label={`${product.name} quantity`}
                  value={quantity}
                  onChange={setQuantity}
                  max={Math.max(1, variant.stock)}
                />
              </div>

              <div className="ml-auto text-right">
                <Price
                  cents={
                    subscribe
                      ? Math.round(variant.priceCents * 0.9) * quantity
                      : variant.priceCents * quantity
                  }
                  compareAtCents={subscribe ? variant.priceCents * quantity : variant.compareAtCents}
                  size="xl"
                />
              </div>
            </div>

            <Button
              size="lg"
              fullWidth
              disabled={soldOut}
              onClick={addToCart}
              leadingIcon={<ShoppingBag className="size-4" />}
            >
              {soldOut ? 'Sold out' : 'Add to cart'}
            </Button>

            {lowStock ? (
              <p className="text-sm text-warning-text">
                Only {variant.stock} bags of this size left in this lot.
              </p>
            ) : (
              <p className="text-sm text-muted">
                Roasted on the next roast day — Monday or Thursday.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Story / reviews */}
      <div className="mt-20">
        <Tabs
          label="Product details"
          items={[
            { value: 'story', label: 'The story' },
            { value: 'reviews', label: 'Reviews', count: reviews.length },
          ]}
          value={tab}
          onChange={setTab}
        />

        <div className="mt-8">
          {tab === 'story' ? (
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="max-w-prose text-lg leading-relaxed text-pretty">{product.story}</p>

                <div className="mt-8 max-w-prose">
                  <Accordion
                    defaultOpen={['brewing']}
                    items={[
                      {
                        id: 'brewing',
                        title: 'How we would brew it',
                        content: `We drink this one mostly as ${GRIND_LABELS[
                          product.brewMethods[0] ?? 'whole-bean'
                        ].toLowerCase()}. Start at a 1:16 ratio and adjust from there — if it tastes thin, grind finer before you change anything else.`,
                      },
                      {
                        id: 'shipping',
                        title: 'Roasting and shipping',
                        content:
                          'Roast days are Monday and Thursday. Orders placed before 9am on a roast day go out the same evening; everything else waits for the next one, because shipping stale coffee defeats the point.',
                      },
                      {
                        id: 'producer',
                        title: 'Who grew it',
                        content: `${product.producer}, in ${product.region}, at around ${product.altitudeMeters} metres. We publish what we paid for every lot on the transparency page.`,
                      },
                    ]}
                  />
                </div>
              </div>

              <Card surface="sunken" className="h-fit">
                <CardBody className="flex flex-col gap-4">
                  <p className="text-xs font-semibold tracking-widest text-subtle uppercase">
                    At a glance
                  </p>
                  <dl className="flex flex-col gap-3 text-sm">
                    {[
                      ['Producer', product.producer],
                      ['Region', product.region],
                      ['Altitude', `${product.altitudeMeters} m`],
                      ['Varietal', product.varietal],
                      ['Process', PROCESS_LABELS[product.process]],
                      ['Roast', `${ROAST_LABELS[product.roast]}`],
                      ['Released', product.releasedOn],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-b border-border pb-2 last:border-0">
                        <dt className="shrink-0 text-muted">{label}</dt>
                        <dd className="text-right font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardBody>
              </Card>
            </div>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="text-2xl">You might also like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <ProductCard key={entry.id} product={entry} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  )
}

function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-muted">No reviews for this lot yet.</p>
  }

  return (
    <ul className="grid max-w-4xl gap-6 sm:grid-cols-2">
      {reviews.map((review) => (
        <li key={review.id}>
          <Card surface="outline" className="h-full">
            <CardBody className="flex h-full flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <Stars rating={review.rating} size="sm" />
                <span className="text-xs text-subtle">{review.createdOn}</span>
              </div>

              <p className="font-semibold">{review.title}</p>
              <p className="text-sm text-muted text-pretty">{review.body}</p>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                <span className="text-sm font-medium">{review.author}</span>
                {review.verifiedPurchase ? (
                  <Badge tone="success" size="sm" dot>
                    Verified
                  </Badge>
                ) : null}
                <Badge tone="neutral" size="sm">
                  {GRIND_LABELS[review.brewMethod]}
                </Badge>
              </div>
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  )
}

function ProductSkeleton() {
  return (
    <Container className="py-12">
      <Skeleton className="h-4 w-64" />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton shape="block" className="aspect-square w-full rounded-2xl" />

        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />

          <div className="mt-6 flex gap-2">
            <Skeleton shape="block" className="h-16 w-24" />
            <Skeleton shape="block" className="h-16 w-24" />
            <Skeleton shape="block" className="h-16 w-24" />
          </div>

          <Skeleton shape="block" className="mt-6 h-12 w-full" />
        </div>
      </div>
    </Container>
  )
}
