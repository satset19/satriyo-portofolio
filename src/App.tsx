import { useEffect, useRef, useState } from 'react'
import { GameBackdrop } from './game/GameBackdrop'
import { Hotbar } from './components/hud/Hotbar'
import { XpBar } from './components/hud/XpBar'
import { AchievementToast } from './components/hud/AchievementToast'
import { HudToggles } from './components/hud/HudToggles'
import { GuideCharacter } from './components/GuideCharacter'
import { LoadingScreen } from './components/LoadingScreen'
import { SpawnPage } from './pages/SpawnPage'
import { PipelinePage } from './pages/PipelinePage'
import { QuestsPage } from './pages/QuestsPage'
import { SkillsPage } from './pages/SkillsPage'
import { LorePage } from './pages/LorePage'
import { ContactPage } from './pages/ContactPage'
import { PAGE_LABELS, navigate, registerTransition, usePage } from './router'
import type { Page } from './router'
import { playClick } from './game/useSound'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

const PAGE_COMPONENTS: Record<Page, () => React.JSX.Element> = {
  spawn: SpawnPage,
  pipeline: PipelinePage,
  quests: QuestsPage,
  skills: SkillsPage,
  lore: LorePage,
  contact: ContactPage,
}

export default function App() {
  const page = usePage()
  const [loading, setLoading] = useState<Page | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const timer = useRef(0)

  useEffect(() => {
    const finish = (target: Page) => {
      navigate(target)
      window.scrollTo(0, 0)
      document.querySelector<HTMLElement>('main h1, main h2')?.focus()
    }
    return registerTransition((target) => {
      playClick()
      if (reducedMotion) {
        finish(target)
        return
      }
      setLoading(target)
      clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        finish(target)
        setLoading(null)
      }, 600)
    })
  }, [reducedMotion])

  const CurrentPage = PAGE_COMPONENTS[page]

  return (
    <>
      <GameBackdrop />

      <main className="relative z-[1] min-h-screen pb-44">
        <div key={page}>
          <CurrentPage />
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
