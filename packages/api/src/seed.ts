import { products } from './catalog'
import type {
  BagSize,
  GrindOption,
  Order,
  OrderLine,
  OrderStatus,
  Review,
  Subscription,
  SubscriptionCadence,
} from './types'

/**
 * Deterministic seed data for orders, reviews and subscriptions.
 *
 * Everything here comes out of a fixed-seed PRNG, so a clone of this repo
 * produces byte-identical data on every machine. That matters more than it
 * sounds: it means a screenshot in a pull request is comparable to the
 * reviewer's own screen, and a planted UI bug reproduces for everyone.
 *
 * Nothing calls Date.now() or Math.random().
 */

/** mulberry32 — small, fast, and stable across Node versions. */
function createRandom(seed: number) {
  let state = seed >>> 0

  return function random() {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SEED = 20260827

/** The date the seed data is anchored to. Everything is relative to this. */
export const TODAY = new Date('2026-08-27T09:00:00Z')

function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)]
}

function integer(random: () => number, min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min
}

function shiftDays(from: Date, days: number) {
  const result = new Date(from)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

const FIRST_NAMES = [
  'Amara', 'Tobias', 'Priya', 'Idris', 'Noor', 'Callum', 'Wren', 'Mateo',
  'Saoirse', 'Kenji', 'Lucia', 'Ravi', 'Freya', 'Emeka', 'Dagny', 'Otis',
  'Yusra', 'Ines', 'Bo', 'Marguerite', 'Anders', 'Thandiwe', 'Rafael', 'Junko',
]

const LAST_NAMES = [
  'Okonkwo', 'Lindqvist', 'Raghunathan', 'Fairweather', 'Mbeki', 'Alvarez',
  'Whitlock', 'Nakamura', 'Delacroix', 'Osei', 'Kowalski', 'Bianchi',
  'Haaland', 'Rasmussen', 'Ferreira', 'Chaudhry', 'Sorensen', 'Ashworth',
]

const CITIES: [string, string][] = [
  ['Portland', 'United States'],
  ['Melbourne', 'Australia'],
  ['Copenhagen', 'Denmark'],
  ['Lisbon', 'Portugal'],
  ['Montréal', 'Canada'],
  ['Glasgow', 'United Kingdom'],
  ['Seoul', 'South Korea'],
  ['Cape Town', 'South Africa'],
  ['Bristol', 'United Kingdom'],
  ['Wellington', 'New Zealand'],
  ['Chicago', 'United States'],
  ['Rotterdam', 'Netherlands'],
]

const GRINDS: GrindOption[] = ['whole-bean', 'filter', 'espresso', 'french-press', 'moka']

/**
 * Status is weighted by age: a two-day-old order is probably still roasting,
 * a two-month-old one is delivered. Without this the admin order table looks
 * obviously fake.
 */
function statusForAge(random: () => number, daysAgo: number): OrderStatus {
  const roll = random()

  if (daysAgo <= 1) return roll < 0.75 ? 'pending' : 'roasting'
  if (daysAgo <= 3) return roll < 0.6 ? 'roasting' : 'shipped'
  if (daysAgo <= 8) {
    if (roll < 0.1) return 'cancelled'
    return roll < 0.7 ? 'shipped' : 'delivered'
  }
  if (roll < 0.04) return 'refunded'
  if (roll < 0.07) return 'cancelled'
  return 'delivered'
}

function fullName(random: () => number) {
  return `${pick(random, FIRST_NAMES)} ${pick(random, LAST_NAMES)}`
}

function emailFor(name: string, index: number) {
  const [first, last] = name.toLowerCase().split(' ')
  const normalise = (value: string) => value.normalize('NFD').replace(/[^a-z]/g, '')
  return `${normalise(first)}.${normalise(last)}${index % 7 === 0 ? index : ''}@example.com`
}

function shippingFor(subtotalCents: number) {
  // Free shipping over $60 — the threshold the storefront promises.
  return subtotalCents >= 6000 ? 0 : 650
}

export function buildOrders(count = 84): Order[] {
  const random = createRandom(SEED)
  const orders: Order[] = []

  for (let index = 0; index < count; index++) {
    const daysAgo = Math.floor(random() * random() * 74) // skewed towards recent
    const placedAt = shiftDays(TODAY, -daysAgo)
    const name = fullName(random)
    const [city, country] = pick(random, CITIES)

    const lineCount = random() < 0.55 ? 1 : random() < 0.85 ? 2 : 3
    const lines: OrderLine[] = []
    const usedProducts = new Set<string>()

    for (let line = 0; line < lineCount; line++) {
      const product = pick(random, products)
      if (usedProducts.has(product.id)) continue
      usedProducts.add(product.id)

      const variant = pick(random, product.variants)
      const grind = pick(
        random,
        product.brewMethods.length > 0 ? product.brewMethods : GRINDS,
      )

      lines.push({
        productId: product.id,
        productName: product.name,
        size: variant.size as BagSize,
        grind,
        quantity: random() < 0.78 ? 1 : integer(random, 2, 4),
        unitPriceCents: variant.priceCents,
      })
    }

    const subtotalCents = lines.reduce(
      (total, line) => total + line.unitPriceCents * line.quantity,
      0,
    )
    const shippingCents = shippingFor(subtotalCents)
    const fromSubscription = random() < 0.22

    orders.push({
      id: `ord-${1000 + index}`,
      reference: `EMB-${4200 + index}`,
      customerName: name,
      customerEmail: emailFor(name, index),
      status: statusForAge(random, daysAgo),
      placedAt: placedAt.toISOString(),
      lines,
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      subscriptionId: fromSubscription ? `sub-${200 + (index % 34)}` : undefined,
      shippingCity: city,
      shippingCountry: country,
    })
  }

  return orders.sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
  )
}

