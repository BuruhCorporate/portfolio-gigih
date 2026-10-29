import { useEffect, useMemo, useRef, useState } from 'react'
import { MathUtils, Vector3, type Group } from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, PerformanceMonitor } from '@react-three/drei'
import { city, type ScreenId, type Stop } from './config'
import { useScreenTextures } from './useScreenTextures'
import { Building } from './Building'
import { PartList } from './Parts'
import { Ground } from './Ground'
import { Cars } from './Cars'
import { Character } from './Character'
import styles from './CityStage.module.css'

const { camera: cam, lights, stops, buildings, pin, ui, rise, performance: perf } = city
const SCREEN_IDS: ScreenId[] = ['reports', 'approvals', 'access']
const PIN_DAMPING = 6
const PIN_BOB_RATE = 2.2
const PIN_SPIN_RATE = 1.2
const LABEL_GAP = 0.35
const PARALLAX_TILT = 0.5

// Nearest the centre rises first, so the city grows outwards.
const riseOrder = new Map(
  [...buildings]
    .sort((a, b) => Math.hypot(a.position[0], a.position[2]) - Math.hypot(b.position[0], b.position[2]))
    .map((building, i) => [building.id, i]),
)

interface View {
  target: Vector3
  azimuth: number
  elevation: number
  distance: number
}

/** Flies the camera to the active stop and offsets the frame so the subject clears the text column. */
const CameraRig = ({ stop, animate }: { stop: Stop; animate: boolean }) => {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const pointer = useThree((state) => state.pointer)
  const view = useRef<View | null>(null)

  useFrame((_, delta) => {
    const narrow = size.width < size.height
    const goal = {
      target: new Vector3(...stop.target),
      azimuth: stop.azimuth + (animate ? pointer.x * cam.parallax : 0),
      elevation: stop.elevation + (animate ? pointer.y * cam.parallax * PARALLAX_TILT : 0),
      distance: stop.distance * (narrow ? cam.narrowDistance : 1),
    }
    // First frame: start high and far out, then settle in.
    view.current ??= animate
      ? { ...goal, target: goal.target.clone(), distance: goal.distance * cam.intro.distance, elevation: goal.elevation + cam.intro.elevation }
      : { ...goal, target: goal.target.clone() }

    const current = view.current
    const lambda = animate ? cam.damping : Number.POSITIVE_INFINITY
    current.target.set(
      MathUtils.damp(current.target.x, goal.target.x, lambda, delta),
      MathUtils.damp(current.target.y, goal.target.y, lambda, delta),
      MathUtils.damp(current.target.z, goal.target.z, lambda, delta),
    )
    current.azimuth = MathUtils.damp(current.azimuth, goal.azimuth, lambda, delta)
    current.elevation = MathUtils.damp(current.elevation, goal.elevation, lambda, delta)
    current.distance = MathUtils.damp(current.distance, goal.distance, lambda, delta)

    const flat = Math.cos(current.elevation) * current.distance
    camera.position.set(
      current.target.x + Math.sin(current.azimuth) * flat,
      current.target.y + Math.sin(current.elevation) * current.distance,
      current.target.z + Math.cos(current.azimuth) * flat,
    )
    camera.lookAt(current.target)

    const wide = size.width >= cam.desktopMin
    camera.setViewOffset(
      size.width,
      size.height,
      wide ? -size.width * cam.desktopShift : 0,
      wide ? 0 : size.height * cam.mobileShift,
      size.width,
      size.height,
    )
  })

  return null
}

/** The red map pin that hovers over the building for the current stop. */
const Pin = ({ stopId, animate }: { stopId: string; animate: boolean }) => {
  const ref = useRef<Group>(null)
  const building = buildings.find((item) => item.stop === stopId)

  useFrame((state, delta) => {
    const group = ref.current
    if (!group) return
    const visible = building ? 1 : 0
    group.scale.setScalar(MathUtils.damp(group.scale.x, visible, PIN_DAMPING, delta))
    if (!building) return
    const time = animate ? state.clock.elapsedTime : 0
    const lambda = animate ? PIN_DAMPING : Number.POSITIVE_INFINITY
    const [x, , z] = building.position
    const y = building.top + pin.float + Math.sin(time * PIN_BOB_RATE) * pin.bob
    group.position.set(
      MathUtils.damp(group.position.x, x, lambda, delta),
      MathUtils.damp(group.position.y, y, lambda, delta),
      MathUtils.damp(group.position.z, z, lambda, delta),
    )
    group.rotation.y = time * PIN_SPIN_RATE
  })

  return (
    <group ref={ref} scale={0}>
      <PartList parts={pin.parts} castShadows={false} />
    </group>
  )
}

