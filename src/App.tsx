import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import { GameBackdrop } from './game/GameBackdrop'
import { Hotbar } from './components/hud/Hotbar'
import { XpBar } from './components/hud/XpBar'
import { AchievementToast } from './components/hud/AchievementToast'
import { HudToggles } from './components/hud/HudToggles'
import { GuideCharacter } from './components/GuideCharacter'
import { LoadingScreen } from './components/LoadingScreen'
import { SpawnPage } from './pages/SpawnPage'
import { PAGE_LABELS, navigate, registerTransition, usePage } from './router'
import type { Page } from './router'
import { playClick } from './game/useSound'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

type PageComponent = ComponentType | LazyExoticComponent<ComponentType>

// Spawn is the landing page and stays in the entry chunk. Every other page is
// split into its own chunk and fetched on demand (or prefetched during the
// loading-screen transition).
const PAGE_LOADERS: Record<Exclude<Page, 'spawn'>, () => Promise<{ default: ComponentType }>> = {
  pipeline: () => import('./pages/PipelinePage').then((m) => ({ default: m.PipelinePage })),
  quests: () => import('./pages/QuestsPage').then((m) => ({ default: m.QuestsPage })),
  skills: () => import('./pages/SkillsPage').then((m) => ({ default: m.SkillsPage })),
  lore: () => import('./pages/LorePage').then((m) => ({ default: m.LorePage })),
  arcade: () => import('./pages/ArcadePage').then((m) => ({ default: m.ArcadePage })),
  contact: () => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
}

const PAGE_COMPONENTS: Record<Page, PageComponent> = {
  spawn: SpawnPage,
  pipeline: lazy(PAGE_LOADERS.pipeline),
  quests: lazy(PAGE_LOADERS.quests),
  skills: lazy(PAGE_LOADERS.skills),
  lore: lazy(PAGE_LOADERS.lore),
  arcade: lazy(PAGE_LOADERS.arcade),
  contact: lazy(PAGE_LOADERS.contact),
}

const TRANSITION_MS = 600

function preloadPage(page: Page): Promise<unknown> {
  if (page === 'spawn') return Promise.resolve()
  // A failed prefetch must not block navigation; Suspense retries on render.
  return PAGE_LOADERS[page]().catch(() => undefined)
}

function PageFallback({ page }: { page: Page }) {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center">
      <p className="pixel-text text-xs text-gold">Loading {PAGE_LABELS[page]}…</p>
    </div>
  )
}

export default function App() {
  const page = usePage()
  const [loading, setLoading] = useState<Page | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const timer = useRef(0)
  const transitionId = useRef(0)

  useEffect(() => {
    const finish = (target: Page) => {
      navigate(target)
      window.scrollTo(0, 0)
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('main h1, main h2')?.focus()
      })
    }
    return registerTransition((target) => {
      playClick()
      const id = ++transitionId.current
      const ready = preloadPage(target)
      if (reducedMotion) {
        void ready.then(() => {
          if (id === transitionId.current) finish(target)
        })
        return
      }
      setLoading(target)
      clearTimeout(timer.current)
      const minDelay = new Promise<void>((resolve) => {
        timer.current = window.setTimeout(resolve, TRANSITION_MS)
      })
      void Promise.all([ready, minDelay]).then(() => {
        if (id !== transitionId.current) return
        finish(target)
        setLoading(null)
      })
    })
  }, [reducedMotion])

  const CurrentPage = PAGE_COMPONENTS[page]

  return (
    <>
      <GameBackdrop />

      <main className="relative z-[1] min-h-screen pb-44">
        <div key={page}>
          <Suspense fallback={<PageFallback page={page} />}>
            <CurrentPage />
          </Suspense>
        </div>
      </main>

      {loading && <LoadingScreen label={PAGE_LABELS[loading]} />}

      <HudToggles />
      <AchievementToast page={page} />
      <GuideCharacter page={page} />
      <div className="fixed bottom-2.5 min-[360px]:bottom-3 left-1/2 z-20 flex w-[min(94vw,420px)] -translate-x-1/2 flex-col items-center gap-1 min-[360px]:gap-1.5">
        <XpBar page={page} />
        <Hotbar />
      </div>
    </>
  )
}
