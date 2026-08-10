import { Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { toggleNight, useNight } from '../../game/worldState'
import { playClick, toggleMute, useMuted } from '../../game/useSound'

export function HudToggles() {
  const night = useNight()
  const muted = useMuted()

  return (
    <div className="fixed top-4 right-4 z-30 flex gap-2">
      <button
        type="button"
        onClick={() => {
          playClick()
          toggleNight()
        }}
        aria-label={night ? 'Switch to day' : 'Switch to night'}
        aria-pressed={night}
        className="mc-btn flex h-10 w-10 items-center justify-center focus-visible:outline-3 focus-visible:outline-xp"
      >
        {night ? <Moon size={16} aria-hidden /> : <Sun size={16} aria-hidden />}
      </button>
      <button
        type="button"
        onClick={() => {
          toggleMute()
          playClick()
        }}
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
        aria-pressed={muted}
        className="mc-btn flex h-10 w-10 items-center justify-center focus-visible:outline-3 focus-visible:outline-xp"
      >
        {muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
      </button>
    </div>
  )
}
