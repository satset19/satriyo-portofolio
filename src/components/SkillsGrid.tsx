import { skillCategories } from '../data/skills'

export function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {skillCategories.map((category) => (
        <div key={category.title} className="mc-panel p-5">
          <h3 className="pixel-text text-[9px] tracking-wide text-xp uppercase">
            {category.title}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <li key={skill} className="mc-slot px-3 py-1 text-lg text-slate-200">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
