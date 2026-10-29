import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import security from './security-headers.json' with { type: 'json' }

// Meta CSP for hosts that ignore vercel.json / _headers. Build only: the dev server needs inline HMR code.
// frame-ancestors is dropped because browsers ignore it in a <meta> tag; the real headers carry it.
const metaCsp = (): Plugin => ({
  name: 'meta-csp',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: {
        'http-equiv': 'Content-Security-Policy',
        content: security.csp.filter((rule) => !rule.startsWith('frame-ancestors')).join('; '),
      },
      injectTo: 'head-prepend',
    },
  ],
})

export default defineConfig({
  plugins: [react(), metaCsp()],
  // three.js + drei form one lazy chunk (~300 kB gzip) that loads after the hero text renders.
  // assetsInlineLimit 0 keeps every font and image a real file, so the CSP never needs data: for fonts.
  build: { chunkSizeWarningLimit: 1200, assetsInlineLimit: 0 },
})
