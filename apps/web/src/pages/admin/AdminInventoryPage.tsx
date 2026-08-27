import type { Product } from '@ember/api/types'
import {
  Alert,
  Badge,
  Card,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableScroll,
  Tooltip,
} from '@ember/ui'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '../../lib/api'

type StockFilter = 'all' | 'low' | 'out'

/**
 * Inventory is a variant-level view, not a product-level one — a coffee can
 * be comfortably stocked in 250g and sold out in 1kg, and that distinction is
 * what the roastery actually acts on.
 */
export function AdminInventoryPage() {
  const { data: products, loading } = useQuery<Product[]>('/products')
  const [filter, setFilter] = useState<StockFilter>('all')

  const rows = (products ?? []).flatMap((product) =>
    product.variants.map((variant) => ({ product, variant })),
  )

  const visible = rows.filter(({ variant }) => {
    if (filter === 'low') return variant.stock > 0 && variant.stock < 12
    if (filter === 'out') return variant.stock === 0
    return true
  })

  const outOfStock = rows.filter(({ variant }) => variant.stock === 0).length
  const lowStock = rows.filter(({ variant }) => variant.stock > 0 && variant.stock < 12).length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-sans text-2xl font-semibold">Inventory</h1>
        <p className="text-sm text-muted">{rows.length} variants across the catalogue</p>
      </header>

      {outOfStock > 0 ? (
        <Alert tone="warning" title={`${outOfStock} variants are sold out`}>
          Sold-out variants still appear on the storefront with a disabled size button, so
          customers can see what exists rather than wondering why a size vanished.
        </Alert>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
          All variants
        </Chip>
        <Chip selected={filter === 'low'} onClick={() => setFilter('low')}>
          Running low ({lowStock})
        </Chip>
        <Chip selected={filter === 'out'} onClick={() => setFilter('out')}>
          Sold out ({outOfStock})
        </Chip>
      </div>

      <Card surface="outline" radius="md">
        <TableScroll>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Coffee</TableHeaderCell>
                <TableHeaderCell>Size</TableHeaderCell>
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell align="right">Price</TableHeaderCell>
                <TableHeaderCell align="right">On hand</TableHeaderCell>
                <TableHeaderCell>Level</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading
                ? Array.from({ length: 10 }, (_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : visible.map(({ product, variant }) => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="block max-w-52 truncate font-medium">
                            {product.name}
                          </span>
                          {variant.stock === 0 ? (
                            <Tooltip content="Not available to buy">
                              <AlertTriangle className="size-3.5 text-danger" aria-hidden />
                            </Tooltip>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">{variant.size}</TableCell>

                      <TableCell className="font-mono text-xs text-muted">{variant.id}</TableCell>

                      <TableCell align="right" className="tabular-nums">
                        ${(variant.priceCents / 100).toFixed(2)}
                      </TableCell>

                      <TableCell align="right" className="font-medium tabular-nums">
                        {variant.stock}
                      </TableCell>

                      <TableCell>
                        {variant.stock === 0 ? (
                          <Badge tone="danger" size="sm">
                            Sold out
                          </Badge>
                        ) : variant.stock < 12 ? (
                          <Badge tone="warning" size="sm">
                            Low
                          </Badge>
                        ) : (
                          <Badge tone="success" size="sm">
                            Healthy
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableScroll>
      </Card>
    </div>
  )
}
