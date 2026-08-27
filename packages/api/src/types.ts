/**
 * Shared API types. The web app imports these so the client and the server
 * can't drift apart.
 *
 * Money is always an integer number of cents. There are no floats anywhere in
 * the pricing path.
 */

export type RoastLevel = 'light' | 'medium' | 'medium-dark' | 'dark'

export type Process = 'washed' | 'natural' | 'honey' | 'anaerobic'

export type GrindOption = 'whole-bean' | 'filter' | 'espresso' | 'french-press' | 'moka'

export type BagSize = '250g' | '500g' | '1kg'

export interface Variant {
  id: string
  size: BagSize
  priceCents: number
  compareAtCents?: number
  /** Units on hand. 0 means the variant is sold out. */
  stock: number
}

export interface Product {
  id: string
  slug: string
  name: string
  origin: string
  region: string
  producer: string
  altitudeMeters: number
  varietal: string
  process: Process
  roast: RoastLevel
  /** Three to four tasting notes, in descending prominence. */
  tastingNotes: string[]
  /** One-line hook used on cards. */
  blurb: string
  /** Long-form copy for the product page. */
  story: string
  brewMethods: GrindOption[]
  variants: Variant[]
  rating: number
  reviewCount: number
  /** Drives ordering of the shop grid and the "New" badge. */
  releasedOn: string
  featured: boolean
  /** Only true for the rotating single-origin spotlight. */
  limitedRelease: boolean
  collections: string[]
}

export interface Collection {
  id: string
  slug: string
  title: string
  description: string
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  body: string
  createdOn: string
  verifiedPurchase: boolean
  /** Brew method the reviewer used. Shown as a badge. */
  brewMethod: GrindOption
}

export type OrderStatus =
  | 'pending'
  | 'roasting'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderLine {
  productId: string
  productName: string
  size: BagSize
  grind: GrindOption
  quantity: number
  unitPriceCents: number
}

export interface Order {
  id: string
  reference: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  placedAt: string
  lines: OrderLine[]
  subtotalCents: number
  shippingCents: number
  totalCents: number
  /** Set when the order came from an active subscription. */
  subscriptionId?: string
  shippingCity: string
  shippingCountry: string
}

export type SubscriptionCadence = 'weekly' | 'fortnightly' | 'monthly'

export interface Subscription {
  id: string
  customerName: string
  cadence: SubscriptionCadence
  size: BagSize
  grind: GrindOption
  roastPreference: RoastLevel | 'rotating'
  status: 'active' | 'paused' | 'cancelled'
  nextShipmentOn: string
  startedOn: string
}

export interface BrewGuide {
  slug: string
  title: string
  method: GrindOption
  summary: string
  minutes: number
  difficulty: 'easy' | 'medium' | 'advanced'
  ratio: string
  temperatureCelsius: number
  gear: string[]
  steps: { at: string; title: string; detail: string }[]
}

/** Human labels, shared by the storefront and the admin console. */
export const GRIND_LABELS: Record<GrindOption, string> = {
  'whole-bean': 'Whole bean',
  filter: 'Filter',
  espresso: 'Espresso',
  'french-press': 'French press',
  moka: 'Moka pot',
}

export const PROCESS_LABELS: Record<Process, string> = {
  washed: 'Washed',
  natural: 'Natural',
  honey: 'Honey',
  anaerobic: 'Anaerobic',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  roasting: 'Roasting',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}
