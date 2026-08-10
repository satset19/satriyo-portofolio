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
        className="mc-slot group flex h-full w-full cursor-pointer flex-col p-5 text-left transition-[outline] hover:outline-2 hover:outline-white/70 focus-visible:outline-3 focus-visible:outline-xp"
      >
        <div className="flex w-full items-start justify-between">
          <span className="mc-panel p-2.5 text-gold">
            <Icon size={20} aria-hidden />
          </span>
          <ArrowUpRight size={16} aria-hidden className="text-slate-500 group-hover:text-xp" />
        </div>
        <p className="pixel-text mt-4 text-[8px] tracking-wide text-slate-400 uppercase">
          {CATEGORY_LABELS[project.category]}
        </p>
        <h3 className="pixel-text mt-2 text-[11px] leading-relaxed text-gold">{project.title}</h3>
        <p className="mt-3 flex-1 text-lg leading-snug text-slate-300">{project.oneLiner}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
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
