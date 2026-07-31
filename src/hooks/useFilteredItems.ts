import { useMemo } from 'react'
import type { ItemFilters, SortOption, WardrobeItem } from '@/types'

export function filterAndSortItems(items: WardrobeItem[], filters: ItemFilters, sort: SortOption): WardrobeItem[] {
  const search = filters.search.trim().toLowerCase()

  let result = items.filter((item) => {
    if (filters.favoritesOnly && !item.favorite) return false
    if (filters.categories.length && !filters.categories.includes(item.category)) return false
    if (filters.brands.length && !filters.brands.includes(item.brand)) return false
    if (filters.colors.length && !filters.colors.includes(item.color.name)) return false
    if (filters.seasons.length && !filters.seasons.includes(item.season)) return false
    if (search) {
      const haystack = [item.name, item.brand, item.category, item.color.name, item.notes, ...item.tags]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })

  result = [...result].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return b.createdAt - a.createdAt
      case 'oldest':
        return a.createdAt - b.createdAt
      case 'alphabetical':
        return a.name.localeCompare(b.name)
      case 'mostWorn':
        return b.timesWorn - a.timesWorn
      case 'leastWorn':
        return a.timesWorn - b.timesWorn
      default:
        return 0
    }
  })

  return result
}

export function useFilteredItems(items: WardrobeItem[], filters: ItemFilters, sort: SortOption): WardrobeItem[] {
  return useMemo(() => filterAndSortItems(items, filters, sort), [items, filters, sort])
}
