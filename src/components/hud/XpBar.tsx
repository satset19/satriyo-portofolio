import { useEffect, useState } from 'react'
import { PAGES } from '../../router'
import type { Page } from '../../router'

/** XP bar: level = current page index, fill = scroll progress within the page. */
export function XpBar({ page }: { page: Page }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 1)
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [page])

  const level = PAGES.indexOf(page) + 1

  return (
    <div className="flex w-full items-center gap-2" aria-hidden>
      <div className="mc-slot h-3 flex-1 overflow-hidden">
        <div
          className="h-full bg-xp transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="pixel-text text-[10px] text-xp" style={{ textShadow: '1px 1px 0 #000' }}>
        Lv.{level}
      </span>
    </div>
  )
}
