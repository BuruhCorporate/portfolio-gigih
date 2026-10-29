import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, type InstancedMesh } from 'three'
import { RoundedBox } from '@react-three/drei'
import { city } from './config'
import { roadDashes } from './geometry'
import { useInstances, type InstanceTransform } from './useInstances'

const { ground, lines, plots, trees, props } = city
const HALF = 0.5
const EXTENT = ground.size * HALF
const TOP_LAYER = 0.12
const ROAD_HEIGHT = 0.02

const Dashes = () => {
  const ref = useRef<InstancedMesh>(null)
  const dashes = useMemo(
    () =>
      roadDashes(lines, EXTENT, ground.roadWidth, ground.dash.length, ground.dash.gap).map(
        (dash): InstanceTransform => ({
          position: [dash.position[0], ROAD_HEIGHT, dash.position[2]],
          angleY: dash.angleY,
          scale: [dash.width, 1, 1],
        }),
      ),
    [],
  )
  useInstances(ref, dashes)

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, dashes.length]} receiveShadow>
      <boxGeometry args={props.dash} />
      <meshStandardMaterial color={ground.dash.color} roughness={0.8} />
    </instancedMesh>
  )
}

const Trees = () => {
  const trunkRef = useRef<InstancedMesh>(null)
  const crownRef = useRef<InstancedMesh>(null)
  const { trunk, crown } = props
  const [trunks, crowns] = useMemo(() => {
    const top = ground.plotHeight
    return [
      trees.map(([x, z, s]): InstanceTransform => ({ position: [x, top + trunk.height * HALF * s, z], scale: [s, s, s] })),
      trees.map(([x, z, s]): InstanceTransform => ({ position: [x, top + crown.y * s, z], scale: [s, s, s] })),
    ]
  }, [trunk, crown])
  useInstances(trunkRef, trunks)
  useInstances(crownRef, crowns)

  // Three greens, picked per tree so the rows do not look stamped.
  useLayoutEffect(() => {
    const crowns = crownRef.current
    if (!crowns) return
    const colors = ground.treeColors.map((hex) => new Color(hex))
    trees.forEach((_, i) => crowns.setColorAt(i, colors[i % colors.length]))
    if (crowns.instanceColor) crowns.instanceColor.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[trunk.radius, trunk.radius, trunk.height, trunk.segments]} />
        <meshStandardMaterial color={ground.treeTrunk} roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[crown.radius, 1]} />
        <meshStandardMaterial roughness={0.7} flatShading />
      </instancedMesh>
    </>
  )
}

/** The diorama base: a slab of soil under a pale top, ring and cross roads, and a plot per block. */
export const Ground = () => (
  <group>
    <mesh position={[0, -ground.thickness * HALF - TOP_LAYER * HALF, 0]} receiveShadow>
      <boxGeometry args={[ground.size, ground.thickness, ground.size]} />
      <meshStandardMaterial color={ground.sideColor} roughness={0.9} />
    </mesh>
    <RoundedBox args={[ground.size, TOP_LAYER, ground.size]} radius={0.04} smoothness={2} position={[0, -TOP_LAYER * HALF, 0]} receiveShadow>
      <meshStandardMaterial color={ground.topColor} roughness={0.85} />
    </RoundedBox>

    {lines.map((line) => (
      <group key={line}>
        <mesh position={[0, ROAD_HEIGHT * HALF, line]} receiveShadow>
          <boxGeometry args={[ground.size, ROAD_HEIGHT, ground.roadWidth]} />
          <meshStandardMaterial color={ground.roadColor} roughness={0.9} />
        </mesh>
        <mesh position={[line, ROAD_HEIGHT * HALF, 0]} receiveShadow>
          <boxGeometry args={[ground.roadWidth, ROAD_HEIGHT, ground.size]} />
          <meshStandardMaterial color={ground.roadColor} roughness={0.9} />
        </mesh>
      </group>
    ))}
    <Dashes />

    {plots.map((plot) => (
      <RoundedBox
        key={plot.position.join()}
        args={[ground.plotSize, ground.plotHeight, ground.plotSize]}
        radius={0.03}
        smoothness={2}
        position={[plot.position[0], ground.plotHeight * HALF, plot.position[1]]}
        receiveShadow
      >
        <meshStandardMaterial color={plot.color} roughness={0.85} />
      </RoundedBox>
    ))}
    <Trees />
  </group>
)
