import express, { type Express } from 'express'
import { brewGuideBySlug, brewGuides } from './brewGuides'
import { collections, productBySlug, products } from './catalog'
import { store } from './seed'
import type { OrderStatus } from './types'

export * from './types'
export { products, collections, productBySlug } from './catalog'
export { brewGuides, brewGuideBySlug } from './brewGuides'

/**
 * The local API.
 *
 * Mounted as middleware inside the Vite dev server (see
 * apps/web/vite.config.ts), so the whole product runs as one process on one
 * port. There is nothing to install, no database to migrate and no
 * credentials to configure — `pnpm dev` is the entire setup story.
 *
 * Data lives in memory and is rebuilt from a fixed seed on every boot, so
 * writes work during a session and reset cleanly on restart.
 */
export function createApiApp(): Express {
  const app = express()
  app.use(express.json())

  /**
   * A small artificial delay on collection endpoints. Without it, loading
   * states are impossible to see on localhost and skeletons rot.
   */
  const latency = (ms: number) => (_req: unknown, _res: unknown, next: () => void) => {
    setTimeout(next, ms)
  }

  // ---- Health ------------------------------------------------------------
  // Used by tooling to decide the app is up.
  app.get('/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'ember-api',
      products: products.length,
      orders: store.orders.length,
    })
  })

  // ---- Catalogue ---------------------------------------------------------
  app.get('/products', latency(300), (req, res) => {
    const { collection, roast, process: processFilter, search, sort } = req.query
    let result = [...products]

    if (typeof collection === 'string' && collection !== 'all') {
      result = result.filter((product) => product.collections.includes(collection))
    }

    if (typeof roast === 'string' && roast.length > 0) {
      const roasts = roast.split(',')
      result = result.filter((product) => roasts.includes(product.roast))
    }

    if (typeof processFilter === 'string' && processFilter.length > 0) {
      const processes = processFilter.split(',')
      result = result.filter((product) => processes.includes(product.process))
    }

    if (typeof search === 'string' && search.trim().length > 0) {
      const term = search.trim().toLowerCase()
      result = result.filter((product) =>
        [product.name, product.origin, product.region, ...product.tastingNotes]
          .join(' ')
          .toLowerCase()
          .includes(term),
      )
    }

    const cheapest = (product: (typeof products)[number]) =>
      Math.min(...product.variants.map((variant) => variant.priceCents))

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => cheapest(a) - cheapest(b))
        break
      case 'price-desc':
        result.sort((a, b) => cheapest(b) - cheapest(a))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        result.sort((a, b) => b.releasedOn.localeCompare(a.releasedOn))
        break
    }

    res.json(result)
  })

  app.get('/products/:slug', (req, res) => {
    const product = productBySlug.get(req.params.slug)

    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    const related = products
      .filter(
        (other) =>
          other.id !== product.id &&
          (other.roast === product.roast ||
            other.collections.some((entry) => product.collections.includes(entry))),
      )
      .slice(0, 3)

    res.json({
      product,
      related,
      reviews: store.reviews.filter((review) => review.productId === product.id),
    })
  })

  app.get('/collections', (_req, res) => {
    res.json(collections)
  })

  // ---- Brew guides -------------------------------------------------------
  app.get('/brew-guides', (_req, res) => {
    res.json(brewGuides)
  })

  app.get('/brew-guides/:slug', (req, res) => {
    const guide = brewGuideBySlug.get(req.params.slug)

    if (!guide) {
      res.status(404).json({ error: 'Brew guide not found' })
      return
    }

    res.json(guide)
  })

  // ---- Orders (admin) ----------------------------------------------------
  app.get('/orders', latency(350), (req, res) => {
    const { status, search } = req.query
    let result = [...store.orders]

    if (typeof status === 'string' && status !== 'all') {
      result = result.filter((order) => order.status === status)
    }

    if (typeof search === 'string' && search.trim().length > 0) {
      const term = search.trim().toLowerCase()
      result = result.filter((order) =>
        [order.reference, order.customerName, order.customerEmail, order.shippingCity]
          .join(' ')
          .toLowerCase()
          .includes(term),
      )
    }

    res.json(result)
  })

  app.get('/orders/:id', (req, res) => {
    const order = store.orders.find((entry) => entry.id === req.params.id)

    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    res.json(order)
  })

  app.patch('/orders/:id', (req, res) => {
    const order = store.orders.find((entry) => entry.id === req.params.id)

    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    const { status } = req.body as { status?: OrderStatus }
    if (status) order.status = status

    res.json(order)
  })

  // ---- Subscriptions -----------------------------------------------------
  app.get('/subscriptions', latency(250), (_req, res) => {
    res.json(store.subscriptions)
  })

  // ---- Checkout ----------------------------------------------------------
  /**
   * Accepts an order and echoes it back with a reference. No payment
   * processing — this is a demo storefront and there is deliberately no
   * integration to configure.
   */
  app.post('/checkout', latency(700), (req, res) => {
    const body = req.body as { lines?: unknown[]; email?: string }

    if (!Array.isArray(body.lines) || body.lines.length === 0) {
      res.status(400).json({ error: 'Cart is empty' })
      return
    }

    const reference = `EMB-${4200 + store.orders.length + 1}`
    res.status(201).json({ reference, receivedAt: new Date().toISOString() })
  })

  return app
}
