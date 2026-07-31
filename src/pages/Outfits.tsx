import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Layers } from 'lucide-react'
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
          {outfits.map((outfit, idx) => {
            const resolved = outfit.itemIds
              .map((id) => items.find((i) => i.id === id))
              .filter(Boolean)
              .slice(0, 4)
            return (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx, 8) * 0.03 }}
              >
                <Link to={`/outfit/${outfit.id}`} className="focus-ring block">
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
                        <div className="col-span-2 flex aspect-square items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800">
                          <Layers className="h-8 w-8" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <p className="flex items-center gap-1 truncate text-sm font-semibold">
                      {outfit.favorite && <Heart className="h-3.5 w-3.5 shrink-0 fill-red-500 text-red-500" aria-hidden="true" />}
                      {outfit.name}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{outfit.itemIds.length} items</p>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
