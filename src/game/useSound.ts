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

/** Gem / ore pickup ding. */
export function playGem() {
  if (muted) return
  const c = gestureCtx() ?? runningCtx()
  if (!c) return
  const t = c.currentTime
  tone(c, 'sine', 987.77, t, 0.08, 0.15) // B5
  tone(c, 'sine', 1318.51, t + 0.07, 0.15, 0.18) // E6
}

/** Ascending arpeggio power-up sound. */
export function playPowerup() {
  if (muted) return
  const c = gestureCtx() ?? runningCtx()
  if (!c) return
  const t = c.currentTime
  tone(c, 'square', 440, t, 0.06, 0.1)
  tone(c, 'square', 554.37, t + 0.05, 0.06, 0.1)
  tone(c, 'square', 659.25, t + 0.1, 0.06, 0.1)
  tone(c, 'square', 880, t + 0.15, 0.16, 0.14)
}

/** Heavy explosion rumble + noise burst for TNT. */
export function playExplosion() {
  if (muted) return
  const c = gestureCtx() ?? runningCtx()
  if (!c) return
  const length = Math.floor(c.sampleRate * 0.32)
  const buffer = c.createBuffer(1, length, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    const decay = Math.pow(1 - i / length, 2)
    data[i] = (Math.random() * 2 - 1) * decay
  }
  const src = c.createBufferSource()
  src.buffer = buffer
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(320, c.currentTime)
  filter.frequency.exponentialRampToValueAtTime(45, c.currentTime + 0.32)
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.4, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.32)
  src.connect(filter).connect(gain).connect(c.destination)
  src.start()
  tone(c, 'triangle', 95, c.currentTime, 0.28, 0.25)
}

/** Descending retro game over fanfare. */
export function playGameOver() {
  if (muted) return
  const c = gestureCtx() ?? runningCtx()
  if (!c) return
  const t = c.currentTime
  tone(c, 'sawtooth', 330, t, 0.12, 0.15)
  tone(c, 'sawtooth', 311.13, t + 0.12, 0.12, 0.15)
  tone(c, 'sawtooth', 293.66, t + 0.24, 0.12, 0.15)
  tone(c, 'sawtooth', 261.63, t + 0.36, 0.32, 0.18)
}

/** Triumphant high score fanfare. */
export function playHighScore() {
  if (muted) return
  const c = gestureCtx() ?? runningCtx()
  if (!c) return
  const t = c.currentTime
  tone(c, 'sine', 523.25, t, 0.1, 0.15)
  tone(c, 'sine', 659.25, t + 0.08, 0.1, 0.15)
  tone(c, 'sine', 783.99, t + 0.16, 0.1, 0.15)
  tone(c, 'sine', 1046.5, t + 0.24, 0.35, 0.22)
}
