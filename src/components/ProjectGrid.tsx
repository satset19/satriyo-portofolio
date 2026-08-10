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
      <div key={filter} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      <ProjectDialog project={selected} onClose={closeProject} />
    </div>
  )
}
