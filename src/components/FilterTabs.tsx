import type { Category } from '../data/projects'
import { CATEGORY_LABELS } from '../data/projects'
import { playClick } from '../game/useSound'

export type Filter = Category | 'all'

const FILTERS: Filter[] = ['all', 'backend', 'frontend', 'platform']

interface FilterTabsProps {
  active: Filter
  onChange: (filter: Filter) => void
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter quests by category"
      className="flex flex-wrap gap-2"
      onKeyDown={(e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
        const i = FILTERS.indexOf(active)
        const next = FILTERS[(i + (e.key === 'ArrowRight' ? 1 : FILTERS.length - 1)) % FILTERS.length]
        playClick()
        onChange(next)
        e.currentTarget.querySelector<HTMLElement>(`[data-filter="${next}"]`)?.focus()
      }}
    >
      {FILTERS.map((filter) => {
        const selected = active === filter
        return (
          <button
            key={filter}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            data-filter={filter}
            type="button"
            onClick={() => {
              playClick()
              onChange(filter)
            }}
            className={`mc-btn min-h-11 px-4 py-2.5 text-[9px] sm:text-[10px] ${
              selected ? 'mc-btn-green' : ''
            }`}
          >
            {filter === 'all' ? 'All' : CATEGORY_LABELS[filter]}
          </button>
        )
      })}
    </div>
  )
}
