import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Clock, Heart, Shirt } from 'lucide-react'
import type { WardrobeItem } from '@/types'
import { getCategoryBadgeClass } from '@/utils/categoryColors'

export function ItemCard({ item }: { item: WardrobeItem }) {
  const primary = item.images.find((i) => i.isPrimary) ?? item.images[0]
  const reduceMotion = useReducedMotion()
  const hex = item.color?.hex

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      style={{ transformOrigin: 'center' }}
    >
      <Link
        to={`/item/${item.id}`}
        className="focus-ring group block overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-soft transition-shadow duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:shadow-soft-dark"
        aria-label={`${item.name}, ${item.category}`}
        style={
          hex
            ? ({
                borderBottom: `3px solid ${hex}`,
                boxShadow: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 8px 20px -12px ${hex}80`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          {primary?.url ? (
            <img
              src={primary.url}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <Shirt className="h-8 w-8" aria-hidden="true" />
            </div>
          )}
          {item.favorite && (
            <span
              className="absolute right-2 top-2 flex items-center justify-center rounded-full bg-white/90 p-1 dark:bg-gray-900/90"
              aria-hidden="true"
            >
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            </span>
          )}
          {item.pendingSync && (
            <span
              className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-medium text-white"
              title="Pending sync"
            >
              <Clock className="h-3 w-3" aria-hidden="true" />
            </span>
          )}
          {hex && (
            <span
              className="absolute bottom-2 left-2 h-3.5 w-3.5 rounded-full ring-2 ring-white/90 dark:ring-gray-900/90"
              style={{ backgroundColor: hex }}
              title={item.color.name}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="space-y-1.5 p-3">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${getCategoryBadgeClass(item.category)}`}
            >
              {item.category}
            </span>
            {item.brand && <span className="truncate text-xs text-gray-500 dark:text-gray-400">{item.brand}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
