import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import { CATEGORY_LABELS } from '../data/projects'
import { playClick } from '../game/useSound'

interface ProjectCardProps {
  project: Project
  index: number
  inView: boolean
  onOpen: (project: Project, trigger: HTMLElement) => void
}

export function ProjectCard({ project, index, inView, onOpen }: ProjectCardProps) {
  const Icon = project.icon
  return (
    <div
      className={`reveal ${inView ? 'revealed' : ''}`}
      style={{ '--reveal-delay': `${index * 60}ms` } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={(e) => {
          playClick()
          onOpen(project, e.currentTarget)
        }}
        aria-haspopup="dialog"
        className="mc-slot mc-card-interactive group flex h-full w-full cursor-pointer flex-col p-5 text-left sm:p-6"
      >
        <div className="flex w-full items-start justify-between">
          <span className="mc-panel p-2.5 text-gold">
            <Icon size={20} aria-hidden />
          </span>
          <ArrowUpRight size={16} aria-hidden className="text-slate-400 transition-colors group-hover:text-xp group-focus-visible:text-xp" />
        </div>
        <p className="pixel-text mt-4 text-[9px] tracking-wide text-slate-300 uppercase">
          {CATEGORY_LABELS[project.category]}
        </p>
        <h2 className="pixel-text mt-2 text-[11px] leading-relaxed text-gold">{project.title}</h2>
        <p className="mt-3 flex-1 text-lg leading-snug text-slate-300">{project.oneLiner}</p>
        <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag} className="mc-tooltip px-2 py-0.5 text-base text-purple-300">
              {tag}
            </li>
          ))}
        </ul>
      </button>
    </div>
  )
}
