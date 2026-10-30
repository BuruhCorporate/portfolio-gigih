import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { CanvasTexture, DoubleSide, ExtrudeGeometry, Shape, SRGBColorSpace, type InstancedMesh } from 'three'
import { RoundedBox } from '@react-three/drei'
import { city, type Part, type ScreenId } from '../data/config'
import { drawSign, loadScreenFont } from '../lib/drawScreen'
import { windowPanes } from '../lib/geometry'
import { useInstances, type InstanceTransform } from '../hooks/useInstances'

type PartOf<S extends Part['shape']> = Extract<Part, { shape: S }>

const HALF = 0.5
const CORNER = 0.035
const GLASS = '#a9c7e6'
const WHITE = '#ffffff'
const PANE_DEPTH = 0.02

const SPHERE_WIDTH_SEGMENTS = 32
const SPHERE_HEIGHT_SEGMENTS = 16
const TORUS_RADIAL_SEGMENTS = 12
const TORUS_TUBE_SEGMENTS = 28

const Solid = ({ color, children }: { color: string; children: ReactNode }) => (
  <>
    {children}
    <meshStandardMaterial color={color} roughness={0.62} />
  </>
)

const Prism = ({ part, casts }: { part: PartOf<'prism'>; casts: boolean }) => {
  const [w, h, d] = part.size
  const geometry = useMemo(() => {
    const outline = new Shape()
    outline.moveTo(-w * HALF, 0)
    outline.lineTo(w * HALF, 0)
    outline.lineTo(0, h)
    outline.closePath()
    const extruded = new ExtrudeGeometry(outline, { depth: d, bevelEnabled: false })
    extruded.translate(0, 0, -d * HALF)
    return extruded
  }, [w, h, d])
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} position={part.position} castShadow={casts} receiveShadow>
      <meshStandardMaterial color={part.color} roughness={0.62} />
    </mesh>
  )
}

const Panes = ({ part }: { part: PartOf<'box'> }) => {
  const ref = useRef<InstancedMesh>(null)
  const panes = useMemo(
    () =>
      part.windows
        ? windowPanes(part.size, part.position, part.windows.rows, part.windows.cols).map(
            (pane): InstanceTransform => ({ position: pane.position, angleY: pane.angleY, scale: [pane.width, pane.height, 1] }),
          )
        : [],
    [part],
  )
  useInstances(ref, panes)

  if (panes.length === 0) return null
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, panes.length]}>
      <boxGeometry args={[1, 1, PANE_DEPTH]} />
      <meshStandardMaterial color={GLASS} roughness={0.15} metalness={0.1} envMapIntensity={1.4} />
    </instancedMesh>
  )
}

const Sign = ({ part }: { part: PartOf<'sign'> }) => {
  const [texture, setTexture] = useState<CanvasTexture | null>(null)
  const [w, h] = part.size

  useEffect(() => {
    let cancelled = false
    let made: CanvasTexture | null = null
    const paint = async () => {
      await loadScreenFont()
      if (cancelled) return
      const canvas = document.createElement('canvas')
      drawSign(canvas, part.text, part.background, part.color, w / h)
      made = new CanvasTexture(canvas)
      made.colorSpace = SRGBColorSpace
      setTexture(made)
    }
    void paint()
    return () => {
      cancelled = true
      made?.dispose()
    }
  }, [part, w, h])

  return (
    <mesh position={part.position}>
      <planeGeometry args={[w, h]} />
      {/* Keyed so the textured material is a fresh instance: R3F would otherwise reuse the flat one and reset its colour to black. */}
      <meshBasicMaterial key={texture ? 'map' : 'flat'} map={texture} color={texture ? WHITE : part.background} toneMapped={false} />
    </mesh>
  )
}

const Screen = ({ part, textures }: { part: PartOf<'screen'>; textures: Map<ScreenId, CanvasTexture> | null }) => {
  const map = textures?.get(part.screen)
  return (
    <mesh position={part.position}>
      <planeGeometry args={part.size} />
      <meshBasicMaterial key={map ? 'map' : 'flat'} map={map ?? null} color={WHITE} toneMapped={false} side={DoubleSide} />
    </mesh>
  )
}

const lifted = (position: [number, number, number], by: number): [number, number, number] => [
  position[0],
  position[1] + by,
  position[2],
]

export type ScreenTextures = Map<ScreenId, CanvasTexture> | null

interface RenderContext {
  textures: ScreenTextures
  /** false for things that move after the shadow map is baked (cars, the figure, the pin) */
  casts: boolean
}

type PartRenderers = { [S in Part['shape']]: (part: PartOf<S>, ctx: RenderContext) => ReactNode }

const renderers: PartRenderers = {
  box: (part, { casts }) => (
    <>
      <RoundedBox args={part.size} radius={part.radius ?? CORNER} smoothness={2} position={lifted(part.position, part.size[1] * HALF)} castShadow={casts} receiveShadow>
        <meshStandardMaterial color={part.color} roughness={0.62} />
      </RoundedBox>
      <Panes part={part} />
    </>
  ),
  cylinder: (part, { casts }) => (
    <mesh position={lifted(part.position, part.height * HALF)} rotation={part.rotation} castShadow={casts} receiveShadow>
      <Solid color={part.color}>
        <cylinderGeometry args={[part.radiusTop ?? part.radius, part.radius, part.height, part.segments]} />
      </Solid>
    </mesh>
  ),
  cone: (part, { casts }) => (
    <mesh position={lifted(part.position, part.height * HALF)} rotation={part.rotation} castShadow={casts} receiveShadow>
      <Solid color={part.color}>
        <coneGeometry args={[part.radius, part.height, part.segments]} />
      </Solid>
    </mesh>
  ),
  sphere: (part, { casts }) => (
    <mesh position={part.position} castShadow={casts} receiveShadow>
      <Solid color={part.color}>
        <sphereGeometry args={[part.radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS]} />
      </Solid>
    </mesh>
  ),
  torus: (part, { casts }) => (
    <mesh position={part.position} rotation={part.rotation} castShadow={casts} receiveShadow>
      <Solid color={part.color}>
        <torusGeometry args={[part.radius, part.tube, TORUS_RADIAL_SEGMENTS, TORUS_TUBE_SEGMENTS]} />
      </Solid>
    </mesh>
  ),
  prism: (part, { casts }) => <Prism part={part} casts={casts} />,
  sign: (part) => <Sign part={part} />,
  screen: (part, { textures }) => <Screen part={part} textures={textures} />,
}

interface PartListProps {
  parts: Part[]
  screenTextures?: ScreenTextures
  castShadows?: boolean
}

export const PartList = ({ parts, screenTextures = null, castShadows = true }: PartListProps) => (
  <>
    {parts.map((part, i) => (
      // Parts never reorder; the index is a stable key.
      <group key={i}>
        {(renderers[part.shape] as (p: Part, ctx: RenderContext) => ReactNode)(part, { textures: screenTextures, casts: castShadows })}
      </group>
    ))}
  </>
)

const BLOB_LIFT = 0.025
const FLAT = -Math.PI * HALF

/** A soft contact shadow for moving things; real shadows are baked once for the still city. */
export const BlobShadow = ({ radius }: { radius: number }) => (
  <mesh rotation-x={FLAT} position-y={BLOB_LIFT}>
    <circleGeometry args={[radius, city.blob.segments]} />
    <meshBasicMaterial color={city.blob.color} transparent opacity={city.blob.opacity} depthWrite={false} />
  </mesh>
)
