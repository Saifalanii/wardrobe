import { useState } from 'react'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { filterAndSortItems } from '@/hooks/useFilteredItems'
import { VirtualGrid } from '@/components/VirtualGrid'

export default function Search() {
  const { items } = useWardrobeData()
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 200)

  const results = debounced
    ? filterAndSortItems(
        items,
        { search: debounced, categories: [], brands: [], colors: [], seasons: [], favoritesOnly: false },
        'newest',
      )
    : []

  return (
    <div className="space-y-4 py-2">
      <h1 className="text-2xl font-bold">Search</h1>
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name, brand, category, color, tags, notes…"
        aria-label="Search your wardrobe"
        className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
      />
      {debounced && <p className="text-xs text-gray-500 dark:text-gray-400">{results.length} results</p>}
      {debounced ? <VirtualGrid items={results} /> : <p className="py-16 text-center text-gray-400">Start typing to search.</p>}
    </div>
  )
}
