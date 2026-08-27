import { ToastProvider } from '@ember/ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { CartProvider } from './lib/cart'
import { ThemeProvider } from './lib/theme'
import { router } from './router'
import './styles.css'

const container = document.getElementById('root')
if (!container) throw new Error('#root is missing from index.html')

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
