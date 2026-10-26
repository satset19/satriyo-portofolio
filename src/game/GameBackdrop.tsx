import { Suspense, lazy, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// three + @react-three/fiber live in their own chunks and are only requested
// through this dynamic import, after the first paint.
const VoxelWorld = lazy(() => import('./VoxelWorld'))

interface NetworkInformationLike {
  saveData?: boolean
}

interface NavigatorHints {
  connection?: NetworkInformationLike
  deviceMemory?: number
}

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

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    // Release the probe context right away; browsers cap live WebGL contexts.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(gl)
  } catch {
    return false
  }
}

function prefersSaveData(): boolean {
  const nav = navigator as Navigator & NavigatorHints
  return nav.connection?.saveData === true
}

// Heuristic for weak devices: few cores or little memory. Used to cap the
// render resolution rather than to disable the scene entirely.
function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & NavigatorHints
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8
  return cores <= 4 || memory <= 4
}

// Resolves once the browser has painted the first frame and is idle, so the
// 3D chunks never compete with the initial render of the page content.
function useAfterFirstPaint(enabled: boolean): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let idleId = 0
    let timeoutId = 0
    const rafId = requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1500 })
      } else {
        timeoutId = window.setTimeout(() => setReady(true), 200)
      }
    })
    return () => {
      cancelAnimationFrame(rafId)
      if (idleId) window.cancelIdleCallback(idleId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [enabled])

  return ready
}

export function GameBackdrop() {
  const reducedMotion = usePrefersReducedMotion()
  const [hasWebGL] = useState(detectWebGL)
  const [saveData] = useState(prefersSaveData)
  const [lowPower] = useState(isLowPowerDevice)

  const enabled = hasWebGL && !reducedMotion && !saveData
  const ready = useAfterFirstPaint(enabled)

  if (!enabled || !ready) return <StaticSky />

  return (
    <Suspense fallback={<StaticSky />}>
      <VoxelWorld lowPower={lowPower} />
    </Suspense>
  )
}
