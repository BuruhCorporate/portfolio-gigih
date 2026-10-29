import { useEffect, useRef, useState } from 'react'
import { MathUtils, type Group } from 'three'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { city } from './config'
import { roadPath, type Point } from './geometry'
import { BlobShadow, PartList } from './Parts'
import styles from './CityStage.module.css'

const { character, lines, ui } = city
const { figure } = character
const ROAD_TOP = 0.02
const ARRIVED = 0.01
const TURN_DAMPING = 12
const LIMB_DAMPING = 14
const IDLE_BOB = 0.012
const IDLE_RATE = 2.4
const SECOND_MS = 1000

const toPoint = ([x, z]: [number, number]): Point => ({ x, z })

/** Shortest signed angle from `from` to `to`, so turning never spins the long way round. */
const angleDelta = (from: number, to: number) => Math.atan2(Math.sin(to - from), Math.cos(to - from))

const routeLength = (from: Point, points: Point[]) =>
  points.reduce((acc, point) => ({ at: point, length: acc.length + Math.hypot(point.x - acc.at.x, point.z - acc.at.z) }), {
    at: from,
    length: 0,
  }).length

interface CharacterProps {
  /** road spot to walk to */
  spot: [number, number]
  animate: boolean
}

/** A toy figure of Gigih that walks the roads to whichever stop the page is on. Click it to say hi. */
export const Character = ({ spot, animate }: CharacterProps) => {
  const rootRef = useRef<Group>(null)
  const shadowRef = useRef<Group>(null)
  const legs = useRef<(Group | null)[]>([])
  const arms = useRef<(Group | null)[]>([])
  const position = useRef<Point>(toPoint(spot))
  const route = useRef<{ goal: string; points: Point[] }>({ goal: spot.join(), points: [] })
  const jumpStarted = useRef<number | null>(null)
  const pendingJump = useRef(false)
  const [greeting, setGreeting] = useState(false)

  useEffect(() => {
    if (!greeting) return
    const timer = window.setTimeout(() => setGreeting(false), character.bubble * SECOND_MS)
    return () => window.clearTimeout(timer)
  }, [greeting])

  useFrame((state, delta) => {
    const root = rootRef.current
    if (!root) return
    const now = state.clock.elapsedTime

    // New stop: plan a road route from wherever the figure stands right now.
    if (route.current.goal !== spot.join()) {
      route.current = { goal: spot.join(), points: animate ? roadPath(position.current, toPoint(spot), lines) : [] }
      if (!animate) position.current = toPoint(spot)
    }

    const speed = Math.max(character.walkSpeed, routeLength(position.current, route.current.points) / character.arriveWithin)
    const next = route.current.points[0]
    const turnBy = Math.min(1, TURN_DAMPING * delta)

    if (next) {
      const dx = next.x - position.current.x
      const dz = next.z - position.current.z
      const gap = Math.hypot(dx, dz)
      const step = speed * delta
      if (gap < ARRIVED || step >= gap) {
        position.current = next
        route.current.points = route.current.points.slice(1)
      } else {
        position.current = { x: position.current.x + (dx / gap) * step, z: position.current.z + (dz / gap) * step }
      }
      if (gap > ARRIVED) root.rotation.y += angleDelta(root.rotation.y, Math.atan2(dx, dz)) * turnBy
    } else {
      // Waiting at a stop: face the camera's side of the street.
      root.rotation.y += angleDelta(root.rotation.y, 0) * turnBy
    }

    if (pendingJump.current) {
      jumpStarted.current = now
      pendingJump.current = false
    }
    const jumpT = jumpStarted.current === null ? 1 : (now - jumpStarted.current) / character.jump.duration
    const jumping = jumpT < 1
    const jump = jumping ? Math.sin(jumpT * Math.PI) * character.jump.height : 0
    const bob = next || !animate ? 0 : Math.sin(now * IDLE_RATE) * IDLE_BOB
    root.position.set(position.current.x, ROAD_TOP + jump + bob, position.current.z)
    shadowRef.current?.position.set(position.current.x, ROAD_TOP, position.current.z)

    // Legs and arms swing in opposite pairs; the right arm waves during a jump.
    const swing = next ? Math.sin(now * character.stride * (speed / character.walkSpeed)) * character.swing : 0
    const legAngles = [swing, -swing]
    const armAngles = [-swing, jumping ? -Math.PI * (1 - jumpT) : swing]
    legAngles.forEach((angle, i) => {
      const leg = legs.current[i]
      if (leg) leg.rotation.x = MathUtils.damp(leg.rotation.x, angle, LIMB_DAMPING, delta)
    })
    armAngles.forEach((angle, i) => {
      const arm = arms.current[i]
      if (arm) arm.rotation.x = MathUtils.damp(arm.rotation.x, angle, LIMB_DAMPING, delta)
    })
  })

  const sayHi = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    pendingJump.current = true
    setGreeting(true)
  }

  return (
    <>
    {/* The disc stays on the road while the figure jumps. */}
    <group ref={shadowRef}>
      <BlobShadow radius={city.blob.character} />
    </group>
    <group ref={rootRef} onClick={sayHi} scale={figure.scale}>
      {figure.legPivots.map((pivot, i) => (
        <group
          key={pivot.join()}
          position={pivot}
          ref={(group) => {
            legs.current[i] = group
          }}
        >
          <PartList parts={figure.leg} castShadows={false} />
        </group>
      ))}
      {figure.armPivots.map((pivot, i) => (
        <group
          key={pivot.join()}
          position={pivot}
          ref={(group) => {
            arms.current[i] = group
          }}
        >
          <PartList parts={figure.arm} castShadows={false} />
        </group>
      ))}
      <PartList parts={figure.body} castShadows={false} />

      {greeting && (
        <Html position={[0, figure.bubbleHeight, 0]} center className={styles.bubble} zIndexRange={ui.bubbleZ}>
          Hi, I’m Gigih!
        </Html>
      )}
    </group>
    </>
  )
}
