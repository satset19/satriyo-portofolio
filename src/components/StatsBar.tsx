import { stats } from '../data/stats'
import type { Stat } from '../data/stats'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'

function StatItem({ stat, start }: { stat: Stat; start: boolean }) {
  const value = useCountUp(stat.value, start)
  return (
    <div className="mc-slot flex flex-col items-center justify-center px-3 py-5 text-center sm:px-4">
      <p
        className="pixel-text text-sm text-xp tabular-nums sm:text-lg"
        style={{ textShadow: '2px 2px 0 #000' }}
      >
        <span aria-hidden>
          {stat.prefix}
          {value}
          {stat.suffix}
        </span>
        <span className="sr-only">{`${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`}</span>
      </p>
      <p className="mt-2 text-lg leading-tight text-slate-300">{stat.label}</p>
    </div>
  )
}

export function StatsBar() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)
  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <div
        className={`reveal ${inView ? 'revealed' : ''} mc-panel-glass grid grid-cols-2 gap-2 p-2 sm:grid-cols-4 sm:gap-3 sm:p-3`}
        aria-label="Career stats"
        role="list"
      >
        {stats.map((stat) => (
          <div key={stat.label} role="listitem" className="contents">
            <StatItem stat={stat} start={inView} />
          </div>
        ))}
      </div>
    </div>
  )
}
