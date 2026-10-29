import { useEffect, useRef } from 'react'
import { screens, type ScreenId } from '../../scene/config'
import { drawScreen, loadScreenFont } from '../../scene/drawScreen'
import styles from './ScreenPreview.module.css'

interface ScreenPreviewProps {
  screen: ScreenId
  label: string
}

/** The same dashboard mock the 3D laptop shows, drawn flat inside a browser frame. */
export const ScreenPreview = ({ screen, label }: ScreenPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    const paint = async () => {
      await loadScreenFont()
      const canvas = canvasRef.current
      if (!cancelled && canvas) drawScreen(canvas, screen)
    }
    void paint()
    return () => {
      cancelled = true
    }
  }, [screen])

  return (
    <figure className={styles.browser}>
      <div className={styles.bar} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <canvas ref={canvasRef} className={styles.canvas} width={screens.width} height={screens.height} role="img" aria-label={label} />
    </figure>
  )
}
