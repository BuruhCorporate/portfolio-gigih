import { Component, lazy, Suspense, useState, type ReactNode } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './CityStage.module.css'

// three.js is the heaviest part of the bundle; load it after the page text has painted.
const CityScene = lazy(async () => {
  const { CityScene: Scene } = await import('./CityScene')
  return { default: Scene }
})

const DESKTOP_DPR = 2
const MOBILE_DPR = 1.5

const hasWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

interface BoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

// Error boundaries still have to be classes. Catches a WebGL context that fails after the check above.
class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

interface CityStageProps {
  stopId: string
  onSelect: (stop: string) => void
  poster: { src: string; alt: string }
}

/** The 3D city fixed behind the page, with a still image when WebGL is missing or fails. */
export const CityStage = ({ stopId, onSelect, poster }: CityStageProps) => {
  const reducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [webgl] = useState(hasWebGL)

  const still = <img className={styles.poster} src={poster.src} alt={poster.alt} />

  return (
    <div className={styles.stage}>
      {webgl ? (
        <SceneBoundary fallback={still}>
          <Suspense fallback={<p className={styles.loading}>Building the city…</p>}>
            <CityScene
              stopId={stopId}
              animate={!reducedMotion}
              maxDpr={isDesktop ? DESKTOP_DPR : MOBILE_DPR}
              compact={!isDesktop}
              onSelect={onSelect}
            />
          </Suspense>
        </SceneBoundary>
      ) : (
        still
      )}
    </div>
  )
}
