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

  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (project && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
      closeRef.current?.focus()
    }
    if (!project && dialog.open) {
      dialog.close()
    }
  }, [project])

  // Never leave the page scroll-locked if the grid unmounts with the dialog open
  useEffect(() => () => void (document.body.style.overflow = ''), [])

  const handleClose = () => {
    document.body.style.overflow = ''
    onClose()
  }

  // Keep Tab / Shift+Tab cycling inside the dialog (showModal already makes the
  // page inert; this stops focus escaping to the browser chrome).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab' || !ref.current) return
    const focusable = ref.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const Icon = shown?.icon
  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      onCancel={() => playClick()}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close()
      }}
      aria-labelledby="project-dialog-title"
      aria-describedby="project-dialog-summary"
      className="mc-tooltip m-auto max-h-[calc(100dvh-2rem)] w-[min(92vw,640px)] overflow-y-auto p-0 text-text"
    >
      {shown && Icon && (
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="mc-panel shrink-0 p-2.5 text-gold">
                <Icon size={20} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="pixel-text text-[9px] tracking-wide text-slate-300 uppercase">
                  {CATEGORY_LABELS[shown.category]} quest
                </p>
                <h2 id="project-dialog-title" className="pixel-text mt-1 text-xs leading-relaxed text-gold sm:text-sm">
                  {shown.title}
                </h2>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                playClick()
                ref.current?.close()
              }}
              aria-label="Close dialog"
              className="mc-btn flex h-11 w-11 shrink-0 items-center justify-center"
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <p id="project-dialog-summary" className="mt-4 text-xl leading-snug text-slate-200">
            {shown.oneLiner}
          </p>

          <ul className="mt-5 space-y-2.5">
            {shown.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5 text-lg leading-snug text-slate-300">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-xp" aria-hidden />
                {highlight}
              </li>
            ))}
          </ul>

          <ul aria-label="Tech stack" className="mt-6 flex flex-wrap gap-1.5 border-t-2 border-purple-900/60 pt-5">
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
