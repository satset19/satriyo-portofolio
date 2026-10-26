import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Packages that belong to the React runtime. They must stay out of the three
// chunks, otherwise the entry chunk statically imports three-fiber (and with it
// three-core) just to get the scheduler, which defeats lazy loading.
const REACT_RUNTIME = [
  '/node_modules/react/',
  '/node_modules/react-dom/',
  '/node_modules/scheduler/',
  '/node_modules/use-sync-external-store/',
]

export default defineConfig({
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
})
