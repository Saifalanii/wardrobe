import { Heart } from 'lucide-react'
import { CATEGORIES, SEASONS, type ItemFilters } from '@/types'
import { Chip } from '@/components/Chip'
import { getCategoryBadgeClass } from '@/utils/categoryColors'

interface FilterBarProps {
  filters: ItemFilters
  onChange: (filters: ItemFilters) => void
  brands: string[]
  colors: string[]
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function FilterBar({ filters, onChange, brands, colors }: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Chip active={filters.favoritesOnly} onClick={() => onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}>
          <Heart className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Favorites
        </Chip>
        {SEASONS.map((season) => (
          <Chip
            key={season}
            active={filters.seasons.includes(season)}
            onClick={() => onChange({ ...filters, seasons: toggleValue(filters.seasons, season) as ItemFilters['seasons'] })}
          >
            {season}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = filters.categories.includes(cat)
          return (
            <Chip
              key={cat}
              active={active}
              onClick={() => onChange({ ...filters, categories: toggleValue(filters.categories, cat) })}
              className={active ? undefined : getCategoryBadgeClass(cat)}
            >
              {cat}
            </Chip>
          )
        })}
      </div>
      {brands.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => (
            <Chip key={brand} active={filters.brands.includes(brand)} onClick={() => onChange({ ...filters, brands: toggleValue(filters.brands, brand) })}>
              {brand}
            </Chip>
          ))}
        </div>
      )}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Chip key={color} active={filters.colors.includes(color)} onClick={() => onChange({ ...filters, colors: toggleValue(filters.colors, color) })}>
              {color}
            </Chip>
          ))}
        </div>
      )}
    </div>
  )
}
