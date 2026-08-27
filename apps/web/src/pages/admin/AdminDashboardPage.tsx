import type { Order, Product, Subscription } from '@ember/api/types'
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Skeleton,
  StatTile,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableScroll,
  formatPrice,
} from '@ember/ui'
import { Coffee, DollarSign, Package, Repeat } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OrderStatusBadge } from '../../components/OrderStatusBadge'
import { useQuery } from '../../lib/api'

export function AdminDashboardPage() {
  const { data: orders, loading } = useQuery<Order[]>('/orders')
  const { data: products } = useQuery<Product[]>('/products')
  const { data: subscriptions } = useQuery<Subscription[]>('/subscriptions')

  const last7 = orders?.filter((order) => daysSince(order.placedAt) <= 7) ?? []
  const previous7 =
    orders?.filter((order) => {
      const days = daysSince(order.placedAt)
      return days > 7 && days <= 14
    }) ?? []

  const revenue = sum(last7.map((order) => order.totalCents))
  const previousRevenue = sum(previous7.map((order) => order.totalCents))
  const activeSubs = subscriptions?.filter((sub) => sub.status === 'active').length ?? 0

  const needsAttention =
    orders?.filter((order) => order.status === 'pending' || order.status === 'roasting') ?? []

  const lowStock =
    products?.flatMap((product) =>
      product.variants
        .filter((variant) => variant.stock > 0 && variant.stock < 12)
        .map((variant) => ({ product, variant })),
    ) ?? []

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-sans text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted">Thursday 27 August · roast day</p>
      </header>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} shape="block" className="h-28" />
          ))
        ) : (
          <>
            <StatTile
              label="Revenue, 7 days"
              value={formatPrice(revenue)}
              deltaPercent={percentChange(revenue, previousRevenue)}
              deltaCaption="vs. previous 7 days"
              icon={<DollarSign className="size-4" aria-hidden />}
            />
            <StatTile
              label="Orders, 7 days"
              value={last7.length}
              deltaPercent={percentChange(last7.length, previous7.length)}
              deltaCaption="vs. previous 7 days"
              icon={<Package className="size-4" aria-hidden />}
            />
            <StatTile
              label="Active subscriptions"
              value={activeSubs}
              deltaPercent={4.2}
              deltaCaption="vs. last month"
              icon={<Repeat className="size-4" aria-hidden />}
            />
            <StatTile
              label="Coffees on the shelf"
              value={products?.length ?? 0}
              icon={<Coffee className="size-4" aria-hidden />}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Roast queue */}
        <Card surface="outline" className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle className="font-sans text-base">Roast queue</CardTitle>
              <p className="text-sm text-muted">
                {needsAttention.length} orders waiting on today's roast
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-accent-text hover:underline"
            >
              All orders
            </Link>
          </CardHeader>

          <TableScroll>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Order</TableHeaderCell>
                  <TableHeaderCell>Customer</TableHeaderCell>
                  <TableHeaderCell>Coffee</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell align="right">Total</TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading
                  ? Array.from({ length: 5 }, (_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={5}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : needsAttention.slice(0, 8).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.reference}</TableCell>
                        <TableCell>
                          <span className="block max-w-40 truncate">{order.customerName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="block max-w-56 truncate text-muted">
                            {order.lines.map((line) => line.productName).join(', ')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} size="sm" />
                        </TableCell>
                        <TableCell align="right" className="font-medium tabular-nums">
                          {formatPrice(order.totalCents)}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableScroll>
        </Card>

        {/* Low stock */}
        <Card surface="outline">
          <CardHeader>
            <div>
              <CardTitle className="font-sans text-base">Running low</CardTitle>
              <p className="text-sm text-muted">Fewer than 12 bags on hand</p>
            </div>
          </CardHeader>

          <CardBody className="flex flex-col gap-3 pt-0">
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted">Everything is comfortably stocked.</p>
            ) : (
              lowStock.slice(0, 7).map(({ product, variant }) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted">{variant.size}</p>
                  </div>
                  <Badge tone={variant.stock < 6 ? 'danger' : 'warning'} size="sm">
                    {variant.stock} left
                  </Badge>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

/** Days between an ISO timestamp and the seed's "today". */
function daysSince(iso: string) {
  const then = new Date(iso).getTime()
  const now = new Date('2026-08-27T09:00:00Z').getTime()
  return (now - then) / (1000 * 60 * 60 * 24)
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}
