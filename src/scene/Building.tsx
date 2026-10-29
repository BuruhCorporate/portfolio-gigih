import { useRef } from 'react'
import { MathUtils, type Group } from 'three'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { city, type Building as BuildingSpec } from './config'
import { PartList, type ScreenTextures } from './Parts'

const MIN_SCALE = 0.001
const BACK_OVERSHOOT = 1.6
const LIFT_DAMPING = 10
const CUBE = 3
const SQUARE = 2

const easeOutBack = (x: number) => 1 + (BACK_OVERSHOOT + 1) * (x - 1) ** CUBE + BACK_OVERSHOOT * (x - 1) ** SQUARE

interface BuildingProps {
  spec: BuildingSpec
  /** order in the opening rise, nearest the centre first */
  index: number
  animate: boolean
  hovered: boolean
  screenTextures: ScreenTextures
  onHover: (id: string | null) => void
  onSelect: (stop: string) => void
}

/** One building: rises out of its plot on load, lifts on hover, and links to its page stop on click. */
export const Building = ({ spec, index, animate, hovered, screenTextures, onHover, onSelect }: BuildingProps) => {
  const liftRef = useRef<Group>(null)
  const riseRef = useRef<Group>(null)
  const startedAt = useRef<number | null>(null)
  const { rise } = city

  useFrame((state, delta) => {
    startedAt.current ??= state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startedAt.current
    const progress = animate ? MathUtils.clamp((elapsed - rise.delay - index * rise.stagger) / rise.duration, 0, 1) : 1
    if (riseRef.current) riseRef.current.scale.y = Math.max(MIN_SCALE, easeOutBack(progress))
    if (liftRef.current) {
      liftRef.current.position.y = MathUtils.damp(liftRef.current.position.y, hovered ? rise.hoverLift : 0, LIFT_DAMPING, delta)
    }
  })

  const enter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onHover(spec.id)
  }
  const leave = () => onHover(null)
  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect(spec.stop)
  }

  return (
    <group position={spec.position} onPointerOver={enter} onPointerOut={leave} onClick={select}>
      <group ref={liftRef}>
        <group ref={riseRef}>
          <PartList parts={spec.parts} screenTextures={screenTextures} />
        </group>
      </group>
    </group>
  )
}
