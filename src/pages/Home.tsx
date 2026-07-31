import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { StatCard } from '@/components/StatCard'
import { ItemCard } from '@/components/ItemCard'

export default function Home() {
  const { items, outfits } = useWardrobeData()

  const mostWorn = useMemo(() => [...items].sort((a, b) => b.timesWorn - a.timesWorn)[0], [items])
  const recent = useMemo(() => [...items].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6), [items])
  const favoritesCount = items.filter((i) => i.favorite).length

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-2xl font-bold">Your Wardrobe</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">A quick look at your closet.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Items" value={items.length} icon="👕" />
        <StatCard label="Favorites" value={favoritesCount} icon="♥" />
        <StatCard label="Outfits" value={outfits.length} icon="🧥" />
        <StatCard label="Most Worn" value={mostWorn ? mostWorn.name : '—'} icon="🔥" />
        <StatCard label="Recently Added" value={recent.length} icon="🆕" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/add-item" className="focus-ring inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          + Add Item
        </Link>
        <Link to="/outfit-builder" className="focus-ring inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
          Build Outfit
        </Link>
        <Link to="/wardrobe" className="focus-ring inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
          View Wardrobe
        </Link>
      </div>

      {recent.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Recently added</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {recent.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
