import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { GUIDE_LINES } from '../data/guideScript'
import { PAGES, goTo } from '../router'
import type { Page } from '../router'
import { playClick } from '../game/useSound'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

// Original pixel miner, drawn on a 16x20 grid. One letter = one pixel.
// H helmet, L lamp, S skin, E eye, B beard, T shirt, A arm, P pants, O boots,
// K pickaxe handle, X pickaxe head, . transparent
const SPRITE = [
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '...HHHLLHHHHH...',
  '...SSSSSSSSSS...',
  '...SESSSSSSES...',
  '...SSSSSSSSSS...',
  '...SBBSSSSBBS...',
  '....BBBBBBBB....',
  '..TTTTTTTTTT..X.',
  '.ATTTTTTTTTTAXX.',
  '.ATTTTTTTTTTKX..',
  '.ATTTTTTTTTKK...',
  '.STTTTTTTTKKS...',
  '...PPPPPPPP.....',
  '...PPPPPPPP.....',
  '...PPP..PPP.....',
  '...PPP..PPP.....',
  '...OOO..OOO.....',
  '...OOO..OOO.....',
  '................',
]

const COLORS: Record<string, string> = {
  H: '#6e6e72',
  L: '#fcd34d',
  S: '#d9a066',
  E: '#1a1a1a',
  B: '#7a4a21',
  T: '#2e5c9e',
  A: '#24487d',
  P: '#3a3a52',
  O: '#26221c',
  K: '#8a5a2b',
  X: '#9ea7ad',
}

function MinerSprite() {
  return (
    <svg
      viewBox="0 0 16 20"
      width="64"
      height="80"
      shapeRendering="crispEdges"
      aria-hidden
      className="drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)]"
    >
      {SPRITE.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={COLORS[cell]} />,
        ),
      )}
    </svg>
  )
}

export function GuideCharacter({ page }: { page: Page }) {
  const [open, setOpen] = useState(true)
  const [chars, setChars] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const line = GUIDE_LINES[page]

  useEffect(() => {
    if (reducedMotion) {
      setChars(line.length)
      return
    }
    setChars(0)
    const interval = setInterval(() => {
      setChars((c) => {
        if (c >= line.length) {
          clearInterval(interval)
          return c
        }
        return c + 1
      })
    }, 22)
    return () => clearInterval(interval)
  }, [line, reducedMotion])

  const nextIndex = PAGES.indexOf(page) + 1
  const next = nextIndex < PAGES.length ? PAGES[nextIndex] : null

  return (
    <div className="pointer-events-none fixed bottom-32 left-2 z-30 flex max-w-[min(280px,calc(100vw-1rem))] flex-col items-start gap-2 sm:bottom-5 sm:left-5 sm:scale-100 [&>*]:pointer-events-auto">
      {open && (
        <div role="region" aria-label="Guide" className="mc-tooltip toast-in relative p-4 pr-10">
          <button
            type="button"
            onClick={() => {
              playClick()
              setOpen(false)
            }}
            aria-label="Dismiss guide"
            className="absolute top-0 right-0 flex h-11 w-11 cursor-pointer items-center justify-center text-slate-300 hover:text-text"
          >
            <X size={16} aria-hidden />
          </button>
          <p aria-live="polite" className="min-h-16 text-lg leading-snug text-slate-200">
            {line.slice(0, chars)}
            {chars < line.length && <span aria-hidden>▌</span>}
          </p>
          <button
            type="button"
            onClick={() => goTo(next ?? 'spawn')}
            className="mc-btn mc-btn-green mt-3 min-h-11 px-3 py-2 text-[9px]"
          >
            {next ? 'Next ➜' : 'Restart tour'}
          </button>
          {/* bubble tail */}
          <span
            aria-hidden
            className="absolute -bottom-2 left-7 h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-[#2d0a63]"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          playClick()
          setOpen((o) => !o)
        }}
        aria-label={open ? 'Hide guide' : 'Talk to the guide'}
        aria-expanded={open}
        className={`cursor-pointer focus-visible:outline-offset-4 ${
          reducedMotion ? '' : 'guide-bob'
        }`}
      >
        <MinerSprite />
      </button>
    </div>
  )
}
