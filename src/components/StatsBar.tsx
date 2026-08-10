import { stats } from '../data/stats'
import type { Stat } from '../data/stats'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'

function StatItem({ stat, start }: { stat: Stat; start: boolean }) {
  const value = useCountUp(stat.value, start)
  return (
    <div className="mc-slot px-4 py-5 text-center">
      <p className="pixel-text text-sm text-xp sm:text-lg" style={{ textShadow: '2px 2px 0 #000' }}>
        {stat.prefix}
        {value}
        {stat.suffix}
      </p>
      <p className="mt-2 text-lg leading-tight text-slate-300">{stat.label}</p>
    </div>
  )
}

export function StatsBar() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)
  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <div
        className={`reveal ${inView ? 'revealed' : ''} mc-panel-glass grid grid-cols-2 gap-2 p-2 sm:grid-cols-4`}
      >
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} start={inView} />
        ))}
      </div>
    </div>
  )
}
