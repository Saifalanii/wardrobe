import { useRef, useState } from 'react'
import { RotateCw, Scaling, Shirt } from 'lucide-react'
import type { OutfitItemLayout, WardrobeItem } from '@/types'
import { clampPercent, clampScale, defaultLayoutFor, normalizeRotation } from '@/utils/outfitLayout'

const ITEM_SIZE = 112

interface OutfitCanvasProps {
  items: WardrobeItem[]
  layout: Record<string, OutfitItemLayout>
  /** When true, items can be dragged, resized and rotated. */
  editable?: boolean
  onLayoutChange?: (itemId: string, layout: OutfitItemLayout) => void
}

/**
 * Free-form "flat lay" canvas: each item is an independently draggable, resizable, rotatable
 * cutout, positioned via plain pointer-event handling (no framer-motion `drag`). Framer's drag
 * gesture attaches its own native pointerdown listener directly on the draggable element, which
 * fires before React's synthetic event system does — so a nested interactive handle (resize/
 * rotate) can never reliably stop it from hijacking the gesture. Handling everything manually
 * with one consistent event system avoids that class of bug entirely, and lets us clean up
 * properly on `pointercancel` (which mobile browsers fire instead of `pointerup` whenever a touch
 * gesture is interrupted — missing that left a previous version's pointer capture stuck, freezing
 * the rest of the page).
 */
export function OutfitCanvas({ items, layout, editable = false, onLayoutChange }: OutfitCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [frontId, setFrontId] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900/40">
        <Shirt className="h-10 w-10" aria-hidden="true" />
      </div>
    )
  }

  function canvasCenterOf(pos: OutfitItemLayout) {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: rect.left + (pos.x / 100) * rect.width, y: rect.top + (pos.y / 100) * rect.height, rect }
  }

  /** Track a pointer gesture on `target` via pointer capture, calling `onMove` for each move and cleaning up on release/cancel. */
  function trackPointer(target: Element, pointerId: number, onMove: (ev: PointerEvent) => void) {
    target.setPointerCapture(pointerId)
    const handleMove = (ev: Event) => onMove(ev as PointerEvent)
    const cleanup = () => {
      target.releasePointerCapture(pointerId)
      target.removeEventListener('pointermove', handleMove)
      target.removeEventListener('pointerup', cleanup)
      target.removeEventListener('pointercancel', cleanup)
    }
    target.addEventListener('pointermove', handleMove)
    target.addEventListener('pointerup', cleanup)
    target.addEventListener('pointercancel', cleanup)
  }

  function startMove(e: React.PointerEvent<HTMLDivElement>, itemId: string, pos: OutfitItemLayout) {
    if (!editable || !onLayoutChange) return
    setFrontId(itemId)
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    trackPointer(e.currentTarget, e.pointerId, (ev) => {
      const nextX = clampPercent(pos.x + ((ev.clientX - startX) / rect.width) * 100)
      const nextY = clampPercent(pos.y + ((ev.clientY - startY) / rect.height) * 100)
      onLayoutChange(itemId, { ...pos, x: nextX, y: nextY })
    })
  }

  function startResize(e: React.PointerEvent<HTMLButtonElement>, itemId: string, pos: OutfitItemLayout) {
    if (!editable || !onLayoutChange) return
    e.stopPropagation()
    setFrontId(itemId)
    const { x: centerX, y: centerY } = canvasCenterOf(pos)
    const startDist = Math.hypot(e.clientX - centerX, e.clientY - centerY) || 1
    const startScale = pos.scale
    trackPointer(e.currentTarget, e.pointerId, (ev) => {
      const dist = Math.hypot(ev.clientX - centerX, ev.clientY - centerY)
      onLayoutChange(itemId, { ...pos, scale: clampScale(startScale * (dist / startDist)) })
    })
  }

  function startRotate(e: React.PointerEvent<HTMLButtonElement>, itemId: string, pos: OutfitItemLayout) {
    if (!editable || !onLayoutChange) return
    e.stopPropagation()
    setFrontId(itemId)
    const { x: centerX, y: centerY } = canvasCenterOf(pos)
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
    const startRotation = pos.rotation
    trackPointer(e.currentTarget, e.pointerId, (ev) => {
      const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * (180 / Math.PI)
      onLayoutChange(itemId, { ...pos, rotation: normalizeRotation(startRotation + (angle - startAngle)) })
    })
  }

  return (
    <div
      ref={canvasRef}
      className="relative aspect-[4/5] w-full touch-none overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800"
    >
      {items.map((item, i) => {
        const pos = layout[item.id] ?? defaultLayoutFor(i)
        const primary = item.images.find((im) => im.isPrimary) ?? item.images[0]
        const isFront = frontId === item.id

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
            <div className="h-full w-full overflow-hidden rounded-2xl">
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

            {editable && (
              <>
                <button
                  type="button"
                  aria-label={`Rotate ${item.name}`}
                  onPointerDown={(e) => startRotate(e, item.id, pos)}
                  style={{ touchAction: 'none' }}
                  className="absolute -top-8 left-1/2 flex h-7 w-7 -translate-x-1/2 cursor-grab items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow active:cursor-grabbing dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                  <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Resize ${item.name}`}
                  onPointerDown={(e) => startResize(e, item.id, pos)}
                  style={{ touchAction: 'none' }}
                  className="absolute -bottom-3.5 -right-3.5 flex h-7 w-7 cursor-nwse-resize items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow active:cursor-nwse-resize dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                  <Scaling className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
