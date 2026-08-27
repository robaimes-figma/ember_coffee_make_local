import { Button, Container, IconButton, Input } from '@ember/ui'
import { Menu, Moon, Search, ShoppingBag, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { CartDrawer } from '../components/CartDrawer'
import { useCart } from '../lib/cart'
import { useTheme } from '../lib/theme'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/subscribe', label: 'Subscribe' },
  { to: '/brew-guides', label: 'Brew guides' },
]

export function StoreLayout() {
  const { itemCount } = useCart()
  const { mode, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Roast day announcement */}
      <div className="bg-surface-inverse text-inverse">
        <Container className="flex h-9 items-center justify-center">
          <p className="text-xs tracking-wide">
            Roasted Mondays and Thursdays · Free shipping over $60
          </p>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-canvas/90 backdrop-blur">
        <Container className="flex h-16 items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <EmberMark />
            <span className="font-display text-lg font-semibold tracking-tight">Ember</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-accent-text'
                      : 'text-muted hover:bg-surface-hover hover:text-content'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <form
              className="hidden lg:block"
              onSubmit={(event) => event.preventDefault()}
              role="search"
            >
              <Input
                size="sm"
                type="search"
                placeholder="Search coffees"
                aria-label="Search coffees"
                prefix={<Search className="size-4" />}
                className="w-52"
              />
            </form>

            <IconButton
              label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              size="sm"
              icon={mode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              onClick={toggle}
            />

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-content"
              aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag className="size-4" aria-hidden />
              {itemCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-2xs font-semibold text-on-accent">
                  {itemCount}
                </span>
              ) : null}
            </button>

            <IconButton
              label={menuOpen ? 'Close menu' : 'Open menu'}
              size="sm"
              className="md:hidden"
              icon={menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              onClick={() => setMenuOpen((open) => !open)}
            />
          </div>
        </Container>

        {menuOpen ? (
          <nav className="border-t border-border bg-canvas md:hidden">
            <Container className="flex flex-col py-2">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-content hover:bg-surface-hover"
                >
                  {item.label}
                </Link>
              ))}
            </Container>
          </nav>
        ) : null}
      </header>

      <main className="flex-1" key={location.pathname}>
        <Outlet />
      </main>

      <StoreFooter />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

function EmberMark() {
  return (
    <span className="flex size-8 items-center justify-center rounded-md bg-surface-inverse">
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <path
          d="M12 4c2.9 0 5.2 2.2 5.2 5s-2.3 4.9-5.2 4.9S6.8 11.8 6.8 9 9.1 4 12 4Z"
          fill="none"
          stroke="var(--sem-accent)"
          strokeWidth="1.8"
        />
        <path
          d="M9.3 6c1.9 1.6 2.7 4.1 2.1 6.3"
          fill="none"
          stroke="var(--sem-accent)"
          strokeWidth="1.8"
        />
        <path
          d="M7.8 17.6c2.7 1.2 5.6 1.2 8.4 0"
          fill="none"
          stroke="var(--sem-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

const FOOTER_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { to: '/shop', label: 'All coffee' },
      { to: '/shop?collection=single-origin', label: 'Single origin' },
      { to: '/shop?collection=blends', label: 'Blends' },
      { to: '/shop?collection=decaf', label: 'Decaf' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { to: '/brew-guides', label: 'Brew guides' },
      { to: '/brew-guides/espresso-dialling-in', label: 'Dialling in espresso' },
      { to: '/subscribe', label: 'How subscriptions work' },
    ],
  },
  {
    title: 'Roastery',
    links: [
      { to: '/admin', label: 'Staff console' },
      { to: '/_gallery', label: 'Design system' },
    ],
  },
]

function StoreFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-sunken">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <EmberMark />
            <span className="font-display text-lg font-semibold">Ember</span>
          </div>
          <p className="max-w-xs text-sm text-muted text-pretty">
            Small-batch coffee roasted to order in Portland, Oregon. Shipped within 24 hours of
            the roast.
          </p>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h3 className="font-sans text-xs font-semibold tracking-widest text-subtle uppercase">
              {section.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted transition-colors hover:text-content"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-subtle">
            © 2026 Ember Coffee Roasters. A demo storefront — no orders are fulfilled.
          </p>
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <Input
              size="sm"
              type="email"
              placeholder="you@example.com"
              aria-label="Email address for the newsletter"
              className="w-48"
            />
            <Button size="sm" variant="secondary" type="submit">
              Get roast notes
            </Button>
          </form>
        </Container>
      </div>
    </footer>
  )
}
