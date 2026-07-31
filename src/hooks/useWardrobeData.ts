import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useItemsStore } from '@/store/itemsStore'
import { useOutfitsStore } from '@/store/outfitsStore'

/** Loads the current user's items and outfits once and keeps stores in sync across the app. */
export function useWardrobeData() {
  const user = useAuthStore((s) => s.user)
  const items = useItemsStore((s) => s.items)
  const itemsLoaded = useItemsStore((s) => s.loaded)
  const fetchItems = useItemsStore((s) => s.fetchItems)
  const outfits = useOutfitsStore((s) => s.outfits)
  const outfitsLoaded = useOutfitsStore((s) => s.loaded)
  const fetchOutfits = useOutfitsStore((s) => s.fetchOutfits)

  useEffect(() => {
    if (!user) return
    if (!itemsLoaded) fetchItems(user.uid)
    if (!outfitsLoaded) fetchOutfits(user.uid)
  }, [user, itemsLoaded, outfitsLoaded, fetchItems, fetchOutfits])

  return { items, outfits, uid: user?.uid ?? null }
}
