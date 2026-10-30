// shortcut: none of this stops a determined visitor (browser menu devtools, OS screenshots, phone cameras); it only raises the effort.

// `VITE_PROTECT=true|false` overrides; unset means on for production builds and off for `npm run dev`.
export const isProtected = (import.meta.env.VITE_PROTECT ?? String(import.meta.env.PROD)) === 'true'

const SHIELD_MS = 1200

// Ctrl/Cmd + Shift + I/J/C open devtools panels; Ctrl/Cmd + U/S/P are view source, save page and print.
const DEVTOOLS_KEYS = new Set(['i', 'j', 'c'])
const PAGE_KEYS = new Set(['u', 's', 'p'])
// macOS takes Cmd + Shift + 3/4/5 (and Windows takes Win + Shift + S) before the page sees the last key,
// but Cmd/Win + Shift reach the page first, so that pair alone raises the shield.
// It stays up until the pointer moves this long afterwards: the area-select crosshair holds the pointer, so the capture finishes blurred.
const SCREENSHOT_HOLD_MS = 1500

const isBlocked = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase()
  const mod = e.ctrlKey || e.metaKey
  if (e.key === 'F12') return true
  if (mod && e.shiftKey && DEVTOOLS_KEYS.has(key)) return true
  if (mod && e.altKey && DEVTOOLS_KEYS.has(key)) return true // Cmd + Option + I/J/C on macOS
  return mod && !e.shiftKey && PAGE_KEYS.has(key)
}

const isScreenshotChord = (e: KeyboardEvent) => e.metaKey && e.shiftKey

export const protectPage = () => {
  const root = document.documentElement
  root.classList.add('is-protected')

  let timer = 0
  const shield = (ms?: number) => {
    root.classList.add('is-shielded')
    window.clearTimeout(timer)
    if (ms) timer = window.setTimeout(() => root.classList.remove('is-shielded'), ms)
  }
  const unshield = () => root.classList.remove('is-shielded')

  let chordAt = 0
  document.addEventListener('contextmenu', (e) => e.preventDefault())
  document.addEventListener('dragstart', (e) => e.preventDefault())
  document.addEventListener('keydown', (e) => {
    if (isBlocked(e)) e.preventDefault()
    if (e.key === 'PrintScreen') shield(SHIELD_MS)
    if (isScreenshotChord(e)) {
      chordAt = performance.now()
      shield()
    }
  })
  document.addEventListener('pointermove', () => {
    if (!chordAt || performance.now() - chordAt < SCREENSHOT_HOLD_MS) return
    chordAt = 0
    unshield()
  })
  // Windows puts the PrintScreen capture on the clipboard after keyup; overwrite it.
  document.addEventListener('keyup', async (e) => {
    if (e.key !== 'PrintScreen') return
    shield(SHIELD_MS)
    try {
      await navigator.clipboard?.writeText('')
    } catch {
      // Clipboard access needs focus and permission; the blur shield still applies.
    }
  })
  // Snipping tools and screen recorders usually take focus first, so hide the page while it is not focused.
  window.addEventListener('blur', () => shield())
  window.addEventListener('focus', unshield)
  document.addEventListener('visibilitychange', () => (document.hidden ? shield() : unshield()))
}
