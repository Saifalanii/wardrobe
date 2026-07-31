import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useFilteredItems } from '@/hooks/useFilteredItems'
import { FilterBar } from '@/components/FilterBar'
import { VirtualGrid } from '@/components/VirtualGrid'
import type { ItemFilters, SortOption } from '@/types'

const emptyFilters: ItemFilters = {
  search: '',
  categories: [],
  brands: [],
  colors: [],
  seasons: [],
  favoritesOnly: false,
}

const sortLabels: Record<SortOption, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  alphabetical: 'Alphabetical',
  mostWorn: 'Most worn',
  leastWorn: 'Least worn',
}

export default function Wardrobe() {
  const { items } = useWardrobeData()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ItemFilters>(emptyFilters)
  const [sort, setSort] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const debouncedSearch = useDebouncedValue(search, 250)

  const activeFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch])
  const filtered = useFilteredItems(items, activeFilters, sort)

  const brands = useMemo(() => Array.from(new Set(items.map((i) => i.brand).filter(Boolean))).sort(), [items])
  const colors = useMemo(() => Array.from(new Set(items.map((i) => i.color.name).filter(Boolean))).sort(), [items])

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Wardrobe</h1>
        <Link to="/add-item" className="focus-ring inline-flex min-h-[44px] items-center rounded-2xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500">
          + Add
        </Link>
      </div>

      <div className="flex gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search wardrobe…"
          aria-label="Search wardrobe"
          className="focus-ring min-h-[44px] min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <select
          aria-label="Sort items"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="focus-ring min-h-[44px] rounded-2xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="focus-ring min-h-[44px] rounded-2xl border border-gray-200 px-3 text-sm dark:border-gray-700"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
        >
          Filters
        </button>
      </div>

      {showFilters && <FilterBar filters={filters} onChange={setFilters} brands={brands} colors={colors} />}

      <p className="text-xs text-gray-500 dark:text-gray-400">{filtered.length} items</p>

      <VirtualGrid items={filtered} />
    </div>
  )
}
