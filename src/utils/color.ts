/** A small set of common color names to map a detected hex value to something human-readable. */
const NAMED_COLORS: { name: string; rgb: [number, number, number] }[] = [
  { name: 'Black', rgb: [0, 0, 0] },
  { name: 'White', rgb: [255, 255, 255] },
  { name: 'Gray', rgb: [128, 128, 128] },
  { name: 'Red', rgb: [220, 38, 38] },
  { name: 'Orange', rgb: [234, 88, 12] },
  { name: 'Yellow', rgb: [234, 179, 8] },
  { name: 'Green', rgb: [22, 163, 74] },
  { name: 'Teal', rgb: [13, 148, 136] },
  { name: 'Blue', rgb: [37, 99, 235] },
  { name: 'Navy', rgb: [30, 41, 82] },
  { name: 'Purple', rgb: [147, 51, 234] },
  { name: 'Pink', rgb: [236, 72, 153] },
  { name: 'Brown', rgb: [120, 72, 41] },
  { name: 'Beige', rgb: [222, 202, 173] },
  { name: 'Cream', rgb: [245, 236, 214] },
]

function nearestColorName(r: number, g: number, b: number): string {
  let best = NAMED_COLORS[0]
  let bestDist = Infinity
  for (const c of NAMED_COLORS) {
    const dist = (r - c.rgb[0]) ** 2 + (g - c.rgb[1]) ** 2 + (b - c.rgb[2]) ** 2
    if (dist < bestDist) {
      bestDist = dist
      best = c
    }
  }
  return best.name
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0')
}

/**
 * Samples an image's pixels to estimate its dominant color. If the image has
 * transparency (e.g. after background removal), transparent pixels are
 * excluded so only the actual garment contributes to the average — otherwise
 * the result would be skewed by whatever background was cut away.
 */
export async function getDominantColor(blob: Blob): Promise<{ hex: string; name: string } | null> {
  try {
    const bitmap = await createImageBitmap(blob)
    const size = 48 // downsample for speed; color averaging doesn't need full resolution
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(bitmap, 0, 0, size, size)
    const { data } = ctx.getImageData(0, 0, size, size)

    let r = 0
    let g = 0
    let b = 0
    let count = 0
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]
      if (alpha < 32) continue // skip transparent/near-transparent pixels
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count++
    }
    if (count === 0) return null

    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)

    return { hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`, name: nearestColorName(r, g, b) }
  } catch {
    return null
  }
}
