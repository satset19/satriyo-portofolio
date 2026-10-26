import { useMemo } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { goTo } from '../router'

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

const SPLASHES = [
  'Ships to prod!',
  '5k msg/s!',
  'Sub-200ms!',
  'Multi-tenant!',
  'Multi-agent AI!',
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
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="mc-slot hidden px-2.5 py-1 text-sm text-gold sm:inline-block">
            Lv.99 Systems
          </span>
          <a
            href="https://github.com/satset19"
            target="_blank"
            rel="noopener noreferrer"
            className="mc-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] focus-visible:outline-3 focus-visible:outline-xp"
            aria-label="GitHub profile"
          >
            <GithubIcon size={14} />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="hero-scrim mx-auto w-full max-w-6xl px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
        <p
          className="hero-enter pixel-text text-[10px] text-gold sm:text-xs"
          style={{ '--i': 0, textShadow: '2px 2px 0 rgb(0 0 0 / 0.8)' } as React.CSSProperties}
        >
          Satriyo — Senior Backend & Infrastructure Engineer
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
          Go &amp; TypeScript microservices, autonomous multi-agent systems, React frontends,
          and the Kubernetes platform that ships them. Multi-tenant by design, measured in milliseconds.
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
