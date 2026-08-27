import { Avatar, IconButton, Tooltip } from '@ember/ui'
import {
  Boxes,
  LayoutDashboard,
  Moon,
  Package,
  Receipt,
  Repeat,
  Store,
  Sun,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../lib/theme'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: Receipt, end: false },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes, end: false },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: Repeat, end: false },
]

/**
 * The staff console.
 *
 * Same tokens, same components, deliberately different posture: sans-serif
 * headings, tighter spacing, no editorial flourish.
 */
export function AdminLayout() {
  const { mode, toggle } = useTheme()

  return (
    <div className="flex min-h-screen bg-surface-sunken">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <span className="flex size-7 items-center justify-center rounded-md bg-accent text-2xs font-bold text-on-accent">
            EC
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold">Ember</span>
            <span className="text-2xs text-subtle">Roastery console</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-soft text-accent-text'
                    : 'text-muted hover:bg-surface-hover hover:text-content'
                }`
              }
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-2">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-content"
          >
            <Store className="size-4 shrink-0" aria-hidden />
            View storefront
          </NavLink>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col font-sans">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface px-4">
          {/* Mobile nav: icons only, since the sidebar is hidden below md */}
          <nav className="flex items-center gap-1 md:hidden">
            {NAV.map((item) => (
              <Tooltip key={item.to} content={item.label} side="bottom">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex size-9 items-center justify-center rounded-md transition-colors ${
                      isActive
                        ? 'bg-accent-soft text-accent-text'
                        : 'text-muted hover:bg-surface-hover hover:text-content'
                    }`
                  }
                  aria-label={item.label}
                >
                  <item.icon className="size-4" aria-hidden />
                </NavLink>
              </Tooltip>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <IconButton
              label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              size="sm"
              icon={mode === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              onClick={toggle}
            />
            <div className="flex items-center gap-2 border-l border-border pl-3">
              <Avatar name="Dagny Sorensen" size="sm" />
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-medium">Dagny Sorensen</span>
                <span className="text-2xs text-subtle">Head roaster</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
