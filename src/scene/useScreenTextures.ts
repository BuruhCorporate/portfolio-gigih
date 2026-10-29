import { useEffect, useState } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { screens, type ScreenId } from './config'
import { drawScreen, loadScreenFont } from './drawScreen'

const ANISOTROPY = 8

/** One texture per dashboard, painted once the web font is ready. Null until then. */
export const useScreenTextures = (ids: ScreenId[]): Map<ScreenId, CanvasTexture> | null => {
  const [textures, setTextures] = useState<Map<ScreenId, CanvasTexture> | null>(null)

  useEffect(() => {
    let cancelled = false
    let made: CanvasTexture[] = []

    const build = async () => {
      await loadScreenFont()
      if (cancelled) return
      made = ids.map((id) => {
        const canvas = document.createElement('canvas')
        canvas.width = screens.width
        canvas.height = screens.height
        drawScreen(canvas, id)
        const texture = new CanvasTexture(canvas)
        texture.colorSpace = SRGBColorSpace
        texture.anisotropy = ANISOTROPY
        return texture
      })
      setTextures(new Map(ids.map((id, i) => [id, made[i]])))
    }
    void build()

    return () => {
      cancelled = true
      made.forEach((texture) => texture.dispose())
    }
  }, [ids])

  return textures
}
