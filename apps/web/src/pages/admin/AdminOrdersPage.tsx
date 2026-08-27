import type { Order, OrderStatus } from '@ember/api/types'
import { GRIND_LABELS, ORDER_STATUS_LABELS } from '@ember/api/types'
import {
  Avatar,
  Button,
  Card,
  Divider,
  Drawer,
  EmptyState,
  Input,
  Pagination,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableScroll,
  Tabs,
  formatPrice,
  useToast,
} from '@ember/ui'
import { Download, Search, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { OrderStatusBadge } from '../../components/OrderStatusBadge'
import { apiSend, useQuery } from '../../lib/api'

type StatusFilter = OrderStatus | 'all'

const TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'roasting', label: 'Roasting' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'refunded', label: 'Refunded' },
]

const PAGE_SIZE = 12

export function AdminOrdersPage() {
  const [status, setStatus] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Order>()

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    if (search.trim()) params.set('search', search.trim())
    return params.toString()
  }, [status, search])

  const { data: orders, loading, refetch } = useQuery<Order[]>(`/orders?${query}`)

  const pageCount = Math.max(1, Math.ceil((orders?.length ?? 0) / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = (orders ?? []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-sans text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted">
            {orders ? `${orders.length} orders` : 'Loading orders'}
          </p>
        </div>

        <Button variant="outline" leadingIcon={<Download className="size-4" />}>
          Export CSV
        </Button>
      </header>

      <Tabs
        label="Filter orders by status"
        items={TABS}
        value={status}
        onChange={(value) => {
          setStatus(value)
          setPage(1)
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          size="sm"
          type="search"
          placeholder="Reference, name, email or city"
          aria-label="Search orders"
          prefix={<Search className="size-4" />}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          className="sm:w-72"
        />
      </div>

      <Card surface="outline" radius="md">
        <TableScroll>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Reference</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
                <TableHeaderCell>Destination</TableHeaderCell>
                <TableHeaderCell>Placed</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell align="right">Total</TableHeaderCell>
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
                : visible.map((order) => (
                    <TableRow
                      key={order.id}
                      clickable
                      selected={selected?.id === order.id}
                      onClick={() => setSelected(order)}
                    >
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {order.reference}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={order.customerName} size="xs" />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{order.customerName}</p>
                            <p className="truncate text-xs text-muted">{order.customerEmail}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted">
                        {order.lines.reduce((total, line) => total + line.quantity, 0)} bags
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted">
                        {order.shippingCity}, {order.shippingCountry}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted tabular-nums">
                        {order.placedAt.slice(0, 10)}
                      </TableCell>

                      <TableCell>
                        <OrderStatusBadge status={order.status} size="sm" />
                      </TableCell>

                      <TableCell align="right" className="font-medium whitespace-nowrap tabular-nums">
                        {formatPrice(order.totalCents)}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableScroll>

        {!loading && visible.length === 0 ? (
          <EmptyState
            size="sm"
            icon={<SearchX className="size-6" aria-hidden />}
            title="No orders match"
            description="Try a different status tab, or clear the search."
            action={
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSearch('')
                  setStatus('all')
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : null}
      </Card>

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        onPageChange={setPage}
        summary={
          orders && orders.length > 0
            ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                currentPage * PAGE_SIZE,
                orders.length,
              )} of ${orders.length}`
            : undefined
        }
      />

      <OrderDrawer
        order={selected}
        onClose={() => setSelected(undefined)}
        onUpdated={() => {
          setSelected(undefined)
          refetch()
        }}
      />
    </div>
  )
}

function OrderDrawer({
  order,
  onClose,
  onUpdated,
}: {
  order?: Order
  onClose: () => void
  onUpdated: () => void
}) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  if (!order) return null

  const updateStatus = async (status: OrderStatus) => {
    setSaving(true)

    try {
      await apiSend(`/orders/${order.id}`, 'PATCH', { status })
      toast(`${order.reference} marked as ${ORDER_STATUS_LABELS[status].toLowerCase()}`, {
        tone: 'success',
      })
      onUpdated()
    } catch {
      toast('Could not update that order', { tone: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer
      open
      onClose={onClose}
      size="lg"
      title={order.reference}
      description={`${order.customerName} · ${order.shippingCity}`}
      footer={
        <div className="flex items-center gap-2">
          <Select
            size="sm"
            aria-label="Order status"
            defaultValue={order.status}
            disabled={saving}
            onChange={(event) => updateStatus(event.target.value as OrderStatus)}
            className="flex-1"
          >
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <OrderStatusBadge status={order.status} />
          <span className="text-sm text-muted tabular-nums">
            Placed {order.placedAt.slice(0, 10)}
          </span>
        </div>

        <section className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-widest text-subtle uppercase">
            Customer
          </h3>
          <div className="flex items-center gap-3">
            <Avatar name={order.customerName} />
            <div className="min-w-0">
              <p className="truncate font-medium">{order.customerName}</p>
              <p className="truncate text-sm text-muted">{order.customerEmail}</p>
            </div>
          </div>
          {order.subscriptionId ? (
            <p className="text-sm text-muted">
              From subscription{' '}
              <span className="font-mono text-xs">{order.subscriptionId}</span>
            </p>
          ) : null}
        </section>

        <Divider />

        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-widest text-subtle uppercase">Items</h3>

          <ul className="flex flex-col divide-y divide-border">
            {order.lines.map((line) => (
              <li key={`${line.productId}-${line.size}-${line.grind}`} className="flex justify-between gap-4 py-3 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate font-medium">{line.productName}</p>
                  <p className="text-sm text-muted">
                    {line.size} · {GRIND_LABELS[line.grind]} · ×{line.quantity}
                  </p>
                </div>
                <span className="shrink-0 font-medium tabular-nums">
                  {formatPrice(line.unitPriceCents * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(order.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="tabular-nums">
              {order.shippingCents === 0 ? 'Free' : formatPrice(order.shippingCents)}
            </dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(order.totalCents)}</dd>
          </div>
        </dl>
      </div>
    </Drawer>
  )
}
