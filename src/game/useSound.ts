import { useSyncExternalStore } from 'react'

// Synthesized game sounds — WebAudio only, no audio assets.
let ctx: AudioContext | null = null
let muted = typeof localStorage !== 'undefined' && localStorage.getItem('muted') === '1'
const listeners = new Set<() => void>()

/** Create/resume the context. Only call from a user-gesture handler. */
function gestureCtx(): AudioContext | null {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

/** Reuse an already-running context (for non-gesture sounds like toasts). */
function runningCtx(): AudioContext | null {
  return ctx && ctx.state === 'running' ? ctx : null
}

export function toggleMute() {
  muted = !muted
  localStorage.setItem('muted', muted ? '1' : '0')
  listeners.forEach((l) => l())
}

export function useMuted(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => muted,
  )
}

function tone(
  c: AudioContext,
  type: OscillatorType,
  freq: number,
  start: number,
  duration: number,
  peak: number,
) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(peak, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.connect(gain).connect(c.destination)
  osc.start(start)
  osc.stop(start + duration)
}

/** Short woody UI click. Call from click handlers. */
export function playClick() {
  if (muted) return
  const c = gestureCtx()
  if (!c) return
  tone(c, 'square', 220, c.currentTime, 0.06, 0.12)
}

/** Two-note achievement chime. Safe to call outside a gesture (skips if audio not unlocked yet). */
export function playChime() {
  if (muted) return
  const c = runningCtx()
  if (!c) return
  const t = c.currentTime
  tone(c, 'sine', 523.25, t, 0.18, 0.14) // C5
  tone(c, 'sine', 783.99, t + 0.12, 0.28, 0.14) // G5
}

/** Crunchy block-break noise burst. Call from click handlers. */
export function playBreak() {
  if (muted) return
  const c = gestureCtx()
  if (!c) return
  const length = Math.floor(c.sampleRate * 0.12)
  const buffer = c.createBuffer(1, length, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length)
  }
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 500
  const gain = c.createGain()
  gain.gain.value = 0.25
  src.connect(filter).connect(gain).connect(c.destination)
  src.start()
}
