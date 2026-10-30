import type { ReactNode } from 'react'
import { PlaceTag } from '@/components/ui/PlaceTag'
import styles from './Section.module.css'

interface SectionProps {
  id: string
  stop: string
  title: string
  intro?: string
  children: ReactNode
}

export const Section = ({ id, stop, title, intro, children }: SectionProps) => (
  <section className={`column ${styles.section}`} aria-labelledby={`${id}-title`}>
    {/* The anchor sits on the panel, not the section, so nav links land on the card rather than the empty gap above it. */}
    <div id={id} className="panel" data-stop={stop} tabIndex={-1}>
      <header className={styles.header}>
        <PlaceTag stop={stop} />
        <h2 id={`${id}-title`} className={styles.title}>
          {title}
        </h2>
        {intro && <p className={styles.intro}>{intro}</p>}
      </header>
      {children}
    </div>
  </section>
)
