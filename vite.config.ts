import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/wardrobe/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Wardrobe',
        short_name: 'Wardrobe',
        description: 'Manage your wardrobe, outfits and style statistics.',
        theme_color: '#111827',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/wardrobe/',
        scope: '/wardrobe/',
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // The background-removal feature is opt-in and its ONNX runtime
        // (~1.6MB JS + a large WASM binary) should only ever be fetched
        // on-demand when someone actually uses it — never eagerly
        // precached for every visitor on install.
        globIgnores: ['**/ort*.js', '**/ort*.mjs'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/wardrobe/index.html',
        runtimeCaching: [
          {
            urlPattern: /\/ort[^/]*\.(js|mjs|wasm)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bg-removal-model-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'firestore-cache' },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
})
