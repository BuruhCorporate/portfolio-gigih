import type { Profile } from '../../types/portfolio'
import { useClipboard, type CopyStatus } from '../../hooks/useClipboard'
import { Button } from '../ui/Button'
import { PlaceTag } from '../ui/PlaceTag'
import styles from './Contact.module.css'

interface ContactProps {
  profile: Profile
}

const copyLabel: Record<CopyStatus, string> = {
  idle: 'Copy email',
  copied: 'Copied',
  failed: 'Copy blocked. Select the address instead.',
}

export const Contact = ({ profile }: ContactProps) => {
  const { status, copy } = useClipboard()

  return (
    <section className={`column ${styles.contact}`} aria-labelledby="contact-title">
      <div id="contact" className={`panel ${styles.panel}`} data-stop="contact" tabIndex={-1}>
        <PlaceTag stop="contact" />
        <h2 id="contact-title" className={styles.title}>
          Hiring, or need a hand with a web app?
        </h2>
        <p className={styles.lead}>
          Email works best. Tell me what you are building and when you need it, and I will get back to you.
        </p>
        <p className={styles.email}>{profile.email}</p>
        <div className={styles.actions}>
          <Button href={`mailto:${profile.email}`}>Email me</Button>
          <Button variant="secondary" onClick={() => copy(profile.email)}>
            <span aria-live="polite">{copyLabel[status]}</span>
          </Button>
          <Button href={profile.linkedin} variant="secondary" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Button>
        </div>
      </div>
    </section>
  )
}
