import { useMemo } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { goTo } from '../router'

const SPLASHES = [
  'Ships to prod!',
  '5k msg/s!',
  'Sub-200ms!',
  'Multi-tenant!',
  'Also writes Go!',
  'Exactly-once!',
]

export function Hero() {
  const splash = useMemo(() => SPLASHES[Math.floor(Math.random() * SPLASHES.length)], [])

  return (
    <header className="relative">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a
          href="#top"
          className="pixel-text text-xs"
          style={{ textShadow: '2px 2px 0 rgb(0 0 0 / 0.8)' }}
        >
          satriyo<span className="text-accent">.</span>
        </a>
      </div>

      <div className="hero-scrim mx-auto w-full max-w-6xl px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
        <p
          className="hero-enter pixel-text text-[10px] text-gold sm:text-xs"
          style={{ '--i': 0, textShadow: '2px 2px 0 rgb(0 0 0 / 0.8)' } as React.CSSProperties}
        >
          Satriyo — Software Engineer
        </p>
        <h1
          tabIndex={-1}
          className="hero-enter pixel-text mt-6 max-w-3xl text-xl leading-relaxed outline-none sm:text-2xl md:text-3xl"
          style={{ '--i': 1, textShadow: '3px 3px 0 rgb(0 0 0 / 0.8)' } as React.CSSProperties}
        >
          I build realtime messaging infrastructure —{' '}
          <span className="text-accent">from device to browser in under a second.</span>
        </h1>
        <p
          className="hero-enter mt-4 text-2xl"
          style={{ '--i': 2 } as React.CSSProperties}
        >
          <span className="splash-text pixel-text text-[10px] sm:text-xs">{splash}</span>
        </p>
        <p
          className="hero-enter mt-5 max-w-2xl text-xl leading-relaxed text-slate-300"
          style={{ '--i': 3, textShadow: '1px 1px 0 rgb(0 0 0 / 0.8)' } as React.CSSProperties}
        >
          Go and TypeScript services, React frontends, and the Kubernetes platform that ships
          them. Multi-tenant by design, measured in milliseconds.
        </p>
        <div
          className="hero-enter mt-10 flex flex-wrap gap-4"
          style={{ '--i': 4 } as React.CSSProperties}
        >
          <button
            type="button"
            onClick={() => goTo('quests')}
            className="mc-btn mc-btn-green inline-flex items-center gap-2 px-5 py-3 text-[10px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-xp"
          >
            View the quests <ArrowRight size={14} aria-hidden />
          </button>
          <a
            href="mailto:laksonosatriyo@gmail.com"
            className="mc-btn inline-flex items-center gap-2 px-5 py-3 text-[10px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-xp"
          >
            <Mail size={14} aria-hidden /> Get in touch
          </a>
        </div>
      </div>
    </header>
  )
}
