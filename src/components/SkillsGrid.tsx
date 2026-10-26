import { skillCategories } from '../data/skills'

export function SkillsGrid() {
  if (skillCategories.length === 0) {
    return (
      <div role="status" className="mc-slot px-5 py-10 text-center">
        <p className="pixel-text text-[10px] text-gold">Skill tree is loading</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      {skillCategories.map((category) => (
        <section key={category.title} className="mc-panel p-5 sm:p-6">
          <h2 className="pixel-text text-[10px] tracking-wide text-xp uppercase">
            {category.title}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <li key={skill} className="mc-slot px-3 py-1 text-lg text-slate-200">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
