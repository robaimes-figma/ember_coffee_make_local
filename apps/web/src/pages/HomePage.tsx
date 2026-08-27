import type { BrewGuide, Product } from '@ember/api/types'
import {
  BagArtwork,
  Badge,
  Card,
  CardBody,
  Container,
  RoastMeter,
  SectionHeading,
  Stars,
  colorwayFor,
} from '@ember/ui'
import { ArrowRight, Clock, Leaf, Package, Repeat } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { ProductCard } from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/ProductCardSkeleton'
import { useQuery } from '../lib/api'

export function HomePage() {
  const { data: products, loading } = useQuery<Product[]>('/products')
  const { data: guides } = useQuery<BrewGuide[]>('/brew-guides')

  const featured = products?.filter((product) => product.featured).slice(0, 4) ?? []
  const spotlight = products?.find((product) => product.limitedRelease)

  return (
    <>
      <Hero spotlight={spotlight} />

      <Container className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="On the shelf"
          title="What we're roasting this week"
          description="Every bag is roasted to order and shipped within 24 hours. Nothing sits in a warehouse."
          action={
            <ButtonLink
              to="/shop"
              variant="outline"
              trailingIcon={<ArrowRight className="size-4" />}
            >
              See all coffee
            </ButtonLink>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)
            : featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Container>

      <ValueProps />

      <SubscriptionBand />

      <Container className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Brew guides"
          title="Make it taste like it did in the shop"
          description="Four recipes, written for real kitchens rather than competition tables."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {(guides ?? []).slice(0, 4).map((guide) => (
            <Link key={guide.slug} to={`/brew-guides/${guide.slug}`} className="group">
              <Card surface="outline" interactive className="h-full">
                <CardBody className="flex h-full flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="neutral" size="sm">
                      {guide.difficulty}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-subtle">
                      <Clock className="size-3.5" aria-hidden />
                      {guide.minutes} min
                    </span>
                  </div>

                  <h3 className="text-xl transition-colors group-hover:text-accent-text text-balance">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-muted text-pretty">{guide.summary}</p>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-accent-text">
                    Read the recipe
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </>
  )
}

function Hero({ spotlight }: { spotlight?: Product }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface-sunken">
      {/* Warm wash behind the hero, drawn from tokens so it follows the theme */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 15% 0%, var(--sem-accent-soft), transparent 70%)',
        }}
        aria-hidden
      />

      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <Badge tone="accent">Roasted to order in Portland</Badge>

          <h1 className="text-4xl text-balance sm:text-5xl">
            Coffee with a harvest date, not a best-before.
          </h1>

          <p className="max-w-prose text-lg text-muted text-pretty">
            We buy small lots directly from producers, roast them the week you order, and tell you
            exactly what's in the bag — farm, altitude, process and all.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink to="/shop" size="lg" trailingIcon={<ArrowRight className="size-4" />}>
              Shop coffee
            </ButtonLink>
            <ButtonLink to="/subscribe" size="lg" variant="outline">
              Start a subscription
            </ButtonLink>
          </div>

          <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ['14', 'coffees on the shelf'],
              ['24h', 'roast to dispatch'],
              ['9', 'producer relationships'],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col">
                <dt className="font-display text-2xl font-semibold">{value}</dt>
                <dd className="text-sm text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {spotlight ? (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-lg">
              <div className="aspect-square">
                <BagArtwork
                  colorway={colorwayFor(spotlight.id)}
                  origin={spotlight.origin}
                  caption={spotlight.region}
                />
              </div>

              <div className="flex flex-col gap-3 p-6">
                <div className="flex items-center justify-between gap-3">
                  <Badge tone="accent" size="sm">
                    This week's spotlight
                  </Badge>
                  <RoastMeter level={spotlight.roast} />
                </div>

                <div>
                  <h2 className="text-2xl">{spotlight.name}</h2>
                  <p className="text-sm text-muted">
                    {spotlight.region} · {spotlight.varietal}
                  </p>
                </div>

                <p className="text-sm text-muted text-pretty">{spotlight.blurb}</p>

                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <Stars rating={spotlight.rating} reviewCount={spotlight.reviewCount} size="sm" />
                  <Link
                    to={`/shop/${spotlight.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:text-accent"
                  >
                    View coffee
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  )
}

const VALUE_PROPS = [
  {
    icon: Leaf,
    title: 'Bought on relationship',
    body: 'We pay above the Fairtrade floor on every lot and publish what we paid. Nine of our fourteen coffees come from producers we have bought from for three harvests or more.',
  },
  {
    icon: Package,
    title: 'Roasted the week you order',
    body: 'Two roast days a week, and nothing ships more than 24 hours after it leaves the drum. The roast date is printed on the bag, not a best-before guess.',
  },
  {
    icon: Repeat,
    title: 'Cancel whenever',
    body: 'Subscriptions save 10%, skip a delivery from the email, and cancel in two clicks. No retention flow, no phone call.',
  },
]

function ValueProps() {
  return (
    <section className="border-y border-border bg-surface">
      <Container className="grid gap-10 py-8 sm:grid-cols-3">
        {VALUE_PROPS.map((prop) => (
          <div key={prop.title} className="flex flex-col gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
              <prop.icon className="size-5" aria-hidden />
            </span>
            <h3 className="text-lg">{prop.title}</h3>
            <p className="text-sm text-muted text-pretty">{prop.body}</p>
          </div>
        ))}
      </Container>
    </section>
  )
}

function SubscriptionBand() {
  return (
    <section className="bg-surface-inverse text-inverse">
      <Container className="flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-xl flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest uppercase opacity-70">
            Subscriptions
          </p>
          <h2 className="font-display text-3xl text-balance">
            Let us pick. We're quite good at it.
          </h2>
          <p className="text-base opacity-80 text-pretty">
            Tell us how you brew and how much you drink. We rotate through the lots we're most
            excited about, at 10% off, delivered on your schedule.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          <ButtonLink to="/subscribe" size="lg" variant="primary">
            Build a subscription
          </ButtonLink>
          <p className="text-xs opacity-70">From $15.75 a bag · Skip or cancel anytime</p>
        </div>
      </Container>
    </section>
  )
}
