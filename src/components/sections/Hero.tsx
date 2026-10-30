import { useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Experience, Profile } from '@/types/portfolio'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { city } from '@/features/city'
import { Button } from '@/components/ui/Button'
import styles from './Hero.module.css'

gsap.registerPlugin(useGSAP)

const ENTRANCE = { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.15 } as const

interface HeroProps {
  profile: Profile
  current: Experience
  mapStops: string[]
  onSelect: (stop: string) => void
}

export const Hero = ({ profile, current, mapStops, onSelect }: HeroProps) => {
  const rootRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('[data-reveal]', ENTRANCE)
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  )

  return (
    <section ref={rootRef} id="top" className={`column ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.copy} data-stop="overview">
        <p className={styles.status} data-reveal>
          <span className={styles.dot} aria-hidden="true" />
          {current.role} at {current.companyShort}
        </p>
        <h1 id="hero-title" className={styles.name} data-reveal>
          {profile.name}
        </h1>
        <p className={styles.role} data-reveal>
          {profile.role} in {profile.location}
        </p>
        <p className={styles.tagline} data-reveal>
          {profile.tagline}
        </p>
        <div className={styles.actions} data-reveal>
          <Button href="#projects">See my work</Button>
          <Button href={`mailto:${profile.email}`} variant="secondary">
            Email me
          </Button>
        </div>
      </div>

      <nav className={`panel ${styles.map}`} aria-labelledby="map-title" data-reveal>
        <h2 id="map-title" className={styles.mapTitle}>
          Take the tour
        </h2>
        <p className={styles.mapIntro}>
          Every building in this little city is a stop in my career. Scroll and I will walk you through it, or jump
          straight to a place.
        </p>
        <ul className={styles.places}>
          {mapStops.map((stop) => (
            <li key={stop}>
              <button
                type="button"
                className={styles.place}
                style={{ '--pin': city.stops[stop]?.color } as CSSProperties}
                onClick={() => onSelect(stop)}
              >
                {city.stops[stop]?.place}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
