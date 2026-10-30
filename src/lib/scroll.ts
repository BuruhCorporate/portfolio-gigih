import type Lenis from 'lenis'

let smooth: Lenis | null = null

/** useSmoothScroll registers its Lenis instance here so programmatic scrolls go through it. */
export const registerSmoothScroll = (lenis: Lenis | null) => {
  smooth = lenis
}

/** Where it lands comes from `scroll-margin-top` in global.css, which both Lenis and native scrolling honour. */
export const scrollToStop = (stop: string) => {
  const panel = document.querySelector<HTMLElement>(`[data-stop="${CSS.escape(stop)}"]`)
  if (!panel) return
  if (smooth) {
    smooth.scrollTo(panel)
  } else {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    panel.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' })
  }
  panel.focus({ preventScroll: true })
}
