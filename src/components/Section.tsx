import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface SectionProps {
  id: string
  kicker: string
  title: string
  children: ReactNode
}

export function Section({ id, kicker, title, children }: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>(0.05)

  return (
    <section id={id} ref={ref} className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-10 sm:px-8">
      <div className="mc-panel-glass p-6 sm:p-10">
        <div className={`reveal ${inView ? 'revealed' : ''}`}>
          <p className="pixel-text text-[9px] tracking-wider text-gold uppercase">{kicker}</p>
          <h2 tabIndex={-1} className="pixel-text mt-3 text-base outline-none sm:text-xl">
            {title}
          </h2>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
