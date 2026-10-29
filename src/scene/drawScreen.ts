import { screens, type ScreenElement, type ScreenId } from './config'

const FULL_CIRCLE = Math.PI + Math.PI
const DEFAULT_WEIGHT = 400
const HALF = 0.5
const BAR_CORNER_RATIO = 0.16

type Painters = { [T in ScreenElement['type']]: (element: Extract<ScreenElement, { type: T }>) => void }

/** Paints one dashboard screen, scaled from the design size to the canvas width. */
export const drawScreen = (canvas: HTMLCanvasElement, id: ScreenId) => {
  const spec = screens.screens.find((screen) => screen.id === id)
  const ctx = canvas.getContext('2d')
  if (!spec || !ctx) return

  const painters: Painters = {
    rect: (el) => {
      ctx.fillStyle = el.fill
      ctx.beginPath()
      ctx.roundRect(el.x, el.y, el.w, el.h, el.r ?? 0)
      ctx.fill()
    },
    circle: (el) => {
      ctx.fillStyle = el.fill
      ctx.beginPath()
      ctx.arc(el.x, el.y, el.r, 0, FULL_CIRCLE)
      ctx.fill()
    },
    text: (el) => {
      ctx.fillStyle = el.fill
      ctx.textAlign = el.align ?? 'left'
      ctx.font = `${el.weight ?? DEFAULT_WEIGHT} ${el.size}px ${screens.font}`
      ctx.fillText(el.text, el.x, el.y)
    },
    bars: (el) => {
      const count = el.values.length
      const barWidth = (el.w - el.gap * (count - 1)) / count
      const corner = barWidth * BAR_CORNER_RATIO
      ctx.textAlign = 'center'
      ctx.font = `${DEFAULT_WEIGHT} ${el.labelSize}px ${screens.font}`
      el.values.forEach((value, i) => {
        const x = el.x + i * (barWidth + el.gap)
        const height = el.h * value
        ctx.fillStyle = i === el.accentIndex ? el.accent : el.fill
        ctx.beginPath()
        ctx.roundRect(x, el.y + el.h - height, barWidth, height, [corner, corner, 0, 0])
        ctx.fill()
        ctx.fillStyle = el.labelFill
        ctx.fillText(el.labels[i] ?? '', x + barWidth * HALF, el.labelY)
      })
    },
  }

  const scale = canvas.width / screens.width
  ctx.save()
  ctx.scale(scale, scale)
  ;[...screens.chrome, ...spec.elements].forEach((element) => {
    // The mapped type guarantees each painter matches its element; TS cannot narrow the lookup itself.
    ;(painters[element.type] as (el: ScreenElement) => void)(element)
  })
  ctx.restore()
}

/** Canvas text uses whatever font is loaded at draw time, so wait for the web font first. */
export const loadScreenFont = async () => {
  const weights = ['400', '600', '700']
  await Promise.all(weights.map((weight) => document.fonts.load(`${weight} 16px ${screens.font}`)))
}

const SIGN_HEIGHT_PX = 96
const SIGN_TEXT_RATIO = 0.5
const SIGN_WEIGHT = 700

/** A shop-front sign: centred bold text on a flat colour, sized to the sign's aspect ratio. */
export const drawSign = (canvas: HTMLCanvasElement, text: string, background: string, color: string, aspect: number) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.height = SIGN_HEIGHT_PX
  canvas.width = Math.round(SIGN_HEIGHT_PX * aspect)
  ctx.fillStyle = background
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const size = SIGN_HEIGHT_PX * SIGN_TEXT_RATIO
  ctx.font = `${SIGN_WEIGHT} ${size}px ${screens.font}`
  // Shrink long names until they fit with a little margin on both sides.
  const fit = Math.min(1, (canvas.width * SIGN_TEXT_RATIO + canvas.width * SIGN_TEXT_RATIO * SIGN_TEXT_RATIO) / ctx.measureText(text).width)
  ctx.font = `${SIGN_WEIGHT} ${size * fit}px ${screens.font}`
  ctx.fillText(text, canvas.width * HALF, canvas.height * HALF)
}
