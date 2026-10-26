import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site from https://satset19.github.io/satriyo-portofolio/
const PAGES_BASE = '/satriyo-portofolio/'

// Packages that belong to the React runtime. They must stay out of the three
// chunks, otherwise the entry chunk statically imports three-fiber (and with it
// three-core) just to get the scheduler, which defeats lazy loading.
const REACT_RUNTIME = [
  '/node_modules/react/',
  '/node_modules/react-dom/',
  '/node_modules/scheduler/',
  '/node_modules/use-sync-external-store/',
]

// The dev server stays at '/'; `vite build` and `vite preview` use the Pages base
// so the preview matches production URLs exactly.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? PAGES_BASE : '/',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const path = id.replace(/\\/g, '/')
          if (REACT_RUNTIME.some((p) => path.includes(p))) {
            return 'react-vendor'
          }
          if (path.includes('/node_modules/three/')) {
            return 'three-core'
          }
          if (path.includes('/node_modules/@react-three/')) {
            return 'three-fiber'
          }
        },
      },
    },
  },
}))
