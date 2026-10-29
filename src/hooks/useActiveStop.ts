import { useEffect, useState } from 'react'

// A panel counts once its top passes 70% down the viewport, so the camera starts flying as the panel slides in.
const TRIGGER_BAND = '0px 0px -30% 0px'

/**
 * The city stop of the lowest `[data-stop]` panel on screen. While only empty space is
 * on screen between panels, the last stop stays.
 */
export const useActiveStop = (initial: string): string => {
  const [stop, setStop] = useState(initial)

  useEffect(() => {
    const panels = [...document.querySelectorAll<HTMLElement>('[data-stop]')]
    const onScreen = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? onScreen.add(entry.target) : onScreen.delete(entry.target)))
        const lowest = panels.findLast((panel) => onScreen.has(panel))
        if (lowest?.dataset.stop) setStop(lowest.dataset.stop)
      },
      { rootMargin: TRIGGER_BAND },
    )
    panels.forEach((panel) => observer.observe(panel))
    return () => observer.disconnect()
  }, [])

  return stop
}
