import { useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { WardrobeItem } from '@/types'
import { ItemCard } from '@/components/ItemCard'

const COLUMN_MIN_WIDTH = 160
const ROW_HEIGHT = 240

function useColumnCount(ref: React.RefObject<HTMLDivElement>): number {
  const [columns, setColumns] = useState(2)
  useEffect(() => {
    function recompute() {
      const width = ref.current?.clientWidth ?? window.innerWidth
      setColumns(Math.max(2, Math.floor(width / COLUMN_MIN_WIDTH)))
    }
    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [ref])
  return columns
}

/** Virtualized responsive grid of item cards; only renders rows near the viewport. */
export function VirtualGrid({ items }: { items: WardrobeItem[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const columns = useColumnCount(parentRef)

  const rowCount = Math.ceil(items.length / columns)
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 4,
  })

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500 dark:text-gray-400">
        <span className="mb-2 text-4xl" aria-hidden="true">
          🧺
        </span>
        <p>No items found.</p>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-220px)] overflow-y-auto">
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIdx = virtualRow.index * columns
          const rowItems = items.slice(startIdx, startIdx + columns)
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="pb-3"
            >
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {rowItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
