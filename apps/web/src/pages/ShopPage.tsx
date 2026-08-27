import type { Collection, Process, Product } from '@ember/api/types'
import { PROCESS_LABELS } from '@ember/api/types'
import {
  Button,
  Chip,
  Container,
  EmptyState,
  Input,
  ROAST_LABELS,
  ROAST_LEVELS,
  Select,
  type RoastLevel,
} from '@ember/ui'
import { SearchX, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/ProductCardSkeleton'
import { useQuery } from '../lib/api'

const PROCESSES: Process[] = ['washed', 'natural', 'honey', 'anaerobic']

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Highest rated' },
]

const roastSwatch: Record<RoastLevel, string> = {
  light: 'bg-roast-light',
  medium: 'bg-roast-medium',
  'medium-dark': 'bg-roast-dark',
  dark: 'bg-roast-dark',
}

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')

  // Filter state lives in the URL so a filtered shop view is shareable. These
  // are read as raw strings rather than arrays, because a fresh array on every
  // render would invalidate the memo below every time.
  const collection = params.get('collection') ?? 'all'
  const roastParam = params.get('roast') ?? ''
  const processParam = params.get('process') ?? ''
  const sort = params.get('sort') ?? 'newest'

  const roasts = roastParam.split(',').filter(Boolean)
  const processes = processParam.split(',').filter(Boolean)

  const { data: collections } = useQuery<Collection[]>('/collections')

  const query = useMemo(() => {
    const next = new URLSearchParams()
    if (collection !== 'all') next.set('collection', collection)
    if (roastParam) next.set('roast', roastParam)
    if (processParam) next.set('process', processParam)
    if (search.trim()) next.set('search', search.trim())
    next.set('sort', sort)
    return next.toString()
  }, [collection, roastParam, processParam, search, sort])

  const { data: products, loading } = useQuery<Product[]>(`/products?${query}`)

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || value.length === 0) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const toggleInList = (key: string, list: string[], value: string) => {
    const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    update(key, next.join(','))
  }

  const activeCollection = collections?.find((entry) => entry.slug === collection)
  const filterCount = roasts.length + processes.length + (collection !== 'all' ? 1 : 0)

  return (
    <Container className="py-12 sm:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl">{activeCollection?.title ?? 'All coffee'}</h1>
        <p className="max-w-prose text-base text-muted text-pretty">
          {activeCollection?.description ??
            'Fourteen coffees on the shelf right now. Everything is roasted to order — pick by origin, roast level or how you brew.'}
        </p>
      </header>

      {/* Collection row */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Chip selected={collection === 'all'} onClick={() => update('collection', null)}>
          All
        </Chip>
        {(collections ?? []).map((entry) => (
          <Chip
            key={entry.slug}
            selected={collection === entry.slug}
            onClick={() => update('collection', entry.slug)}
          >
            {entry.title}
          </Chip>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        {/* Filter rail */}
        <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-56">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4 text-muted" aria-hidden />
            Filters
            {filterCount > 0 ? (
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="ml-auto text-xs font-medium text-accent-text hover:underline"
              >
                Clear all
              </button>
            ) : null}
          </div>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-1 text-xs font-semibold tracking-widest text-subtle uppercase">
              Roast level
            </legend>
            <div className="flex flex-wrap gap-2">
              {ROAST_LEVELS.map((roast) => (
                <Chip
                  key={roast}
                  selected={roasts.includes(roast)}
                  swatchClassName={roastSwatch[roast]}
                  onClick={() => toggleInList('roast', roasts, roast)}
                >
                  {ROAST_LABELS[roast]}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2.5">
            <legend className="mb-1 text-xs font-semibold tracking-widest text-subtle uppercase">
              Process
            </legend>
            <div className="flex flex-wrap gap-2">
              {PROCESSES.map((entry) => (
                <Chip
                  key={entry}
                  selected={processes.includes(entry)}
                  onClick={() => toggleInList('process', processes, entry)}
                >
                  {PROCESS_LABELS[entry]}
                </Chip>
              ))}
            </div>
          </fieldset>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Input
              type="search"
              placeholder="Search by origin or tasting note"
              aria-label="Search coffees"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sm:max-w-xs"
            />

            <div className="flex items-center gap-3">
              {!loading && products ? (
                <p className="text-sm whitespace-nowrap text-muted">
                  {products.length} {products.length === 1 ? 'coffee' : 'coffees'}
                </p>
              ) : null}

              <Select
                aria-label="Sort coffees"
                value={sort}
                onChange={(event) => update('sort', event.target.value)}
                className="w-44"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {filterCount > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {roasts.map((roast) => (
                <Chip
                  key={roast}
                  onRemove={() => toggleInList('roast', roasts, roast)}
                  swatchClassName={roastSwatch[roast as RoastLevel]}
                >
                  {ROAST_LABELS[roast as RoastLevel]}
                </Chip>
              ))}
              {processes.map((entry) => (
                <Chip key={entry} onRemove={() => toggleInList('process', processes, entry)}>
                  {PROCESS_LABELS[entry as Process]}
                </Chip>
              ))}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }, (_, index) => <ProductCardSkeleton key={index} />)
              : (products ?? []).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {!loading && products?.length === 0 ? (
            <EmptyState
              icon={<SearchX className="size-6" aria-hidden />}
              title="No coffees match those filters"
              description="Try widening the roast range, or clear the filters and start again."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('')
                    setParams(new URLSearchParams(), { replace: true })
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : null}
        </div>
      </div>
    </Container>
  )
}
