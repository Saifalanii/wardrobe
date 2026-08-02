import type { OutfitItemLayout } from '@/types'

/** Scattered starting spots (percent of canvas) so newly added items don't all land in one place. */
const CASCADE_POSITIONS: Array<{ x: number; y: number }> = [
  { x: 50, y: 30 },
  { x: 30, y: 58 },
  { x: 70, y: 58 },
  { x: 38, y: 80 },
  { x: 62, y: 80 },
  { x: 50, y: 15 },
  { x: 20, y: 35 },
  { x: 80, y: 35 },
]

export function defaultLayoutFor(index: number): OutfitItemLayout {
  const pos = CASCADE_POSITIONS[index % CASCADE_POSITIONS.length]
  return { x: pos.x, y: pos.y, z: index, scale: 1, rotation: 0 }
}

export function clampPercent(value: number, min = 6, max = 94): number {
  return Math.min(max, Math.max(min, value))
}

export function clampScale(value: number, min = 0.4, max = 2.5): number {
  return Math.min(max, Math.max(min, value))
}

/** Wrap an angle in degrees to the (-180, 180] range. */
export function normalizeRotation(deg: number): number {
  let d = deg % 360
  if (d > 180) d -= 360
  if (d <= -180) d += 360
  return d
}
