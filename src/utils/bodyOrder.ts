import type { Category } from '@/types'

/**
 * Roughly how each category is worn on a body, top to bottom — used to lay
 * out an outfit's items the way they'd actually stack on a person (hat on
 * top, down through layers, shoes at the very bottom) instead of an
 * arbitrary selection order.
 */
const BODY_ORDER: Record<Category, number> = {
  Hats: 0,
  Scarves: 1,
  Coats: 2,
  Jackets: 3,
  Sweaters: 4,
  Hoodies: 5,
  Formal: 6,
  Shirts: 7,
  'T-Shirts': 8,
  Sportswear: 9,
  Accessories: 10,
  Belts: 11,
  Pants: 12,
  Jeans: 13,
  Shorts: 14,
  Underwear: 15,
  Socks: 16,
  Shoes: 17,
  Sneakers: 18,
  Boots: 19,
  Other: 20,
}

export function getBodyOrder(category: Category | string): number {
  return BODY_ORDER[category as Category] ?? BODY_ORDER.Other
}

export function sortByBodyOrder<T extends { category: Category | string }>(items: T[]): T[] {
  return [...items].sort((a, b) => getBodyOrder(a.category) - getBodyOrder(b.category))
}
