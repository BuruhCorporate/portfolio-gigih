import {
  DataTexture,
  EquirectangularReflectionMapping,
  HalfFloatType,
  LinearFilter,
  LinearSRGBColorSpace,
  RGBAFormat,
} from 'three'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { studioHdrBase64 } from '../data/studioHdr'

// Parsed from the bundle instead of fetched: download managers (Neat, Free Download Manager) intercept
// any request for a .hdr file, which pops up their error dialog and leaves the city unlit.
export const createStudioEnvironment = () => {
  const bytes = Uint8Array.from(atob(studioHdrBase64), (c) => c.charCodeAt(0))
  const { data, width, height } = new HDRLoader().setDataType(HalfFloatType).parse(bytes.buffer)
  // Same settings HDRLoader gives a texture it loads from a URL.
  const texture = new DataTexture(data, width, height, RGBAFormat, HalfFloatType, EquirectangularReflectionMapping)
  texture.colorSpace = LinearSRGBColorSpace
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.generateMipmaps = false
  texture.flipY = true
  texture.needsUpdate = true
  return texture
}
