import type { Experience } from '@/types/portfolio'
import { formatMonth } from '@/lib/date'
import { PlaceTag } from '@/components/ui/PlaceTag'
import styles from './ExperienceTimeline.module.css'

interface ExperienceTimelineProps {
  items: Experience[]
}

export const ExperienceTimeline = ({ items }: ExperienceTimelineProps) => (
  <section className={`column ${styles.section}`} aria-labelledby="work-title">
    <div id="work" className={`panel ${styles.heading}`} data-stop="work" tabIndex={-1}>
      <PlaceTag stop="work" />
      <h2 id="work-title" className={styles.title}>
        Where I have worked
      </h2>
      <p className={styles.intro}>
        Newest first, one building per company. The freelance and contract jobs ran alongside my full-time role at
        MNC.
      </p>
    </div>

    <ol className={styles.timeline}>
      {items.map((job) => (
        <li
          key={job.id}
          className={`panel ${styles.item}`}
          data-stop={`job-${job.id}`}
          data-current={job.end === null}
          tabIndex={-1}
        >
          <div className={styles.meta}>
            <PlaceTag stop={`job-${job.id}`} />
            <p className={styles.dates}>
              <time dateTime={job.start}>{formatMonth(job.start)}</time>
              {' – '}
              {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : formatMonth(null)}
            </p>
          </div>
          <h3 className={styles.role}>{job.role}</h3>
          <p className={styles.company}>
            {job.company}
            <span className={styles.employment}>{job.employment}</span>
          </p>
          <ul className={styles.highlights}>
            {job.highlights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </section>
)
