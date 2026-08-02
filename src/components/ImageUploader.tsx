import { useRef, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Pencil, Plus, Star, Trash2, TriangleAlert, Wand2 } from 'lucide-react'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { compressImage, getCroppedImage, removeImageBackground } from '@/utils/image'
import { getDominantColor } from '@/utils/color'
import type { ItemImage } from '@/types'
import { generateId } from '@/utils/id'
import { storageProvider } from '@/services/storage'

type PendingImage = ItemImage

interface ImageUploaderProps {
  images: PendingImage[]
  onChange: (images: PendingImage[]) => void
  /** Called with the photo's estimated dominant color once available (e.g. to prefill the color field). */
  onColorDetected?: (color: { hex: string; name: string }) => void
}

/** Multi-image uploader: mobile camera capture, client-side compression, crop/rotate. */
export function ImageUploader({ images, onChange, onColorDetected }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [removeBg, setRemoveBg] = useState(false)
  const [processing, setProcessing] = useState(false)
  /** Id of the existing image being re-cropped, or null when adding a brand new photo. */
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    const compressed = await compressImage(file)
    setCropSrc(URL.createObjectURL(compressed))
    if (inputRef.current) inputRef.current.value = ''
  }

  function startEdit(idx: number) {
    const img = images[idx]
    if (!img.url) return
    setEditingId(img.id)
    setCropSrc(img.url)
  }

  async function confirmCrop() {
    if (!cropSrc || !croppedArea) return
    setProcessing(true)
    try {
      let blob = await getCroppedImage(cropSrc, croppedArea, rotation)
      if (removeBg) {
        try {
          blob = await removeImageBackground(blob)
        } catch (err) {
          console.error('Background removal failed, using original photo', err)
        }
      }
      if (editingId) {
        const { remoteUrl, remoteId } = await storageProvider.saveImage(editingId, blob)
        const url = (await storageProvider.resolveImageUrl(editingId, remoteUrl)) ?? undefined
        onChange(images.map((img) => (img.id === editingId ? { ...img, url, remoteUrl, remoteId } : img)))
      } else {
        const isPrimary = images.length === 0
        const id = generateId()
        const { remoteUrl, remoteId } = await storageProvider.saveImage(id, blob)
        const url = (await storageProvider.resolveImageUrl(id, remoteUrl)) ?? undefined
        const next: PendingImage = { id, isPrimary, url, remoteUrl, remoteId }
        onChange([...images, next])
        if (isPrimary && onColorDetected) {
          getDominantColor(blob).then((color) => {
            if (color) onColorDetected(color)
          })
        }
      }
      closeCropper()
    } finally {
      setProcessing(false)
    }
  }

  function closeCropper() {
    setCropSrc(null)
    setEditingId(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCroppedArea(null)
    setRemoveBg(false)
  }

  function removeImage(idx: number) {
    const removed = images[idx]
    const next = images.filter((_, i) => i !== idx)
    if (next.length > 0 && !next.some((i) => i.isPrimary)) next[0].isPrimary = true
    onChange(next)
    if (removed) storageProvider.deleteImage(removed.id, removed.remoteId).catch(() => undefined)
  }

  function setPrimary(idx: number) {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === idx })))
  }

  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((img, idx) => (
          <div key={img.id} className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            {img.isPrimary && (
              <span className="absolute left-1 top-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] text-white">Primary</span>
            )}
            {!img.remoteUrl && (
              <span
                className="absolute right-1 top-1 flex items-center gap-0.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] text-white"
                title="Not backed up to the cloud yet — only stored on this device. Uninstalling the app or clearing site data would lose it."
              >
                <TriangleAlert className="h-2.5 w-2.5" aria-hidden="true" />
                Not backed up
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/55 p-1">
              <button
                type="button"
                className="focus-ring rounded-full p-1 text-white"
                onClick={() => startEdit(idx)}
                aria-label="Edit photo"
                title="Edit photo"
              >
                <Pencil className="h-3 w-3" aria-hidden="true" />
              </button>
              {!img.isPrimary && (
                <button
                  type="button"
                  className="focus-ring rounded-full p-1 text-white"
                  onClick={() => setPrimary(idx)}
                  aria-label="Set as primary photo"
                  title="Set as primary photo"
                >
                  <Star className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                className="focus-ring ml-auto rounded-full p-1 text-white"
                onClick={() => removeImage(idx)}
                aria-label="Remove photo"
                title="Remove photo"
              >
                <Trash2 className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
        <label className="focus-ring flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-gray-700">
          <Plus className="h-6 w-6" aria-hidden="true" />
          <span className="text-xs">Add photo</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      <Modal open={!!cropSrc} onClose={closeCropper} title={editingId ? 'Edit photo' : 'Adjust photo'}>
        {cropSrc && (
          <div>
            <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gray-900">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={(_, areaPx) => setCroppedArea(areaPx)}
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label htmlFor="zoom-range" className="text-xs text-gray-500">
                Zoom
              </label>
              <input
                id="zoom-range"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1"
              />
            </div>
            <label className="mt-3 flex min-h-[44px] cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
                className="focus-ring h-5 w-5"
              />
              <Wand2 className="h-4 w-4 text-indigo-500" aria-hidden="true" />
              Remove background
            </label>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRotation((r) => (r + 90) % 360)} disabled={processing}>
                Rotate
              </Button>
              <Button variant="secondary" onClick={closeCropper} disabled={processing}>
                Cancel
              </Button>
              <Button onClick={confirmCrop} disabled={processing}>
                {processing ? 'Processing…' : 'Use photo'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
