import { useState } from 'react'
import { Check, Copy, Mail, ExternalLink } from 'lucide-react'
import { playClick } from '../game/useSound'

const EMAIL = 'laksonosatriyo@gmail.com'
const GITHUB = 'https://github.com/satset19'

function GithubIcon({ size = 16 }: { size?: number }) {
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

export function Contact() {
  const [copied, setCopied] = useState(false)

  const [copyError, setCopyError] = useState(false)

  const copyEmail = async () => {
    playClick()
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopyError(false)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(true)
    }
  }

  return (
    <footer id="contact" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 pt-8 pb-16 sm:px-8 sm:pt-10">
      <div className="mc-panel-glass p-5 text-center sm:p-10">
        <p className="pixel-text text-[10px] tracking-wider text-gold uppercase">Join the server</p>
        <h1 tabIndex={-1} className="pixel-text mt-4 text-sm leading-relaxed outline-none min-[390px]:text-base sm:text-xl">
          Let&apos;s build something reliable.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-xl text-slate-300">
          Open to conversations about realtime messaging, multi-agent AI systems, platform engineering, and high-scale architecture.
        </p>

        <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 text-left">
          <div className="flex min-w-0 items-center gap-2">
            <div className="mc-slot flex min-h-11 min-w-0 flex-1 items-center gap-2 px-3 py-2">
              <span className="h-2.5 w-2.5 shrink-0 bg-xp" aria-hidden />
              <span className="min-w-0 truncate text-lg text-xp" title={EMAIL}>{EMAIL}</span>
            </div>
            <a
              href={`mailto:${EMAIL}`}
              onClick={playClick}
              aria-label={`Email ${EMAIL}`}
              className="mc-btn mc-btn-green flex h-11 w-11 shrink-0 items-center justify-center"
            >
              <Mail size={16} aria-hidden />
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? 'Email address copied' : 'Copy email address'}
              className="mc-btn flex h-11 w-11 shrink-0 items-center justify-center"
            >
              {copied ? (
                <Check size={16} className="pop-in text-xp" aria-hidden />
              ) : (
                <Copy size={16} aria-hidden />
              )}
            </button>
          </div>

          <p role="status" aria-live="polite" className="min-h-0 text-lg text-slate-300 empty:hidden">
            {copied ? 'Email copied to clipboard.' : copyError ? 'Copy failed. Select the address and copy it manually.' : ''}
          </p>

          <div className="flex min-w-0 items-center gap-2">
            <div className="mc-slot flex min-h-11 min-w-0 flex-1 items-center gap-2 px-3 py-2">
              <GithubIcon size={16} />
              <span className="min-w-0 truncate text-lg text-slate-200">github.com/satset19</span>
            </div>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              aria-label="Open GitHub profile (opens in a new tab)"
              className="mc-btn flex min-h-11 shrink-0 items-center gap-1.5 px-3 py-2 text-[9px]"
            >
              <ExternalLink size={14} aria-hidden />
              <span>Visit</span>
            </a>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-lg text-slate-400">
        © {new Date().getFullYear()} Satriyo. Built with React, three.js, and sounds synthesized
        from thin air.
      </p>
    </footer>
  )
}
