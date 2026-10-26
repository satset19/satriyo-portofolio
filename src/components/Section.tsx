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
    <section id={id} ref={ref} aria-labelledby={`${id}-title`}
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-8 sm:px-8 sm:py-10">
      <div className="mc-panel-glass p-5 sm:p-10">
        <div className={`reveal ${inView ? 'revealed' : ''}`}>
          <p className="pixel-text text-[10px] leading-relaxed tracking-wider text-gold uppercase">{kicker}</p>
          <h1 id={`${id}-title`} tabIndex={-1} className="pixel-text mt-3 text-sm leading-relaxed outline-none min-[390px]:text-base sm:text-xl">
            {title}
          </h1>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
