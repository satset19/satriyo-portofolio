import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Skip link mounted as the very first node in <body> so it is the first Tab stop.
 * Uses a click handler instead of href="#..." because the app routes on the hash.
 */
export function SkipLink() {
  const [host, setHost] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const el = document.createElement('div')
    el.id = 'skip-link-host'
    document.body.prepend(el)
    setHost(el)
    return () => el.remove()
  }, [])

  if (!host) return null

  return createPortal(
    <a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault()
        const target =
          document.querySelector<HTMLElement>('main h1') ??
          document.querySelector<HTMLElement>('main h2') ??
          document.querySelector<HTMLElement>('main')
        if (!target) return
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.focus()
        target.scrollIntoView({ block: 'start' })
      }}
      className="mc-btn mc-btn-green sr-only fixed top-3 left-3 z-50 min-h-11 px-4 py-3 text-[10px] focus:not-sr-only focus:fixed focus:inline-flex focus:items-center"
    >
      Skip to content
    </a>,
    host,
  )
}
