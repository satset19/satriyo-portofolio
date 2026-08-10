import { useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { playClick } from '../game/useSound'

const EMAIL = 'laksonosatriyo@gmail.com'

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
          Open to conversations about realtime systems, platform engineering, and product work.
        </p>
        <div className="mx-auto mt-8 flex max-w-md items-center gap-2">
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
      </div>
      <p className="mt-8 text-center text-lg text-slate-400">
        © {new Date().getFullYear()} Satriyo. Built with React, three.js, and sounds synthesized
        from thin air.
      </p>
    </footer>
  )
}
