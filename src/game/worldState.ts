import { useSyncExternalStore } from 'react'

// Day/night state shared between the HUD toggle and the 3D world.
let night = true
const listeners = new Set<() => void>()

export function isNight() {
  return night
}

export function toggleNight() {
  night = !night
  listeners.forEach((l) => l())
}

export function useNight(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => night,
  )
}
