import { useEffect, useState } from 'react'
import { Gamepad2, ArrowRight, Trophy, Sparkles } from 'lucide-react'
import { Hero } from '../components/Hero'
import { StatsBar } from '../components/StatsBar'
import { goTo } from '../router'

function ArcadeBanner() {
  const [highScore, setHighScore] = useState<number>(0)

  useEffect(() => {
    try {
      const hs = Number(localStorage.getItem('voxel_miner_highscore') ?? 0)
      setHighScore(hs)
    } catch {
      // ignore storage errors
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 mt-10">
      <div className="mc-panel-glass p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="relative z-[1] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="mc-slot flex h-14 w-14 shrink-0 items-center justify-center text-accent">
              <Gamepad2 size={28} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="pixel-text text-[9px] uppercase tracking-wider text-gold flex items-center gap-1">
                  <Sparkles size={11} /> Retro Arcade Minigame
                </span>
                {highScore > 0 && (
                  <span className="mc-slot px-2 py-0.5 pixel-text text-[8px] text-gold flex items-center gap-1">
                    <Trophy size={10} /> Record: {highScore.toLocaleString()} pts
                  </span>
                )}
              </div>
              <h2 className="pixel-text text-base sm:text-lg text-white mt-1.5">
                Voxel Miner: Ore Rush
              </h2>
              <p className="mt-2 max-w-xl text-lg leading-snug text-slate-300">
                Dive into a procedural 2D retro mining adventure! Excavate diamond veins, chain rapid ore combos, deploy tactical dynamite, and dodge explosive TNT hazards.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo('arcade')}
            className="mc-btn mc-btn-green inline-flex shrink-0 items-center gap-2.5 px-6 py-3.5 text-[10px] sm:text-xs shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-xp"
          >
            <Gamepad2 size={16} aria-hidden />
            <span>Enter Arcade</span>
            <ArrowRight size={14} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}

export function SpawnPage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ArcadeBanner />
    </>
  )
}
