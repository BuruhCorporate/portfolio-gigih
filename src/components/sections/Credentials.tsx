import type { Certification, Education } from '@/types/portfolio'
import { Section } from '@/components/layout/Section'
import styles from './Credentials.module.css'

interface CredentialsProps {
  education: Education
  certifications: Certification[]
}

export const Credentials = ({ education, certifications }: CredentialsProps) => (
  <Section id="education" stop="education" title="Education and training">
    <div className={styles.grid}>
      <article className={styles.block}>
        <h3 className={styles.heading}>Degree</h3>
        <p className={styles.title}>{education.degree}</p>
        <p className={styles.meta}>
          {education.school}, {education.period}
        </p>
        <p>{education.note}</p>
      </article>

      <article className={styles.block}>
        <h3 className={styles.heading}>Certifications</h3>
        <ul className={styles.list}>
          {certifications.map((cert) => (
            <li key={cert.title}>
              <p className={styles.title}>{cert.title}</p>
              <p className={styles.meta}>
                {cert.issuer}, {cert.date}
              </p>
              <p>{cert.detail}</p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  </Section>
)
