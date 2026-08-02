import { useRef, useState } from 'react'
import { Shirt } from 'lucide-react'
import type { OutfitItemLayout, WardrobeItem } from '@/types'
import { clampPercent, clampScale, defaultLayoutFor, normalizeRotation } from '@/utils/outfitLayout'

const ITEM_SIZE = 112
/** Pointer movement below this (px) counts as a tap (select) rather than a drag. */
const TAP_THRESHOLD = 6

interface OutfitCanvasProps {
  items: WardrobeItem[]
  layout: Record<string, OutfitItemLayout>
  /** When true, items can be dragged around and tapped to open size/rotation sliders. */
  editable?: boolean
  onLayoutChange?: (itemId: string, layout: OutfitItemLayout) => void
}

/**
 * Free-form "flat lay" canvas: each item is an independently draggable cutout. Tapping an item
 * (as opposed to dragging it) selects it and reveals size/rotation sliders below the canvas —
 * on-canvas resize/rotate handles were tried first, but small touch-drag handles nested inside a
 * larger draggable box proved unreliable to grab precisely on a touch PWA, so sliders are the
 * more robust control for this.
 */
export function OutfitCanvas({ items, layout, editable = false, onLayoutChange }: OutfitCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [frontId, setFrontId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900/40">
        <Shirt className="h-10 w-10" aria-hidden="true" />
      </div>
    )
  }

  const selectedItem = editable ? items.find((item) => item.id === selectedId) : undefined
  const selectedPos = selectedItem
    ? layout[selectedItem.id] ?? defaultLayoutFor(items.indexOf(selectedItem))
    : undefined

  function startMove(e: React.PointerEvent<HTMLDivElement>, itemId: string, pos: OutfitItemLayout) {
    e.stopPropagation()
    if (!editable || !onLayoutChange) return
    setFrontId(itemId)
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    let moved = false
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)

    const handleMove = (ev: Event) => {
      const pe = ev as PointerEvent
      const dx = pe.clientX - startX
      const dy = pe.clientY - startY
      if (Math.hypot(dx, dy) > TAP_THRESHOLD) moved = true
      const nextX = clampPercent(pos.x + (dx / rect.width) * 100)
      const nextY = clampPercent(pos.y + (dy / rect.height) * 100)
      onLayoutChange(itemId, { ...pos, x: nextX, y: nextY })
    }
    const cleanup = (ev: Event) => {
      target.releasePointerCapture((ev as PointerEvent).pointerId)
      target.removeEventListener('pointermove', handleMove)
      target.removeEventListener('pointerup', cleanup)
      target.removeEventListener('pointercancel', cleanup)
      if (!moved) setSelectedId(itemId)
    }
    target.addEventListener('pointermove', handleMove)
    target.addEventListener('pointerup', cleanup)
    target.addEventListener('pointercancel', cleanup)
  }

  return (
    <div>
      <div
        ref={canvasRef}
        onPointerDown={() => editable && setSelectedId(null)}
        className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 ${editable ? 'touch-none' : ''}`}
      >
        {items.map((item, i) => {
          const pos = layout[item.id] ?? defaultLayoutFor(i)
          const primary = item.images.find((im) => im.isPrimary) ?? item.images[0]
          const isFront = frontId === item.id
          const isSelected = selectedId === item.id

          return (
            <div
              key={item.id}
              onPointerDown={(e) => startMove(e, item.id, pos)}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.scale})`,
                zIndex: isFront ? 50 : pos.z,
                touchAction: editable ? 'none' : undefined,
              }}
              className={editable ? 'cursor-grab active:cursor-grabbing' : ''}
            >
              <div
                className={`h-full w-full overflow-hidden rounded-2xl ${
                  isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800' : ''
                }`}
              >
                {primary?.url ? (
                  <img
                    src={primary.url}
                    alt={item.name}
                    draggable={false}
                    className="pointer-events-none h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <Shirt className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedItem && selectedPos && onLayoutChange && (
        <div className="mt-3 space-y-3 rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
              Adjusting &ldquo;{selectedItem.name}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="focus-ring shrink-0 text-xs font-medium text-indigo-600 dark:text-indigo-400"
            >
              Done
            </button>
          </div>
          <label className="block text-xs text-gray-500 dark:text-gray-400">
            Size
            <input
              type="range"
              min={0.4}
              max={2.5}
              step={0.05}
              value={selectedPos.scale}
              onChange={(e) =>
                onLayoutChange(selectedItem.id, { ...selectedPos, scale: clampScale(Number(e.target.value)) })
              }
              className="mt-1 w-full accent-indigo-600"
            />
          </label>
          <label className="block text-xs text-gray-500 dark:text-gray-400">
            Rotation
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={selectedPos.rotation}
              onChange={(e) =>
                onLayoutChange(selectedItem.id, {
                  ...selectedPos,
                  rotation: normalizeRotation(Number(e.target.value)),
                })
              }
              className="mt-1 w-full accent-indigo-600"
            />
          </label>
        </div>
      )}
    </div>
  )
}
