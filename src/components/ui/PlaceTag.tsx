import type { CSSProperties } from 'react'
import { city } from '@/features/city'
import styles from './PlaceTag.module.css'

export const PlaceTag = ({ stop }: { stop: string }) => {
  const place = city.stops[stop]
  if (!place) return null
  return (
    <p className={styles.tag} style={{ '--pin': place.color } as CSSProperties}>
      <span className={styles.pin} aria-hidden="true" />
      {place.place}
    </p>
  )
}
