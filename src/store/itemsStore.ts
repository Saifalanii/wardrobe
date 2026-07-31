import { create } from 'zustand'
import type { WardrobeItem } from '@/types'
import * as itemsService from '@/services/itemsService'
import { queueIfOffline } from '@/services/syncService'

interface ItemsState {
  items: WardrobeItem[]
  loading: boolean
  loaded: boolean
  fetchItems: (uid: string) => Promise<void>
  upsertItem: (uid: string, item: WardrobeItem) => Promise<void>
  removeItem: (uid: string, itemId: string) => Promise<void>
  toggleFavorite: (uid: string, itemId: string) => Promise<void>
  incrementWorn: (uid: string, itemId: string) => Promise<void>
  reset: () => void
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  loading: false,
  loaded: false,

  fetchItems: async (uid) => {
    set({ loading: true })
    try {
      const items = await itemsService.fetchItems(uid)
      set({ items, loading: false, loaded: true })
    } catch (err) {
      console.error('fetchItems failed', err)
      set({ loading: false })
    }
  },

  upsertItem: async (uid, item) => {
    const existing = get().items.find((i) => i.id === item.id)
    const next = existing ? get().items.map((i) => (i.id === item.id ? item : i)) : [item, ...get().items]
    set({ items: next })

    const queued = await queueIfOffline({ kind: 'item-upsert', uid, payload: item })
    if (queued) {
      set({ items: get().items.map((i) => (i.id === item.id ? { ...i, pendingSync: true } : i)) })
      return
    }
    try {
      await itemsService.saveItem(uid, item)
    } catch (err) {
      console.error('saveItem failed', err)
    }
  },

  removeItem: async (uid, itemId) => {
    const item = get().items.find((i) => i.id === itemId)
    set({ items: get().items.filter((i) => i.id !== itemId) })
    const images = item?.images.map((img) => ({ id: img.id, remoteId: img.remoteId })) ?? []

    const queued = await queueIfOffline({ kind: 'item-delete', uid, payload: { itemId, images } })
    if (queued) return
    try {
      await itemsService.deleteItem(uid, itemId, images)
    } catch (err) {
      console.error('deleteItem failed', err)
    }
  },

  toggleFavorite: async (uid, itemId) => {
    const item = get().items.find((i) => i.id === itemId)
    if (!item) return
    const favorite = !item.favorite
    set({ items: get().items.map((i) => (i.id === itemId ? { ...i, favorite } : i)) })
    try {
      await itemsService.toggleFavoriteItem(uid, itemId, favorite)
    } catch (err) {
      console.error('toggleFavoriteItem failed', err)
    }
  },

  incrementWorn: async (uid, itemId) => {
    const item = get().items.find((i) => i.id === itemId)
    if (!item) return
    const timesWorn = item.timesWorn + 1
    set({ items: get().items.map((i) => (i.id === itemId ? { ...i, timesWorn } : i)) })
    try {
      await itemsService.incrementWearCount(uid, itemId, item.timesWorn)
    } catch (err) {
      console.error('incrementWearCount failed', err)
    }
  },

  reset: () => set({ items: [], loading: false, loaded: false }),
}))
