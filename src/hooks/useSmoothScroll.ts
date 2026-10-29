import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { registerSmoothScroll } from '../lib/scroll'

/** Inertia scrolling for wheel and trackpad. Native scrolling stays when `enabled` is false (reduced motion). */
export const useSmoothScroll = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ autoRaf: true, anchors: true })
    registerSmoothScroll(lenis)
    return () => {
      registerSmoothScroll(null)
      lenis.destroy()
    }
  }, [enabled])
}
