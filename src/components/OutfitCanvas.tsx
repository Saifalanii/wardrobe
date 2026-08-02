import { useRef, useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'
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

/** Free-form "flat lay" canvas: each item is an independently draggable, resizable, rotatable cutout. */
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

  function startResize(e: React.PointerEvent<HTMLButtonElement>, itemId: string, pos: OutfitItemLayout) {
    if (!onLayoutChange) return
    e.stopPropagation()
    e.preventDefault()
    setFrontId(itemId)
    const { x: centerX, y: centerY } = canvasCenterOf(pos)
    const startDist = Math.hypot(e.clientX - centerX, e.clientY - centerY) || 1
    const startScale = pos.scale
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)

    const onMove = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - centerX, ev.clientY - centerY)
      onLayoutChange(itemId, { ...pos, scale: clampScale(startScale * (dist / startDist)) })
    }
    const onUp = (ev: PointerEvent) => {
      target.releasePointerCapture(ev.pointerId)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerup', onUp)
    }
    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerup', onUp)
  }

  function startRotate(e: React.PointerEvent<HTMLButtonElement>, itemId: string, pos: OutfitItemLayout) {
    if (!onLayoutChange) return
    e.stopPropagation()
    e.preventDefault()
    setFrontId(itemId)
    const { x: centerX, y: centerY } = canvasCenterOf(pos)
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
    const startRotation = pos.rotation
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)

    const onMove = (ev: PointerEvent) => {
      const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * (180 / Math.PI)
      onLayoutChange(itemId, { ...pos, rotation: normalizeRotation(startRotation + (angle - startAngle)) })
    }
    const onUp = (ev: PointerEvent) => {
      target.releasePointerCapture(ev.pointerId)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerup', onUp)
    }
    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerup', onUp)
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

        function handleDragEnd(_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
          const canvas = canvasRef.current
          if (!canvas || !onLayoutChange) return
          const rect = canvas.getBoundingClientRect()
          const nextX = clampPercent(pos.x + (info.offset.x / rect.width) * 100)
          const nextY = clampPercent(pos.y + (info.offset.y / rect.height) * 100)
          onLayoutChange(item.id, { ...pos, x: nextX, y: nextY })
        }

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isFront ? 50 : pos.z,
            }}
          >
            <motion.div
              key={`${pos.x.toFixed(2)}-${pos.y.toFixed(2)}`}
              drag={editable}
              dragMomentum={false}
              dragElastic={0.05}
              dragConstraints={canvasRef}
              onDragStart={() => setFrontId(item.id)}
              onDragEnd={handleDragEnd}
              style={{ width: ITEM_SIZE, height: ITEM_SIZE, rotate: pos.rotation, scale: pos.scale }}
              className={`relative ${editable ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-md dark:bg-gray-900">
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
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
