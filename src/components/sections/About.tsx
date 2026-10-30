import type { Education, Experience, Profile, Stat } from '@/types/portfolio'
import { Section } from '@/components/layout/Section'
import styles from './About.module.css'

interface AboutProps {
  profile: Profile
  current: Experience
  education: Education
  stats: Stat[]
}

export const About = ({ profile, current, education, stats }: AboutProps) => {
  const facts = [
    { term: 'Based in', detail: profile.location },
    { term: 'Now at', detail: current.company },
    { term: 'Studied', detail: `${education.degree}, ${education.school}` },
  ]

  return (
    <Section id="about" stop="about" title="From the factory floor to the frontend">
      <div className={styles.intro}>
        <img
          className={styles.photo}
          src={profile.photo}
          alt={`Portrait of ${profile.name}`}
          width={720}
          height={1080}
          loading="lazy"
        />
        <ul className={styles.stats} aria-label="Quick facts">
          {stats.map((stat) => (
            <li key={stat.label}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.story}>
        {profile.summary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.term}>
            <dt>{fact.term}</dt>
            <dd>{fact.detail}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
