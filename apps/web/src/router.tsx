import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from './layouts/AdminLayout'
import { StoreLayout } from './layouts/StoreLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage'
import { BrewGuidePage } from './pages/BrewGuidePage'
import { BrewGuidesPage } from './pages/BrewGuidesPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'
import { SubscribePage } from './pages/SubscribePage'

/**
 * Two route trees, one app.
 *
 * `/` is the storefront — expressive, editorial, customer-facing.
 * `/admin` is the console — dense, functional, staff-facing.
 *
 * They share the design system, which is the whole point: a token change has
 * to look right in both places.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'shop/:slug', element: <ProductPage /> },
      { path: 'subscribe', element: <SubscribePage /> },
      { path: 'brew-guides', element: <BrewGuidesPage /> },
      { path: 'brew-guides/:slug', element: <BrewGuidePage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'inventory', element: <AdminInventoryPage /> },
      { path: 'subscriptions', element: <AdminSubscriptionsPage /> },
    ],
  },
  {
    // Every component in every state, on one page. The fastest way to see
    // the effect of a token change.
    path: '/_gallery',
    element: <GalleryPage />,
  },
])
