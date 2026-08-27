import type { BagSize, GrindOption } from '@ember/api/types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * Cart state.
 *
 * All of the money and quantity rules live here, not in components. That
 * separation is the reason a UI change to a cart row cannot accidentally
 * change what a customer is charged.
 */

export interface CartLine {
  /** productId + size + grind, so the same coffee ground two ways is two lines. */
  key: string
  productId: string
  productName: string
  productSlug: string
  size: BagSize
  grind: GrindOption
  unitPriceCents: number
  quantity: number
  /** Recurring lines get a discount and a cadence badge. */
  subscription: boolean
}

/** Orders over this amount ship free. Shown as a progress bar in the cart. */
export const FREE_SHIPPING_THRESHOLD_CENTS = 6000
export const SHIPPING_FLAT_CENTS = 650
/** Subscribers save this proportion on every recurring line. */
export const SUBSCRIPTION_DISCOUNT = 0.1

interface CartContextValue {
  lines: CartLine[]
  add: (line: Omit<CartLine, 'key'>) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
  itemCount: number
  subtotalCents: number
  discountCents: number
  shippingCents: number
  totalCents: number
  /** How much more is needed to reach free shipping. 0 once qualified. */
  remainingForFreeShippingCents: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'ember.cart.v1'

function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines])

  const add = useCallback((line: Omit<CartLine, 'key'>) => {
    const key = `${line.productId}:${line.size}:${line.grind}:${line.subscription ? 'sub' : 'one'}`

    setLines((current) => {
      const existing = current.find((entry) => entry.key === key)

      if (existing) {
        return current.map((entry) =>
          entry.key === key ? { ...entry, quantity: entry.quantity + line.quantity } : entry,
        )
      }

      return [...current, { ...line, key }]
    })
  }, [])

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((entry) => entry.key !== key)
        : current.map((entry) => (entry.key === key ? { ...entry, quantity } : entry)),
    )
  }, [])

  const remove = useCallback((key: string) => {
    setLines((current) => current.filter((entry) => entry.key !== key))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const subtotalCents = lines.reduce(
      (total, line) => total + line.unitPriceCents * line.quantity,
      0,
    )

    const discountCents = Math.round(
      lines
        .filter((line) => line.subscription)
        .reduce((total, line) => total + line.unitPriceCents * line.quantity, 0) *
        SUBSCRIPTION_DISCOUNT,
    )

    const payable = subtotalCents - discountCents
    const shippingCents =
      lines.length === 0 || payable >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS

    return {
      lines,
      add,
      setQuantity,
      remove,
      clear,
      itemCount: lines.reduce((total, line) => total + line.quantity, 0),
      subtotalCents,
      discountCents,
      shippingCents,
      totalCents: payable + shippingCents,
      remainingForFreeShippingCents: Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - payable),
    }
  }, [lines, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>')
  return context
}