const HoverLabel = ({ id }: { id: string }) => {
  const building = buildings.find((item) => item.id === id)
  if (!building) return null
  const [x, y, z] = building.position
  return (
    <Html position={[x, y + building.top + LABEL_GAP, z]} center className={styles.label} zIndexRange={ui.labelZ}>
      <strong>{stops[building.stop]?.place}</strong>
      <span>Click to visit</span>
    </Html>
  )
}

/** Shows the pointer cursor while a building is under it. */
const useHoverCursor = (hovered: string | null) => {
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])
}

// Every building has finished rising by now; after that the still city needs no fresh shadows.
const INTRO_END = rise.delay + rise.stagger * buildings.length + rise.duration

/**
 * The city stands still, so its shadow map is drawn only while something in it moves:
 * the opening rise and a moment after each hover lift. Cars and the figure use blob shadows.
 */
const ShadowBaker = ({ hovered }: { hovered: string | null }) => {
  const gl = useThree((state) => state.gl)
  const settleUntil = useRef(0)
  const pending = useRef(true)

  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
  }, [gl])

  useEffect(() => {
    pending.current = true
  }, [hovered])

  useFrame((state) => {
    const now = state.clock.elapsedTime
    if (pending.current) {
      settleUntil.current = now + perf.settle
      pending.current = false
    }
    if (now < INTRO_END || now < settleUntil.current) gl.shadowMap.needsUpdate = true
  })

  return null
}

/** Device pixel ratio that keeps the canvas under the pixel budget, so 4K screens do not render 9M pixels a frame. */
const budgetDpr = (maxDpr: number) => {
  const cssPixels = window.innerWidth * window.innerHeight
  return MathUtils.clamp(Math.sqrt(perf.pixelBudget / cssPixels), 1, maxDpr)
}

interface CitySceneProps {
  stopId: string
  animate: boolean
  maxDpr: number
  /** smaller shadow map on phones */
  compact: boolean
  onSelect: (stop: string) => void
}

export const CityScene = ({ stopId, animate, maxDpr, compact, onSelect }: CitySceneProps) => {
  const [hovered, setHovered] = useState<string | null>(null)
  const [dpr, setDpr] = useState(() => budgetDpr(maxDpr))
  const textures = useScreenTextures(SCREEN_IDS)
  const stop = stops[stopId] ?? stops.overview
  const mapSize = compact ? lights.sun.mobileMapSize : lights.sun.mapSize
  const shadowSize = useMemo(() => [mapSize, mapSize] as const, [mapSize])
  useHoverCursor(hovered)

  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      camera={{ fov: cam.fov, near: cam.near, far: cam.far, position: [0, cam.far * PARALLAX_TILT, 0] }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
      onPointerMissed={() => setHovered(null)}
    >
      {/* Drops to 1x if the frame rate sags on a slower machine. */}
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <ShadowBaker hovered={hovered} />
      <CameraRig stop={stop} animate={animate} />
      <Environment files={lights.environment} environmentIntensity={lights.environmentIntensity} />
      <directionalLight
        position={lights.sun.position}
        intensity={lights.sun.intensity}
        castShadow
        shadow-mapSize={shadowSize}
        shadow-bias={lights.sun.bias}
        shadow-normalBias={lights.sun.normalBias}
        shadow-camera-left={-lights.sun.extent}
        shadow-camera-right={lights.sun.extent}
        shadow-camera-top={lights.sun.extent}
        shadow-camera-bottom={-lights.sun.extent}
      />

      <Ground />
      {buildings.map((building) => (
        <Building
          key={building.id}
          spec={building}
          index={riseOrder.get(building.id) ?? 0}
          animate={animate}
          hovered={hovered === building.id}
          screenTextures={textures}
          onHover={setHovered}
          onSelect={onSelect}
        />
      ))}
      <Pin stopId={stopId} animate={animate} />
      <Character spot={stop.spot} animate={animate} />
      <Cars animate={animate} />
      {hovered && <HoverLabel id={hovered} />}
    </Canvas>
  )
}
