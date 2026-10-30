import { useLayoutEffect, type RefObject } from 'react'
import { Object3D, type InstancedMesh } from 'three'
import type { Vec3 } from '../data/config'

export interface InstanceTransform {
  position: Vec3
  angleY?: number
  scale?: Vec3
}

export const useInstances = (ref: RefObject<InstancedMesh | null>, transforms: InstanceTransform[]) => {
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    transforms.forEach((transform, i) => {
      dummy.position.set(...transform.position)
      dummy.rotation.set(0, transform.angleY ?? 0, 0)
      dummy.scale.set(...(transform.scale ?? [1, 1, 1]))
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [ref, transforms])
}
