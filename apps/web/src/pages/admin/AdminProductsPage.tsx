import type { Product } from '@ember/api/types'
import { PROCESS_LABELS } from '@ember/api/types'
import {
  BagArtwork,
  Badge,
  Button,
  Card,
  Field,
  Input,
  Modal,
  ROAST_LABELS,
  RoastMeter,
  Select,
  Skeleton,
  Stars,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableScroll,
  Textarea,
  colorwayFor,
  formatPrice,
  useToast,
} from '@ember/ui'
import { Pencil, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '../../lib/api'

export function AdminProductsPage() {
  const { data: products, loading } = useQuery<Product[]>('/products')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Product>()

  const visible = (products ?? []).filter((product) =>
    `${product.name} ${product.origin} ${product.region}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-sans text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted">{products?.length ?? 0} coffees in the catalogue</p>
        </div>

        <Button leadingIcon={<Plus className="size-4" />}>Add coffee</Button>
      </header>

      <Input
        size="sm"
        type="search"
        placeholder="Search by name, origin or region"
        aria-label="Search products"
        prefix={<Search className="size-4" />}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="sm:w-72"
      />

      <Card surface="outline" radius="md">
        <TableScroll>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Coffee</TableHeaderCell>
                <TableHeaderCell>Roast</TableHeaderCell>
                <TableHeaderCell>Process</TableHeaderCell>
                <TableHeaderCell>Rating</TableHeaderCell>
                <TableHeaderCell align="right">From</TableHeaderCell>
                <TableHeaderCell align="right">On hand</TableHeaderCell>
                <TableHeaderCell align="right">Edit</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading
                ? Array.from({ length: 8 }, (_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : visible.map((product) => {
                    const onHand = product.variants.reduce(
                      (total, variant) => total + variant.stock,
                      0,
                    )
                    const cheapest = Math.min(
                      ...product.variants.map((variant) => variant.priceCents),
                    )

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="size-10 shrink-0 overflow-hidden rounded-md bg-surface-sunken">
                              <BagArtwork
                                colorway={colorwayFor(product.id)}
                                origin={product.origin}
                                pattern={false}
                              />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{product.name}</p>
                              <p className="truncate text-xs text-muted">{product.region}</p>
                            </div>
                            {product.limitedRelease ? (
                              <Badge tone="accent" size="sm">
                                Limited
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>

                        <TableCell>
                          <RoastMeter level={product.roast} compact />
                        </TableCell>

                        <TableCell className="text-muted whitespace-nowrap">
                          {PROCESS_LABELS[product.process]}
                        </TableCell>

                        <TableCell>
                          <Stars rating={product.rating} size="sm" showValue />
                        </TableCell>

                        <TableCell align="right" className="font-medium tabular-nums">
                          {formatPrice(cheapest)}
                        </TableCell>

                        <TableCell align="right">
                          <Badge
                            tone={onHand === 0 ? 'danger' : onHand < 30 ? 'warning' : 'neutral'}
                            size="sm"
                          >
                            {onHand}
                          </Badge>
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            size="sm"
                            variant="ghost"
                            leadingIcon={<Pencil className="size-3.5" />}
                            onClick={() => setEditing(product)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
            </TableBody>
          </Table>
        </TableScroll>
      </Card>

      <EditProductModal product={editing} onClose={() => setEditing(undefined)} />
    </div>
  )
}

function EditProductModal({ product, onClose }: { product?: Product; onClose: () => void }) {
  const { toast } = useToast()

  if (!product) return null

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={`Edit ${product.name}`}
      description="Changes are local to this session — the seed data resets on restart."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              toast(`${product.name} saved`, { tone: 'success' })
              onClose()
            }}
          >
            Save changes
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <Input defaultValue={product.name} />
          </Field>
          <Field label="Origin" required>
            <Input defaultValue={product.origin} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Region">
            <Input defaultValue={product.region} />
          </Field>
          <Field label="Producer">
            <Input defaultValue={product.producer} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Roast level">
            <Select defaultValue={product.roast}>
              {Object.entries(ROAST_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Process">
            <Select defaultValue={product.process}>
              {Object.entries(PROCESS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Altitude" hint="Metres above sea level">
            <Input type="number" defaultValue={product.altitudeMeters} />
          </Field>
        </div>

        <Field label="Tasting notes" hint="Comma separated, in descending prominence">
          <Input defaultValue={product.tastingNotes.join(', ')} />
        </Field>

        <Field label="Card blurb" hint="One line. Shown on product cards.">
          <Textarea rows={2} defaultValue={product.blurb} />
        </Field>

        <Field label="Story" hint="Long-form copy for the product page">
          <Textarea rows={5} defaultValue={product.story} />
        </Field>
      </form>
    </Modal>
  )
}
