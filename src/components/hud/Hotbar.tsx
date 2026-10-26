import { useEffect } from 'react'
import { Home, Waypoints, Swords, Sparkles, BookOpen, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PAGES, PAGE_LABELS, goTo, usePage } from '../../router'
import type { Page } from '../../router'

const ICONS: Record<Page, LucideIcon> = {
  spawn: Home,
  pipeline: Waypoints,
  quests: Swords,
  skills: Sparkles,
  lore: BookOpen,
  contact: Mail,
}

export function Hotbar() {
  const active = usePage()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (!n || n > PAGES.length) return
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (document.querySelector('dialog[open]')) return
      goTo(PAGES[n - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <nav aria-label="Page hotbar" className="mc-panel flex max-w-full gap-0.5 p-0.5 min-[360px]:gap-1 min-[360px]:p-1">
      {PAGES.map((pageId, i) => {
        const Icon = ICONS[pageId]
        const selected = active === pageId
        return (
          <button
            key={pageId}
            type="button"
            onClick={() => goTo(pageId)}
            aria-label={`${PAGE_LABELS[pageId]} (key ${i + 1})`}
            aria-current={selected ? 'page' : undefined}
            className={`mc-slot relative flex h-10 w-10 shrink-0 cursor-pointer flex-col items-center justify-center min-[360px]:h-11 min-[360px]:w-11 sm:h-13 sm:w-13 ${
              selected ? 'outline-2 outline-offset-1 outline-white min-[360px]:outline-3' : ''
            } focus-visible:outline-2 focus-visible:outline-xp min-[360px]:focus-visible:outline-3`}
            title={PAGE_LABELS[pageId]}
          >
            <Icon size={18} className={`h-4 w-4 min-[360px]:h-[18px] min-[360px]:w-[18px] sm:h-5 sm:w-5 ${selected ? 'text-xp' : 'text-slate-300'}`} aria-hidden />
            <span className="pixel-text absolute top-0.5 left-0.5 text-[6px] text-slate-400 min-[360px]:left-1 min-[360px]:text-[7px]">
              {i + 1}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
