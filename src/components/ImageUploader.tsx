import { useRef, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { compressImage, getCroppedImage } from '@/utils/image'
import type { ItemImage } from '@/types'
import { generateId } from '@/utils/id'
import { storageProvider } from '@/services/storage'

type PendingImage = ItemImage

interface ImageUploaderProps {
  images: PendingImage[]
  onChange: (images: PendingImage[]) => void
}

/** Multi-image uploader: mobile camera capture, client-side compression, crop/rotate. */
export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    const compressed = await compressImage(file)
    setPendingFile(compressed)
    setCropSrc(URL.createObjectURL(compressed))
    if (inputRef.current) inputRef.current.value = ''
  }

  async function confirmCrop() {
    if (!cropSrc || !croppedArea) return
    const blob = await getCroppedImage(cropSrc, croppedArea, rotation)
    const isPrimary = images.length === 0
    const id = generateId()
    const { remoteUrl, remoteId } = await storageProvider.saveImage(id, blob)
    const url = (await storageProvider.resolveImageUrl(id, remoteUrl)) ?? undefined
    const next: PendingImage = { id, isPrimary, url, remoteUrl, remoteId }
    onChange([...images, next])
    closeCropper()
  }

  function closeCropper() {
    setCropSrc(null)
    setPendingFile(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCroppedArea(null)
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
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            {img.isPrimary && (
              <span className="absolute left-1 top-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] text-white">Primary</span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
              {!img.isPrimary && (
                <button type="button" className="focus-ring text-[10px] text-white" onClick={() => setPrimary(idx)}>
                  Set primary
                </button>
              )}
              <button type="button" className="focus-ring ml-auto text-[10px] text-white" onClick={() => removeImage(idx)} aria-label="Remove image">
                Remove
              </button>
            </div>
          </div>
        ))}
        <label className="focus-ring flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-gray-700">
          <span className="text-2xl">+</span>
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

      <Modal open={!!cropSrc} onClose={closeCropper} title="Adjust photo">
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
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRotation((r) => (r + 90) % 360)}>
                Rotate
              </Button>
              <Button variant="secondary" onClick={closeCropper}>
                Cancel
              </Button>
              <Button onClick={confirmCrop} disabled={!pendingFile}>
                Use photo
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
