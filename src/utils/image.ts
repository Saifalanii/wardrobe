import imageCompression from 'browser-image-compression'

/** Compress an image file client-side before upload to keep Storage usage/bandwidth low. */
export async function compressImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      initialQuality: 0.82,
    })
  } catch {
    // If compression fails for any reason, fall back to the original file.
    return file
  }
}

/** Crop an image using canvas given pixel crop coordinates from react-easy-crop. */
export async function getCroppedImage(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number },
  rotation = 0,
): Promise<Blob> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.save()
  if (rotation) {
    ctx.translate(crop.width / 2, crop.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-crop.width / 2, -crop.height / 2)
  }
  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
  ctx.restore()

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to crop image'))
    }, 'image/jpeg', 0.9)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
