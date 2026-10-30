import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import { useFrame } from '@react-three/fiber'
import { city, type Loop, type Part } from '../data/config'
import { pointOnLoop } from '../lib/geometry'
import { BlobShadow, PartList } from './Parts'

const ROAD_TOP = 0.02
const ACCENT = 'accent'

// Traffic keeps left, as it does in Indonesia; with this loop direction the left lane is the inner one.
const inset = ([minX, minZ, maxX, maxZ]: Loop, by: number): Loop => [minX + by, minZ + by, maxX - by, maxZ - by]

const paint = (parts: Part[], color: string): Part[] =>
  parts.map((part) => ('color' in part && part.color === ACCENT ? { ...part, color } : part))

export const Cars = ({ animate }: { animate: boolean }) => {
  const refs = useRef<(Group | null)[]>([])
  const cars = useMemo(
    () => city.cars.map((car) => ({ ...car, loop: inset(car.loop, city.lane), parts: paint(city.carParts, car.color) })),
    [],
  )

  useFrame((state) => {
    const time = animate ? state.clock.elapsedTime : 0
    cars.forEach((car, i) => {
      const group = refs.current[i]
      if (!group) return
      const at = pointOnLoop(car.loop, car.offset + car.speed * time)
      group.position.set(at.x, ROAD_TOP, at.z)
      group.rotation.y = at.angle
    })
  })

  return (
    <>
      {cars.map((car, i) => (
        <group
          key={`${car.color}${car.offset}`}
          ref={(group) => {
            refs.current[i] = group
          }}
        >
          <PartList parts={car.parts} castShadows={false} />
          <BlobShadow radius={city.blob.car} />
        </group>
      ))}
    </>
  )
}
