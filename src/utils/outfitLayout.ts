import type { OutfitItemLayout } from '@/types'

/**
 * Default position/scale for an item that hasn't been placed yet, based on its index and the
 * outfit's total item count. Lays items out on a grid (rather than a fixed handful of scatter
 * points) so the default spread scales with how many items are in the outfit, and shrinks the
 * default size as the count grows — both to keep newly-added items from landing heavily
 * overlapped, which only a fixed small set of scatter spots couldn't avoid once a few items are
 * added.
 */
export function defaultLayoutFor(index: number, total: number): OutfitItemLayout {
  const count = Math.max(total, 1)
  const cols = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / cols)
  const col = index % cols
  const row = Math.floor(index / cols)

  const marginX = 18
  const marginY = 16
  const cellW = (100 - marginX * 2) / cols
  const cellH = (100 - marginY * 2) / rows
  const x = marginX + cellW * (col + 0.5)
  const y = marginY + cellH * (row + 0.5)

  const scale = count <= 2 ? 1 : count <= 4 ? 0.85 : count <= 6 ? 0.7 : count <= 9 ? 0.58 : 0.48

  return { x: clampPercent(x), y: clampPercent(y), z: index, scale, rotation: 0 }
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
