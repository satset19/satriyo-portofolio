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
    <div role="tablist" aria-label="Filter quests by category" className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const selected = active === filter
        return (
          <button
            key={filter}
            role="tab"
            aria-selected={selected}
            type="button"
            onClick={() => {
              playClick()
              onChange(filter)
            }}
            className={`mc-btn px-4 py-2.5 text-[9px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-xp ${
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
