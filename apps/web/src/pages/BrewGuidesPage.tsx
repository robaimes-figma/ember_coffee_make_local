import type { BrewGuide } from '@ember/api/types'
import {
  Badge,
  Card,
  CardBody,
  Container,
  SectionHeading,
  Skeleton,
} from '@ember/ui'
import { ArrowRight, Clock, Droplets, Thermometer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '../lib/api'

const difficultyTone = {
  easy: 'success',
  medium: 'warning',
  advanced: 'danger',
} as const

export function BrewGuidesPage() {
  const { data: guides, loading } = useQuery<BrewGuide[]>('/brew-guides')

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        size="lg"
        eyebrow="Brew guides"
        title="Recipes that survive a real kitchen"
        description="No competition gear, no 0.1g precision. Four methods, written so they still work when you are half awake."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }, (_, index) => (
              <Card key={index} surface="outline">
                <CardBody className="flex flex-col gap-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardBody>
              </Card>
            ))
          : (guides ?? []).map((guide) => (
              <Link key={guide.slug} to={`/brew-guides/${guide.slug}`} className="group">
                <Card surface="outline" interactive className="h-full">
                  <CardBody className="flex h-full flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={difficultyTone[guide.difficulty]} size="sm">
                        {guide.difficulty}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-subtle">
                        <Clock className="size-3.5" aria-hidden />
                        {guide.minutes} min
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-subtle">
                        <Thermometer className="size-3.5" aria-hidden />
                        {guide.temperatureCelsius}°C
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-subtle">
                        <Droplets className="size-3.5" aria-hidden />
                        {guide.ratio}
                      </span>
                    </div>

                    <h2 className="text-2xl text-balance transition-colors group-hover:text-accent-text">
                      {guide.title}
                    </h2>

                    <p className="text-base text-muted text-pretty">{guide.summary}</p>

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-accent-text">
                      Read the recipe
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </CardBody>
                </Card>
              </Link>
            ))}
      </div>
    </Container>
  )
}
