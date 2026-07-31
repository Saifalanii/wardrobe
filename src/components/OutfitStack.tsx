import { Shirt } from 'lucide-react'
import type { WardrobeItem } from '@/types'
import { sortByBodyOrder } from '@/utils/bodyOrder'

/** Displays an outfit's items stacked top-to-bottom the way they'd be worn (hat down to shoes). */
export function OutfitStack({ items }: { items: WardrobeItem[] }) {
  const stacked = sortByBodyOrder(items)

  if (stacked.length === 0) {
    return (
      <div className="flex aspect-square w-40 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
        <Shirt className="h-10 w-10" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-40 flex-col items-stretch py-1">
      {stacked.map((item, i) => {
        const primary = item.images.find((im) => im.isPrimary) ?? item.images[0]
        return (
          <div
            key={item.id}
            style={{ zIndex: i, marginTop: i === 0 ? 0 : -56 }}
            className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gray-100 shadow-md dark:border-gray-950 dark:bg-gray-800"
          >
            {primary?.url ? (
              <img src={primary.url} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <Shirt className="h-6 w-6" aria-hidden="true" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
