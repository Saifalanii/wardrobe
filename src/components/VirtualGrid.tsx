import { useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { PackageOpen } from 'lucide-react'
import type { WardrobeItem } from '@/types'
import { ItemCard } from '@/components/ItemCard'

const DEFAULT_COLUMN_MIN_WIDTH = 160
const DEFAULT_ROW_HEIGHT = 240

function useColumnCount(ref: React.RefObject<HTMLDivElement>, columnMinWidth: number): number {
  const [columns, setColumns] = useState(2)
  useEffect(() => {
    function recompute() {
      const width = ref.current?.clientWidth ?? window.innerWidth
      setColumns(Math.max(2, Math.floor(width / columnMinWidth)))
    }
    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [ref, columnMinWidth])
  return columns
}

interface VirtualGridProps {
  items: WardrobeItem[]
  /** Defaults to rendering an `ItemCard` per item. */
  renderItem?: (item: WardrobeItem) => React.ReactNode
  columnMinWidth?: number
  rowHeight?: number
  /** Classes for the scrollable container. Defaults to a full-page viewport-height scroller. */
  className?: string
  emptyState?: React.ReactNode
}

const DEFAULT_EMPTY_STATE = (
  <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500 dark:text-gray-400">
    <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-300">
      <PackageOpen className="h-8 w-8" aria-hidden="true" />
    </span>
    <p className="font-medium text-gray-700 dark:text-gray-300">Nothing here yet</p>
    <p className="mt-1 text-sm">Try a different filter, or add some clothes to your closet.</p>
  </div>
)

/** Virtualized responsive grid; only renders rows near the viewport, regardless of item count. */
export function VirtualGrid({
  items,
  renderItem = (item) => <ItemCard item={item} />,
  columnMinWidth = DEFAULT_COLUMN_MIN_WIDTH,
  rowHeight = DEFAULT_ROW_HEIGHT,
  className = 'h-[calc(100vh-220px)] overflow-y-auto',
  emptyState = DEFAULT_EMPTY_STATE,
}: VirtualGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const columns = useColumnCount(parentRef, columnMinWidth)

  const rowCount = Math.ceil(items.length / columns)
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 4,
  })

  if (items.length === 0) return <>{emptyState}</>

  return (
    <div ref={parentRef} className={className}>
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
                  <div key={item.id}>{renderItem(item)}</div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
