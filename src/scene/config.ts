import cityRaw from './city.json'
import screensRaw from './screens.json'

export type Vec3 = [number, number, number]
type Vec2 = [number, number]

interface PartBase {
  /** bottom centre for solids, centre for spheres, tori, signs and screens */
  position: Vec3
  rotation?: Vec3
}

export type Part = PartBase &
  (
    | { shape: 'box'; size: Vec3; color: string; radius?: number; windows?: { rows: number; cols: number } }
    | { shape: 'cylinder'; radius: number; radiusTop?: number; height: number; segments: number; color: string }
    | { shape: 'cone'; radius: number; height: number; segments: number; color: string }
    | { shape: 'sphere'; radius: number; color: string }
    | { shape: 'torus'; radius: number; tube: number; color: string }
    | { shape: 'prism'; size: Vec3; color: string }
    | { shape: 'sign'; text: string; size: Vec2; background: string; color: string }
    | { shape: 'screen'; screen: ScreenId; size: Vec2 }
  )

export interface Building {
  id: string
  /** the page stop this building stands for; clicking it scrolls there */
  stop: string
  position: Vec3
  /** height the map pin hovers above */
  top: number
  parts: Part[]
}

export interface Stop {
  place: string
  color: string
  target: Vec3
  /** radians around Y from +Z, and above the ground */
  azimuth: number
  elevation: number
  distance: number
  /** road point in front of the building where the character waits */
  spot: Vec2
}

/** [minX, minZ, maxX, maxZ] along road centre lines */
export type Loop = [number, number, number, number]

export interface CityConfig {
  camera: {
    fov: number
    damping: number
    parallax: number
    /** distance multiplier on portrait screens */
    narrowDistance: number
    /** fraction of the canvas the subject moves right (desktop) or up (mobile) to clear the text column */
    desktopShift: number
    mobileShift: number
    intro: { distance: number; elevation: number }
    near: number
    far: number
    /** canvas width (px) from which the subject shifts sideways instead of up */
    desktopMin: number
  }
  lights: {
    environment: string
    environmentIntensity: number
    sun: { position: Vec3; intensity: number; extent: number; mapSize: number; mobileMapSize: number; bias: number; normalBias: number }
  }
  /** seconds */
  rise: { delay: number; duration: number; stagger: number; hoverLift: number }
  ground: {
    size: number
    thickness: number
    topColor: string
    sideColor: string
    roadColor: string
    roadWidth: number
    dash: { length: number; gap: number; color: string }
    plotSize: number
    plotHeight: number
    treeTrunk: string
    treeColors: string[]
  }
  /** road centre lines, the same on X and Z */
  lines: number[]
  plots: { position: Vec2; color: string }[]
  /** [x, z, scale] */
  trees: Vec3[]
  cars: { loop: Loop; offset: number; speed: number; color: string }[]
  lane: number
  character: {
    walkSpeed: number
    /** seconds; long trips speed up so the character never lags far behind the scroll */
    arriveWithin: number
    stride: number
    swing: number
    jump: { height: number; duration: number }
    bubble: number
    figure: {
      scale: number
      bubbleHeight: number
      /** hip and shoulder joints; each limb's parts hang from its joint */
      legPivots: Vec3[]
      leg: Part[]
      armPivots: Vec3[]
      arm: Part[]
      body: Part[]
    }
  }
  /** a car body; parts coloured "accent" take each car's own colour */
  carParts: Part[]
  ui: { bubbleZ: Vec2; labelZ: Vec2 }
  /** soft dark disc under things that move, since they do not cast real shadows */
  blob: { character: number; car: number; segments: number; opacity: number; color: string }
  performance: {
    /** device pixels the canvas aims for; DPR drops on large screens to stay under it */
    pixelBudget: number
    /** seconds the shadow map keeps updating after a hover lift */
    settle: number
  }
  pin: { color: string; float: number; bob: number; parts: Part[] }
  props: {
    dash: Vec3
    trunk: { radius: number; height: number; segments: number }
    crown: { radius: number; y: number }
  }
  buildings: Building[]
  stops: Record<string, Stop>
}

export type ScreenElement =
  | { type: 'rect'; x: number; y: number; w: number; h: number; r?: number; fill: string }
  | { type: 'circle'; x: number; y: number; r: number; fill: string }
  | {
      type: 'text'
      x: number
      y: number
      text: string
      size: number
      weight?: number
      fill: string
      align?: CanvasTextAlign
    }
  | {
      type: 'bars'
      x: number
      y: number
      w: number
      h: number
      gap: number
      values: number[]
      fill: string
      accent: string
      accentIndex: number
      labels: string[]
      labelY: number
      labelSize: number
      labelFill: string
    }

export type ScreenId = 'reports' | 'approvals' | 'access'

export interface ScreenSpec {
  id: ScreenId
  elements: ScreenElement[]
}

export interface ScreensConfig {
  /** design size every element is laid out in */
  width: number
  height: number
  font: string
  /** app frame drawn under every screen */
  chrome: ScreenElement[]
  screens: ScreenSpec[]
}

// JSON imports widen tuples and unions; the shapes above are what the files hold.
export const city = cityRaw as unknown as CityConfig
export const screens = screensRaw as unknown as ScreensConfig
