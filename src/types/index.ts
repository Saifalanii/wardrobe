export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'AllSeason'

export const CATEGORIES = [
  'T-Shirts',
  'Shirts',
  'Sweaters',
  'Hoodies',
  'Jackets',
  'Coats',
  'Pants',
  'Jeans',
  'Shorts',
  'Shoes',
  'Sneakers',
  'Boots',
  'Accessories',
  'Hats',
  'Scarves',
  'Belts',
  'Socks',
  'Underwear',
  'Sportswear',
  'Formal',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export const SEASONS: Season[] = ['Spring', 'Summer', 'Fall', 'Winter', 'AllSeason']

export const OUTFIT_TAGS = [
  'Summer',
  'Winter',
  'Formal',
  'Business',
  'Casual',
  'Gym',
  'Travel',
  'DateNight',
  'Vacation',
] as const

export type OutfitTag = (typeof OUTFIT_TAGS)[number]

export interface ItemColor {
  hex: string
  name: string
}

export interface ItemImage {
  /** Key into the active StorageProvider (local cache). Persisted to Firestore. */
  id: string
  isPrimary: boolean
  /** Cloudinary secure_url — cross-device source of truth. Persisted to Firestore. */
  remoteUrl?: string
  /** Cloudinary public_id, kept for potential future signed-delete support. Persisted to Firestore. */
  remoteId?: string
  /** Resolved at runtime (object URL from cache, or remoteUrl as network fallback) via StorageProvider. Not persisted. */
  url?: string
}

export interface WardrobeItem {
  id: string
  name: string
  category: Category
  brand: string
  color: ItemColor
  size: string
  season: Season
  material: string
  purchaseDate: string | null
  purchasePrice: number | null
  favorite: boolean
  timesWorn: number
  notes: string
  tags: string[]
  images: ItemImage[]
  createdAt: number
  updatedAt: number
  /** true while a write for this item is queued for offline sync */
  pendingSync?: boolean
}

/** Free-form position of one item's cutout on an outfit's canvas, as percentages of the canvas size. */
export interface OutfitItemLayout {
  x: number
  y: number
  z: number
}

export interface Outfit {
  id: string
  name: string
  itemIds: string[]
  tags: OutfitTag[]
  favorite: boolean
  createdAt: number
  updatedAt: number
  pendingSync?: boolean
  /** Per-item canvas position, keyed by item id. Items without an entry fall back to a default layout. */
  layout?: Record<string, OutfitItemLayout>
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'mostWorn' | 'leastWorn'

export interface ItemFilters {
  search: string
  categories: string[]
  brands: string[]
  colors: string[]
  seasons: Season[]
  favoritesOnly: boolean
}

export type ThemeMode = 'light' | 'dark' | 'system'
