import type { BrewGuide } from '@ember/api/types'
import { GRIND_LABELS } from '@ember/api/types'
import {
  Badge,
  Breadcrumbs,
  Card,
  CardBody,
  Container,
  Divider,
  Skeleton,
} from '@ember/ui'
import { Clock, Droplets, Thermometer, Wrench } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { useQuery } from '../lib/api'

export function BrewGuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: guide, loading, error } = useQuery<BrewGuide>(`/brew-guides/${slug}`)

  if (loading) {
    return (
      <Container width="prose" className="py-16">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-8 h-12 w-full" />
        <Skeleton className="mt-3 h-12 w-2/3" />
        <Skeleton className="mt-8 h-24 w-full" shape="block" />
      </Container>
    )
  }

  if (error || !guide) {
    return (
      <Container width="prose" className="py-24">
        <h1 className="text-2xl">We couldn't find that guide</h1>
        <p className="mt-2 text-muted">
          <Link to="/brew-guides" className="font-medium text-accent-text hover:underline">
            Back to all brew guides
          </Link>
        </p>
      </Container>
    )
  }

  return (
    <article>
      <header className="border-b border-border bg-surface-sunken">
        <Container width="prose" className="py-12">
          <Breadcrumbs
            items={[{ label: 'Brew guides', href: '/brew-guides' }, { label: guide.title }]}
            linkAs={({ href, children, className }) => (
              <Link to={href} className={className}>
                {children}
              </Link>
            )}
          />

          <h1 className="mt-6 text-4xl text-balance">{guide.title}</h1>

          <p className="mt-4 text-lg text-muted text-pretty">{guide.summary}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="neutral">{GRIND_LABELS[guide.method]}</Badge>
            <Badge tone="accent">{guide.difficulty}</Badge>
          </div>
        </Container>
      </header>

      <Container width="prose" className="py-12">
        {/* Recipe card */}
        <Card surface="outline">
          <CardBody className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              { icon: Droplets, label: 'Ratio', value: guide.ratio },
              { icon: Thermometer, label: 'Water', value: `${guide.temperatureCelsius}°C` },
              { icon: Clock, label: 'Total time', value: `${guide.minutes} min` },
              { icon: Wrench, label: 'Difficulty', value: guide.difficulty },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-1.5 text-2xs font-semibold tracking-wide text-subtle uppercase">
                  <item.icon className="size-3.5" aria-hidden />
                  {item.label}
                </span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Gear */}
        <section className="mt-12">
          <h2 className="text-xl">What you need</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {guide.gear.map((item) => (
              <li key={item}>
                <Badge tone="neutral">{item}</Badge>
              </li>
            ))}
          </ul>
        </section>

        <Divider className="my-12" />

        {/* Steps */}
        <section>
          <h2 className="text-xl">The method</h2>

          <ol className="mt-6 flex flex-col">
            {guide.steps.map((step, index) => (
              <li key={step.title} className="flex gap-5">
                {/* Timeline rail */}
                <div className="flex flex-col items-center">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs font-semibold text-accent-text">
                    {step.at}
                  </span>
                  {index < guide.steps.length - 1 ? (
                    <span className="w-px flex-1 bg-border" aria-hidden />
                  ) : null}
                </div>

                <div className="flex flex-col gap-2 pb-10">
                  <h3 className="text-lg">{step.title}</h3>
                  <p className="text-base leading-relaxed text-muted text-pretty">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Card surface="sunken" className="mt-8">
          <CardBody className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-sans text-base font-semibold">Need coffee to brew?</h2>
              <p className="text-sm text-muted">
                Everything on the shelf is roasted to order.
              </p>
            </div>
            <ButtonLink to="/shop" variant="secondary">
              Shop coffee
            </ButtonLink>
          </CardBody>
        </Card>
      </Container>
    </article>
  )
}
