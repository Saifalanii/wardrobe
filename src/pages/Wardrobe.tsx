import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, LayoutGrid } from 'lucide-react'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { CategoryIcon } from '@/components/CategoryIcon'
import { CATEGORIES } from '@/types'

export default function Wardrobe() {
  const { items } = useWardrobeData()

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of items) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1)
    }
    return map
  }, [items])

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Wardrobe</h1>
        <Link to="/add-item" className="focus-ring inline-flex min-h-[44px] items-center rounded-2xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500 py-2">
          + Add
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <Link
          to="/wardrobe/all"
          className="focus-ring flex min-h-[56px] items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/60 dark:active:bg-gray-800"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
            <LayoutGrid className="h-4.5 w-4.5" />
          </span>
          <span className="flex-1 text-[15px] font-medium">View all</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{items.length}</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
        </Link>

        {CATEGORIES.map((category) => {
          const count = counts.get(category) ?? 0
          return (
            <Link
              key={category}
              to={`/wardrobe/all?category=${encodeURIComponent(category)}`}
              className="focus-ring flex min-h-[56px] items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 last:border-b-0 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/60 dark:active:bg-gray-800"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-700 dark:text-gray-300">
                <CategoryIcon category={category} className="h-6 w-6" />
              </span>
              <span className="flex-1 text-[15px]">{category}</span>
              {count > 0 && <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>}
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
