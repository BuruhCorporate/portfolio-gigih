import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pointOnLoop, roadDashes, roadPath, windowPanes } from '../src/features/city/lib/geometry.ts'
import city from '../src/features/city/data/city.json' with { type: 'json' }

const lines = [-7.5, -2.5, 2.5, 7.5]

test('roadPath goes straight along a shared row', () => {
  assert.deepEqual(roadPath({ x: -5, z: 2.5 }, { x: 5, z: 2.5 }, lines), [{ x: 5, z: 2.5 }])
})

test('roadPath turns onto the cheapest column between rows', () => {
  assert.deepEqual(roadPath({ x: -5, z: 2.5 }, { x: -1.2, z: -2.5 }, lines), [
    { x: -2.5, z: 2.5 },
    { x: -2.5, z: -2.5 },
    { x: -1.2, z: -2.5 },
  ])
})

test('roadPath from the middle of a column keeps to it', () => {
  assert.deepEqual(roadPath({ x: 2.5, z: 0.3 }, { x: 5, z: 7.5 }, lines), [
    { x: 2.5, z: 7.5 },
    { x: 5, z: 7.5 },
  ])
})

test('every leg of every stop-to-stop walk stays on a road line', () => {
  const spots = Object.values(city.stops).map((stop) => ({ x: stop.spot[0], z: stop.spot[1] }))
  const onLine = (v) => lines.some((line) => Math.abs(line - v) < 1e-6)
  spots.forEach((from) =>
    spots.forEach((to) => {
      const points = [from, ...roadPath(from, to, lines)]
      points.slice(1).forEach((point, i) => {
        const prev = points[i]
        const sameRow = Math.abs(prev.z - point.z) < 1e-6 && onLine(point.z)
        const sameColumn = Math.abs(prev.x - point.x) < 1e-6 && onLine(point.x)
        assert.ok(sameRow || sameColumn, `leg ${JSON.stringify(prev)} -> ${JSON.stringify(point)}`)
      })
    }),
  )
})

test('pointOnLoop walks the corners in order and wraps', () => {
  const loop = [0, 0, 4, 2]
  assert.deepEqual(pointOnLoop(loop, 0), { x: 0, z: 2, angle: Math.PI / 2 })
  // at a corner the car already faces down the next edge
  assert.deepEqual(pointOnLoop(loop, 4), { x: 4, z: 2, angle: Math.PI })
  assert.deepEqual(pointOnLoop(loop, 5), { x: 4, z: 1, angle: Math.PI })
  assert.deepEqual(pointOnLoop(loop, 12), pointOnLoop(loop, 0))
  assert.deepEqual(pointOnLoop(loop, -1), { x: 0, z: 1, angle: 0 })
})

test('windowPanes covers four walls', () => {
  const panes = windowPanes([2, 1, 1], [0, 0, 0], 2, 4)
  // front and back: 2 rows x 4 cols; sides: 2 rows x 2 cols
  assert.equal(panes.length, 2 * 4 * 2 + 2 * 2 * 2)
  assert.ok(panes.every((pane) => pane.position[1] > 0 && pane.position[1] < 1))
})

test('roadDashes never lands on a crossing', () => {
  const dashes = roadDashes(lines, 9.5, 0.9, 0.34, 0.36)
  assert.ok(dashes.length > 0)
  dashes.forEach(({ position: [x, , z] }) => {
    const crossing = lines.some((a) => Math.abs(a - x) < 0.45) && lines.some((b) => Math.abs(b - z) < 0.45)
    assert.ok(!crossing, `dash at ${x}, ${z}`)
  })
})
