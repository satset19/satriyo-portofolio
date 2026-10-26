import { useRef, useState } from 'react'
import { projects } from '../data/projects'
import type { Project } from '../data/projects'
import { useInView } from '../hooks/useInView'
import { FilterTabs } from './FilterTabs'
import type { Filter } from './FilterTabs'
import { ProjectCard } from './ProjectCard'
import { ProjectDialog } from './ProjectDialog'

export function ProjectGrid() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Project | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const { ref, inView } = useInView<HTMLDivElement>(0.05)

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  const openProject = (project: Project, trigger: HTMLElement) => {
    triggerRef.current = trigger
    setSelected(project)
  }

  const closeProject = () => {
    setSelected(null)
    triggerRef.current?.focus()
  }

  return (
    <div ref={ref}>
      <FilterTabs active={filter} onChange={setFilter} />
      {/* key={filter} remounts the grid so cards replay their staggered entrance */}
      {visible.length === 0 ? (
        <div role="status" className="mc-slot mt-8 px-5 py-10 text-center">
          <p className="pixel-text text-[10px] text-gold">No quests here yet</p>
          <p className="mt-3 text-xl text-slate-300">Nothing in this category. Try another filter.</p>
        </div>
      ) : (
      <div key={filter} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {visible.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            inView={inView}
            onOpen={openProject}
          />
        ))}
      </div>
      )}
      <ProjectDialog project={selected} onClose={closeProject} />
    </div>
  )
}
