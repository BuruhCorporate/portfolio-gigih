import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { registerSmoothScroll } from '@/lib/scroll'

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
