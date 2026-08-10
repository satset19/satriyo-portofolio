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
    <nav aria-label="Page hotbar" className="mc-panel flex gap-1 p-1">
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
            className={`mc-slot relative flex h-11 w-11 cursor-pointer flex-col items-center justify-center sm:h-13 sm:w-13 ${
              selected ? 'outline-3 outline-offset-1 outline-white' : ''
            } focus-visible:outline-3 focus-visible:outline-xp`}
            title={PAGE_LABELS[pageId]}
          >
            <Icon size={18} className={selected ? 'text-xp' : 'text-slate-300'} aria-hidden />
            <span className="pixel-text absolute top-0.5 left-1 text-[7px] text-slate-400">
              {i + 1}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
