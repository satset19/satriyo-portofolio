import { useState, useEffect } from 'react'
import { Trophy, Pickaxe, Flame, Sparkles, AlertTriangle, Bomb, Zap, Heart } from 'lucide-react'
import { Section } from '../components/Section'
import { VoxelMinerGame } from '../game/VoxelMinerGame'
import { ORE_VALUES } from '../game/voxelMinerTypes'

export function ArcadePage() {
  const [stats, setStats] = useState({
    highScore: 0,
    totalMined: 0,
    bestCombo: 0,
  })

  useEffect(() => {
    try {
      const hs = Number(localStorage.getItem('voxel_miner_highscore') ?? 0)
      const tm = Number(localStorage.getItem('voxel_miner_total_mined') ?? 0)
      const bc = Number(localStorage.getItem('voxel_miner_best_combo') ?? 0)
      setStats({ highScore: hs, totalMined: tm, bestCombo: bc })
    } catch {
      // ignore storage access errors
    }
  }, [])

  const handleStatsUpdate = (newStats: { highScore: number; totalMined: number; bestCombo: number }) => {
    setStats(newStats)
  }

  const ores = Object.entries(ORE_VALUES).filter(
    ([key]) => key !== 'dirt' && key !== 'stone' && key !== 'gravel',
  )

  return (
    <Section
      id="arcade"
      kicker="Retro Arcade Minigame"
      title="Voxel Miner: Ore Rush, Procedural Subterranean Excavator"
    >
      <div className="space-y-8">
        {/* Arcade Hall of Fame & Lifetime Stats */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <div className="mc-slot flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-yellow-950/60 border border-gold/40 text-gold">
              <Trophy size={20} aria-hidden />
            </div>
            <div>
              <p className="pixel-text text-[9px] text-slate-300">HIGH SCORE</p>
              <p className="pixel-text text-base text-gold">{stats.highScore.toLocaleString()}</p>
            </div>
          </div>

          <div className="mc-slot flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <Pickaxe size={20} aria-hidden />
            </div>
            <div>
              <p className="pixel-text text-[9px] text-slate-300">TOTAL MINED</p>
              <p className="pixel-text text-base text-emerald-400">{stats.totalMined.toLocaleString()}</p>
            </div>
          </div>

          <div className="mc-slot flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-amber-950/60 border border-amber-500/40 text-amber-400">
              <Flame size={20} aria-hidden />
            </div>
            <div>
              <p className="pixel-text text-[9px] text-slate-300">BEST COMBO</p>
              <p className="pixel-text text-base text-amber-400">
                {stats.bestCombo > 1 ? `${stats.bestCombo}x Multiplier` : '1x'}
              </p>
            </div>
          </div>
        </div>

        {/* Playable Arcade Screen */}
        <div className="mc-panel flex flex-col items-center p-3 sm:p-6">
          <div className="mb-4 text-center">
            <h2 className="pixel-text text-xs leading-relaxed min-[390px]:text-sm sm:text-base text-gold flex items-center justify-center gap-2">
              <Sparkles size={16} className="shrink-0 text-gold" aria-hidden />
              VOXEL MINER: ORE RUSH
              <Sparkles size={16} className="shrink-0 text-gold" aria-hidden />
            </h2>
            <p className="mt-2 max-w-md text-lg leading-snug text-slate-300">
              Dig down through descending procedural strata. Chain rapid ore harvests to stack up to a 5x multiplier!
            </p>
          </div>

          <VoxelMinerGame onStatsUpdate={handleStatsUpdate} />
        </div>

        {/* Field Guide: Ore Compendium & Hazard Manual */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Ore Compendium */}
          <div className="mc-slot p-4 sm:p-5">
            <h2 className="pixel-text text-[10px] leading-relaxed text-gold uppercase mb-3 flex items-center gap-1.5">
              <Pickaxe size={14} className="shrink-0" aria-hidden /> Mineral Compendium &amp; Points
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-base">
              {ores.map(([key, info]) => (
                <li
                  key={key}
                  className="mc-panel p-2.5 flex flex-col justify-between border-t-2"
                  style={{ borderTopColor: info.speckColor }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg leading-tight text-slate-200">{info.name}</span>
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full inline-block"
                      style={{ backgroundColor: info.speckColor }}
                    />
                  </div>
                  <div className="mt-2 text-slate-300">
                    <span className="pixel-text text-[10px] text-gold">+{info.points}</span>
                    <span className="block text-base leading-tight text-slate-300">
                      +{info.timeBonus}s in Rush
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Rules & Hazards */}
          <div className="mc-slot p-4 sm:p-5">
            <h2 className="pixel-text text-[10px] leading-relaxed text-xp uppercase mb-3 flex items-center gap-1.5">
              <AlertTriangle size={14} className="shrink-0" aria-hidden /> Mining Protocols &amp; Power-ups
            </h2>
            <ul className="space-y-3 text-lg leading-snug text-slate-300">
              <li className="flex items-start gap-2">
                <Bomb size={16} aria-hidden className="text-red-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-red-300 font-semibold">TNT Hazards &amp; Dynamite:</strong> Red TNT blocks detonate on impact or fuse, carving out a 3x3 blast radius and deducting 10s (Rush) or 1 Heart (Survival). Collect stick dynamites to clear rows on demand!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Zap size={16} aria-hidden className="text-yellow-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-yellow-300 font-semibold">Speed Pickaxe:</strong> Golden pickaxe pickups grant 8 seconds of insta-mining overdrive to tear through obsidian strata.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Heart size={16} aria-hidden className="text-pink-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-pink-300 font-semibold">Health &amp; Time Boosts:</strong> Heart crystals restore 1 HP in Survival or grant +10 bonus seconds in Rush mode.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Flame size={16} aria-hidden className="text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-300 font-semibold">Combo Streaks:</strong> Mine ores within 2 seconds of each other to increment your streak multiplier up to 5x for colossal score runs.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
