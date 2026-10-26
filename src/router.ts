import { useSyncExternalStore } from 'react'

export const PAGES = ['spawn', 'pipeline', 'quests', 'skills', 'lore', 'arcade', 'contact'] as const
export type Page = (typeof PAGES)[number]

export const PAGE_LABELS: Record<Page, string> = {
  spawn: 'Spawn',
  pipeline: 'Pipeline',
  quests: 'Quests',
  skills: 'Skills',
  lore: 'Lore',
  arcade: 'Arcade',
  contact: 'Contact',
}

function parse(): Page {
  const h = window.location.hash.replace(/^#\/?/, '')
  return (PAGES as readonly string[]).includes(h) ? (h as Page) : 'spawn'
}

export function navigate(page: Page) {
  window.location.hash = `/${page}`
}

export function usePage(): Page {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener('hashchange', cb)
      return () => window.removeEventListener('hashchange', cb)
    },
    parse,
  )
}

// App registers the loading-screen transition here; everyone else just calls goTo().
let transition: ((page: Page) => void) | null = null

export function registerTransition(fn: (page: Page) => void) {
  transition = fn
  return () => {
    transition = null
  }
}

export function goTo(page: Page) {
  ;(transition ?? navigate)(page)
}
