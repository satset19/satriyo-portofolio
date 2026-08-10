import { useEffect, useRef } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import type { Project } from '../data/projects'
import { CATEGORY_LABELS } from '../data/projects'
import { playClick } from '../game/useSound'

interface ProjectDialogProps {
  project: Project | null
  onClose: () => void
}

export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  // Keep the last project rendered so content stays visible during the exit fade
  const lastRef = useRef<Project | null>(null)
  if (project) lastRef.current = project
  const shown = project ?? lastRef.current

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (project && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    }
    if (!project && dialog.open) {
      dialog.close()
    }
  }, [project])

  const handleClose = () => {
    document.body.style.overflow = ''
    onClose()
  }

  const Icon = shown?.icon
  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close()
      }}
      aria-label={shown?.title}
      className="mc-tooltip m-auto w-[min(92vw,640px)] p-0 text-text"
    >
      {shown && Icon && (
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="mc-panel p-2.5 text-gold">
                <Icon size={20} aria-hidden />
              </span>
              <div>
                <p className="pixel-text text-[8px] tracking-wide text-slate-400 uppercase">
                  {CATEGORY_LABELS[shown.category]} quest
                </p>
                <h3 className="pixel-text mt-1 text-xs leading-relaxed text-gold sm:text-sm">
                  {shown.title}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playClick()
                ref.current?.close()
              }}
              aria-label="Close dialog"
              className="mc-btn p-2 focus-visible:outline-3 focus-visible:outline-xp"
            >
              <X size={16} aria-hidden />
            </button>
          </div>

          <p className="mt-4 text-xl leading-snug text-slate-200">{shown.oneLiner}</p>

          <ul className="mt-5 space-y-2.5">
            {shown.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5 text-lg leading-snug text-slate-300">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-xp" aria-hidden />
                {highlight}
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-1.5 border-t-2 border-purple-900/60 pt-5">
            {shown.tags.map((tag) => (
              <li key={tag} className="mc-tooltip px-2 py-0.5 text-base text-purple-300">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  )
}
