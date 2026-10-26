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

  const copyEmail = async () => {
    playClick()
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer id="contact" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pt-10 pb-16 sm:px-8">
      <div className="mc-panel-glass p-8 text-center sm:p-10">
        <p className="pixel-text text-[9px] tracking-wider text-gold uppercase">Join the server</p>
        <h2 className="pixel-text mt-4 text-base sm:text-xl">Let&apos;s build something reliable.</h2>
        <p className="mx-auto mt-3 max-w-xl text-xl text-slate-300">
          Open to conversations about realtime messaging, multi-agent AI systems, platform engineering, and high-scale architecture.
        </p>

        <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="mc-slot flex flex-1 items-center gap-2 px-3 py-2.5">
              <span className="h-2.5 w-2.5 shrink-0 bg-xp" aria-hidden />
              <span className="truncate text-lg text-xp">{EMAIL}</span>
            </div>
            <a
              href={`mailto:${EMAIL}`}
              onClick={playClick}
              aria-label={`Email ${EMAIL}`}
              className="mc-btn mc-btn-green p-2.5 focus-visible:outline-3 focus-visible:outline-xp"
            >
              <Mail size={16} aria-hidden />
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              className="mc-btn p-2.5 focus-visible:outline-3 focus-visible:outline-xp"
            >
              {copied ? (
                <Check size={16} className="pop-in text-xp" aria-hidden />
              ) : (
                <Copy size={16} aria-hidden />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="mc-slot flex flex-1 items-center gap-2 px-3 py-2.5 text-left">
              <GithubIcon size={16} />
              <span className="truncate text-lg text-slate-200">github.com/satset19</span>
            </div>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              aria-label="Open GitHub profile"
              className="mc-btn flex items-center gap-1.5 px-3 py-2.5 text-[9px] focus-visible:outline-3 focus-visible:outline-xp"
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
