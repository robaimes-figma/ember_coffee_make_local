import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { createApiApp } from '../../packages/api/src/index'

/**
 * The local API runs as middleware inside the dev server rather than as a
 * second process. One command, one port, one URL — which is what makes this
 * repo safe to hand to someone who does not want to open a terminal.
 */
function emberApi(): Plugin {
  return {
    name: 'ember-api',
    configureServer(server) {
      server.middlewares.use('/api', createApiApp())
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', createApiApp())
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), emberApi()],
  server: {
    port: Number(process.env.PORT ?? 5173),
    strictPort: false,
  },
  preview: {
    port: Number(process.env.PORT ?? 5173),
  },
})
