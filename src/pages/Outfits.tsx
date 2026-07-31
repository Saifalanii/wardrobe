import { Link } from 'react-router-dom'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { Card } from '@/components/Card'

export default function Outfits() {
  const { outfits, items } = useWardrobeData()

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Outfits</h1>
        <Link to="/outfit-builder" className="focus-ring inline-flex min-h-[44px] items-center rounded-2xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500">
          + New
        </Link>
      </div>

      {outfits.length === 0 ? (
        <p className="py-16 text-center text-gray-500 dark:text-gray-400">No outfits yet. Build your first one!</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {outfits.map((outfit) => {
            const resolved = outfit.itemIds
              .map((id) => items.find((i) => i.id === id))
              .filter(Boolean)
              .slice(0, 4)
            return (
              <Link key={outfit.id} to={`/outfit/${outfit.id}`} className="focus-ring block">
                <Card>
                  <div className="mb-2 grid grid-cols-2 gap-1 overflow-hidden rounded-xl">
                    {resolved.length > 0 ? (
                      resolved.map((item) => {
                        const primary = item!.images.find((im) => im.isPrimary) ?? item!.images[0]
                        return (
                          <div key={item!.id} className="aspect-square bg-gray-100 dark:bg-gray-800">
                            {primary?.url && <img src={primary.url} alt="" className="h-full w-full object-cover" />}
                          </div>
                        )
                      })
                    ) : (
                      <div className="col-span-2 flex aspect-square items-center justify-center bg-gray-100 text-3xl dark:bg-gray-800">🧥</div>
                    )}
                  </div>
                  <p className="truncate text-sm font-semibold">
                    {outfit.favorite ? '♥ ' : ''}
                    {outfit.name}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{outfit.itemIds.length} items</p>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
