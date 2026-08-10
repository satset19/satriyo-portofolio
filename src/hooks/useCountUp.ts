import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** Counts from 0 to target over ~900ms once `start` is true. Instant when reduced motion. */
export function useCountUp(target: number, start: boolean): number {
  const reducedMotion = usePrefersReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    if (reducedMotion) {
      setValue(target)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const duration = 900
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, reducedMotion])

  return value
}
