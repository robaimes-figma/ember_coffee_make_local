import type { Subscription } from '@ember/api/types'
import { GRIND_LABELS } from '@ember/api/types'
import {
  Avatar,
  Badge,
  Card,
  ROAST_LABELS,
  Skeleton,
  StatTile,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableScroll,
  Tabs,
} from '@ember/ui'
import { PauseCircle, Repeat, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '../../lib/api'

type StatusFilter = 'all' | Subscription['status']

const TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusTone = {
  active: 'success',
  paused: 'warning',
  cancelled: 'neutral',
} as const

export function AdminSubscriptionsPage() {
  const { data: subscriptions, loading } = useQuery<Subscription[]>('/subscriptions')
  const [status, setStatus] = useState<StatusFilter>('all')

  const all = subscriptions ?? []
  const visible = status === 'all' ? all : all.filter((sub) => sub.status === status)

  const counts = {
    active: all.filter((sub) => sub.status === 'active').length,
    paused: all.filter((sub) => sub.status === 'paused').length,
    cancelled: all.filter((sub) => sub.status === 'cancelled').length,
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-sans text-2xl font-semibold">Subscriptions</h1>
        <p className="text-sm text-muted">{all.length} plans on the books</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} shape="block" className="h-28" />
          ))
        ) : (
          <>
            <StatTile
              label="Active"
              value={counts.active}
              deltaPercent={6.4}
              deltaCaption="vs. last month"
              icon={<Repeat className="size-4" aria-hidden />}
            />
            <StatTile
              label="Paused"
              value={counts.paused}
              deltaPercent={-2.1}
              deltaCaption="vs. last month"
              invertDelta
              icon={<PauseCircle className="size-4" aria-hidden />}
            />
            <StatTile
              label="Cancelled, all time"
              value={counts.cancelled}
              icon={<XCircle className="size-4" aria-hidden />}
            />
          </>
        )}
      </div>

      <Tabs
        label="Filter subscriptions by status"
        items={TABS}
        value={status}
        onChange={setStatus}
        appearance="pill"
        className="self-start"
      />

      <Card surface="outline" radius="md">
        <TableScroll>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Cadence</TableHeaderCell>
                <TableHeaderCell>Bag</TableHeaderCell>
                <TableHeaderCell>Grind</TableHeaderCell>
                <TableHeaderCell>Roast preference</TableHeaderCell>
                <TableHeaderCell>Next shipment</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
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
                : visible.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={sub.customerName} size="xs" />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{sub.customerName}</p>
                            <p className="font-mono text-xs text-muted">{sub.id}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="capitalize whitespace-nowrap text-muted">
                        {sub.cadence}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">{sub.size}</TableCell>

                      <TableCell className="whitespace-nowrap text-muted">
                        {GRIND_LABELS[sub.grind]}
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted">
                        {sub.roastPreference === 'rotating'
                          ? 'Rotating'
                          : ROAST_LABELS[sub.roastPreference]}
                      </TableCell>

                      <TableCell className="whitespace-nowrap tabular-nums text-muted">
                        {sub.status === 'cancelled' ? '—' : sub.nextShipmentOn}
                      </TableCell>

                      <TableCell>
                        <Badge tone={statusTone[sub.status]} size="sm" dot>
                          <span className="capitalize">{sub.status}</span>
                        </Badge>
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
