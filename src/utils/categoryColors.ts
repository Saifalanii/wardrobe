import type { Category } from '@/types'

/**
 * Maps each category to a logical group and a Tailwind badge color pair.
 * Grouping is by garment "family" (tops, bottoms, outerwear, footwear,
 * accessories, other) so the wardrobe grid reads as visually organized
 * even before you look at photos.
 */
const CATEGORY_BADGE: Record<Category, string> = {
  // Tops — sky/blue family
  'T-Shirts': 'bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  Shirts: 'bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  Sweaters: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Hoodies: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',

  // Outerwear — violet/purple family
  Jackets: 'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  Coats: 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',

  // Bottoms — amber/orange family
  Pants: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Jeans: 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Shorts: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',

  // Footwear — emerald/teal family
  Shoes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Sneakers: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  Boots: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',

  // Accessories — pink/rose family
  Accessories: 'bg-pink-50 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Hats: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Scarves: 'bg-pink-50 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Belts: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',

  // Basics — gray/slate family
  Socks: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Underwear: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',

  // Special-purpose — cyan/red family
  Sportswear: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  Formal: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300',

  Other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
}

export function getCategoryBadgeClass(category: Category | string): string {
  return CATEGORY_BADGE[category as Category] ?? CATEGORY_BADGE.Other
}
