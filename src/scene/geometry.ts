// Pure layout maths for the city. No three.js here, so the checks in tests/ run under plain Node.

export interface Point {
  x: number
  z: number
}

export interface Heading extends Point {
  /** rotation around Y that points a model's +Z along the direction of travel */
  angle: number
}

export interface Placement {
  position: [number, number, number]
  angleY: number
  width: number
  height: number
}

const EPSILON = 1e-6
const HALF = 0.5
const WINDOW_WIDTH = 0.55
const WINDOW_HEIGHT = 0.5
const WINDOW_PROUD = 0.006
const QUARTER_TURN = Math.PI * HALF

const near = (a: number, b: number) => Math.abs(a - b) < EPSILON

/**
 * Waypoints from `from` to `to` that keep to the road grid.
 * `to` sits on a road row (constant z); `from` sits on a row or a column, which holds mid-walk too.
 */
export const roadPath = (from: Point, to: Point, lines: number[]): Point[] => {
  if (near(from.z, to.z)) return [to]
  if (lines.some((x) => near(x, from.x))) return [{ x: from.x, z: to.z }, to]
  const detour = (x: number) => Math.abs(from.x - x) + Math.abs(to.x - x)
  const column = lines.reduce((best, x) => (detour(x) < detour(best) ? x : best))
  return [
    { x: column, z: from.z },
    { x: column, z: to.z },
    to,
  ]
}

/** Position and heading `distance` along a rectangular loop, driving +X along the front edge. */
export const pointOnLoop = ([minX, minZ, maxX, maxZ]: [number, number, number, number], distance: number): Heading => {
  const corners: Point[] = [
    { x: minX, z: maxZ },
    { x: maxX, z: maxZ },
    { x: maxX, z: minZ },
    { x: minX, z: minZ },
  ]
  const halfPerimeter = maxX - minX + (maxZ - minZ)
  const perimeter = halfPerimeter + halfPerimeter
  const travelled = ((distance % perimeter) + perimeter) % perimeter

  const lengths = corners.map((start, i) => {
    const end = corners[(i + 1) % corners.length]
    return Math.abs(end.x - start.x) + Math.abs(end.z - start.z)
  })
  // distance along the loop where each edge begins
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((sum, length) => sum + length, 0))
  const index = Math.max(0, starts.findLastIndex((start) => start <= travelled))
  const edge = { start: corners[index], end: corners[(index + 1) % corners.length], length: lengths[index] }
  const t = edge.length > 0 ? (travelled - starts[index]) / edge.length : 0
  const dx = edge.end.x - edge.start.x
  const dz = edge.end.z - edge.start.z
  return { x: edge.start.x + dx * t, z: edge.start.z + dz * t, angle: Math.atan2(dx, dz) }
}

/** Window panes on all four walls of a box, in the box's parent space. `position` is the box's bottom centre. */
export const windowPanes = (
  size: [number, number, number],
  position: [number, number, number],
  rows: number,
  cols: number,
): Placement[] => {
  const [w, h, d] = size
  const [cx, by, cz] = position
  const sideCols = Math.max(1, Math.round((cols * d) / w))
  const cellH = h / rows

  const walls = [
    { cols, span: w, out: d * HALF + WINDOW_PROUD, angleY: 0 },
    { cols, span: w, out: -(d * HALF + WINDOW_PROUD), angleY: Math.PI },
    { cols: sideCols, span: d, out: w * HALF + WINDOW_PROUD, angleY: QUARTER_TURN },
    { cols: sideCols, span: d, out: -(w * HALF + WINDOW_PROUD), angleY: -QUARTER_TURN },
  ]

  return walls.flatMap((wall) => {
    const cellW = wall.span / wall.cols
    return Array.from({ length: rows * wall.cols }, (_, i) => {
      const row = Math.floor(i / wall.cols)
      const along = (i % wall.cols + HALF) * cellW - wall.span * HALF
      const y = by + (row + HALF) * cellH
      const facesZ = wall.angleY === 0 || wall.angleY === Math.PI
      const position: [number, number, number] = facesZ ? [cx + along, y, cz + wall.out] : [cx + wall.out, y, cz + along]
      return { position, angleY: wall.angleY, width: cellW * WINDOW_WIDTH, height: cellH * WINDOW_HEIGHT }
    })
  })
}

/** Centre-line dashes along every road, leaving the crossings clear. */
export const roadDashes = (lines: number[], extent: number, roadWidth: number, length: number, gap: number): Placement[] => {
  const step = length + gap
  const count = Math.floor((extent + extent) / step)
  const along = Array.from({ length: count }, (_, i) => -extent + (i + HALF) * step).filter((v) =>
    lines.every((line) => Math.abs(v - line) > roadWidth * HALF + length * HALF),
  )
  return lines.flatMap((line) =>
    along.flatMap((v) => [
      { position: [v, 0, line] as [number, number, number], angleY: 0, width: length, height: 0 },
      { position: [line, 0, v] as [number, number, number], angleY: QUARTER_TURN, width: length, height: 0 },
    ]),
  )
}