const REVIEW_TITLES = [
  'Exactly as described',
  'My new daily driver',
  'Better than the last harvest',
  'Worth the price',
  'Took some dialling in',
  'Delicious, but delicate',
  'Bought again immediately',
  'Great in a press, less so filter',
  'Sweetest cup I have made at home',
  'Not what I expected — in a good way',
  'Solid, unremarkable, reliable',
  'Blew me away',
]

const REVIEW_BODIES = [
  'Ordered on a Thursday, roasted Friday, on my counter Monday morning. The notes on the bag were accurate, which is rarer than it should be.',
  'I have been through four bags now. It holds up as a batch brew for the office and still tastes good the next morning, which I did not expect.',
  'Needed a coarser grind than I usually run and about ten seconds less contact time. Once I got there it was genuinely excellent.',
  'The fruit is real, not roast-derived sweetness pretending to be fruit. You can taste the difference immediately.',
  'Slightly too acidic for me at first, but it settled after five days of rest and turned into something I would happily buy again.',
  'Bought it for espresso and it is superb with milk. Straight it is a little sharp, so I pull it slightly longer.',
  'The story on the bag made me curious and the coffee delivered. Not much more I can ask for.',
  'Good value at the 1kg size. I go through it fast enough that freshness has never been an issue.',
  'This is the one I recommend when friends ask where to start. Approachable without being boring.',
  'Third order. Consistent every single time, which for a natural process is genuinely impressive.',
]

export function buildReviews(): Review[] {
  const random = createRandom(SEED + 7)
  const reviews: Review[] = []
  let id = 1

  for (const product of products) {
    // Show a plausible handful per product rather than all several hundred.
    const count = Math.min(9, Math.max(2, Math.round(product.reviewCount / 45)))

    for (let index = 0; index < count; index++) {
      // Ratings cluster near the product's average.
      const drift = (random() - 0.5) * 1.4
      const rating = Math.max(1, Math.min(5, Math.round(product.rating + drift)))

      reviews.push({
        id: `rev-${id++}`,
        productId: product.id,
        author: fullName(random),
        rating,
        title: pick(random, REVIEW_TITLES),
        body: pick(random, REVIEW_BODIES),
        createdOn: isoDate(shiftDays(TODAY, -integer(random, 2, 210))),
        verifiedPurchase: random() < 0.85,
        brewMethod: pick(
          random,
          product.brewMethods.length > 0 ? product.brewMethods : GRINDS,
        ),
      })
    }
  }

  return reviews.sort((a, b) => b.createdOn.localeCompare(a.createdOn))
}

const CADENCES: SubscriptionCadence[] = ['weekly', 'fortnightly', 'monthly']
const SIZES: BagSize[] = ['250g', '500g', '1kg']

export function buildSubscriptions(count = 34): Subscription[] {
  const random = createRandom(SEED + 13)
  const subscriptions: Subscription[] = []

  for (let index = 0; index < count; index++) {
    const roll = random()
    const status = roll < 0.76 ? 'active' : roll < 0.92 ? 'paused' : 'cancelled'
    const cadence = pick(random, CADENCES)
    const cadenceDays = cadence === 'weekly' ? 7 : cadence === 'fortnightly' ? 14 : 30

    subscriptions.push({
      id: `sub-${200 + index}`,
      customerName: fullName(random),
      cadence,
      size: pick(random, SIZES),
      grind: pick(random, GRINDS),
      roastPreference: random() < 0.4 ? 'rotating' : pick(random, ['light', 'medium', 'dark'] as const),
      status,
      nextShipmentOn: isoDate(shiftDays(TODAY, integer(random, 1, cadenceDays))),
      startedOn: isoDate(shiftDays(TODAY, -integer(random, 40, 900))),
    })
  }

  return subscriptions
}

/** Built once at module load. The API treats this as its database. */
export const store = {
  orders: buildOrders(),
  reviews: buildReviews(),
  subscriptions: buildSubscriptions(),
}
