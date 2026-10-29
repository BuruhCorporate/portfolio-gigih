import type { CSSProperties } from 'react'
import { city } from '../../scene/config'
import styles from './PlaceTag.module.css'

/** The map pin and place name for a city stop, matching the building the camera is showing. */
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
