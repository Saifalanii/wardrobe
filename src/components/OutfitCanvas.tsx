import { useRef, useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { Shirt } from 'lucide-react'
import type { OutfitItemLayout, WardrobeItem } from '@/types'
import { clampPercent, defaultLayoutFor } from '@/utils/outfitLayout'

const ITEM_SIZE = 112

interface OutfitCanvasProps {
  items: WardrobeItem[]
  layout: Record<string, OutfitItemLayout>
  /** When true, items can be dragged around the canvas. */
  editable?: boolean
  onLayoutChange?: (itemId: string, layout: OutfitItemLayout) => void
}

/** Free-form "flat lay" canvas: each item is an independently draggable cutout instead of a fixed stack. */
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
          onLayoutChange(item.id, { x: nextX, y: nextY, z: pos.z })
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
              whileDrag={{ scale: 1.08 }}
              style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
              className={`overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md dark:border-gray-950 dark:bg-gray-900 ${
                editable ? 'cursor-grab active:cursor-grabbing' : ''
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
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
