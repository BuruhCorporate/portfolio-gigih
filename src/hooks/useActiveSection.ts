import { useEffect, useState } from 'react'

// A section counts as active while it crosses the band 40% down the viewport.
const ACTIVE_BAND = '-40% 0px -55% 0px'

/** Returns the id of the section under the band, or null (e.g. while the hero is on screen). */
export const useActiveSection = (ids: string[]): string | null => {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const inBand = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id)
          else inBand.delete(entry.target.id)
        })
        setActive(ids.find((id) => inBand.has(id)) ?? null)
      },
      { rootMargin: ACTIVE_BAND },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return active
}
