import { Suspense, lazy, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const VoxelWorld = lazy(() => import('./VoxelWorld'))

function StaticSky() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0"
      style={{
        background:
          'linear-gradient(#05070f 0%, #0b0e1a 55%, #16223a 85%, #1d3a24 100%)',
      }}
    />
  )
}

export function GameBackdrop() {
  const reducedMotion = usePrefersReducedMotion()
  const [hasWebGL] = useState(() => {
    try {
      const canvas = document.createElement('canvas')
      return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
    } catch {
      return false
    }
  })

  if (reducedMotion || !hasWebGL) return <StaticSky />

  return (
    <Suspense fallback={<StaticSky />}>
      <VoxelWorld />
    </Suspense>
  )
}
