import { Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { toggleNight, useNight } from '../../game/worldState'
import { playClick, toggleMute, useMuted } from '../../game/useSound'
import { SkipLink } from '../SkipLink'

export function HudToggles() {
  const night = useNight()
  const muted = useMuted()

  return (
    <div role="group" aria-label="World settings" className="fixed top-3 right-3 z-30 flex gap-2 sm:top-4 sm:right-4">
      <SkipLink />
      <button
        type="button"
        onClick={() => {
          playClick()
          toggleNight()
        }}
        aria-label={night ? 'Switch to day' : 'Switch to night'}
        aria-pressed={night}
        className="mc-btn flex h-11 w-11 items-center justify-center"
      >
        {night ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
      </button>
      <button
        type="button"
        onClick={() => {
          toggleMute()
          playClick()
        }}
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
        aria-pressed={muted}
        className="mc-btn flex h-11 w-11 items-center justify-center"
      >
        {muted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
      </button>
    </div>
  )
}
