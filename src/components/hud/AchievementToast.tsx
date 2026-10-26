import { useEffect, useRef, useState } from 'react'
import { Trophy } from 'lucide-react'
import { playChime } from '../../game/useSound'
import type { Page } from '../../router'

const ACHIEVEMENTS: Partial<Record<Page, string>> = {
  pipeline: 'Redstone Engineer',
  quests: 'Quest Log Opened',
  skills: 'Skill Tree Unlocked',
  lore: 'Lore Discovered',
  arcade: 'Arcade Explorer',
  contact: 'Ready to Connect',
}

export function AchievementToast({ page }: { page: Page }) {
  const [current, setCurrent] = useState<string | null>(null)
  const seen = useRef(new Set<Page>())
  const timer = useRef(0)

  useEffect(() => {
    const title = ACHIEVEMENTS[page]
    if (!title || seen.current.has(page)) return
    seen.current.add(page)
    setCurrent(title)
    playChime()
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCurrent(null), 3000)
    return () => clearTimeout(timer.current)
  }, [page])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-16 left-1/2 z-30 w-max max-w-[calc(100vw-1.5rem)] -translate-x-1/2 sm:top-20 sm:left-auto sm:right-4 sm:translate-x-0"
    >
      {current && (
        <div className="toast-in mc-panel flex items-center gap-3 px-4 py-3">
          <Trophy size={20} className="text-gold" aria-hidden />
          <div>
            <p className="pixel-text text-[10px] text-gold">Achievement get!</p>
            <p className="text-xl leading-tight">{current}</p>
          </div>
        </div>
      )}
    </div>
  )
}
