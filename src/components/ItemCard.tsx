import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { WardrobeItem } from '@/types'

export function ItemCard({ item }: { item: WardrobeItem }) {
  const primary = item.images.find((i) => i.isPrimary) ?? item.images[0]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/item/${item.id}`}
        className="focus-ring group block overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-soft transition-transform hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900 dark:shadow-soft-dark"
        aria-label={`${item.name}, ${item.category}`}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          {primary?.url ? (
            <img
              src={primary.url}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">👕</div>
          )}
          {item.favorite && (
            <span className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-xs dark:bg-gray-900/90" aria-hidden="true">
              ♥
            </span>
          )}
          {item.pendingSync && (
            <span className="absolute left-2 top-2 rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-medium text-white" title="Pending sync">
              ⏳
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {item.category} {item.brand ? `· ${item.brand}` : ''}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
