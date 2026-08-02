import { create } from 'zustand'
import type { WardrobeItem } from '@/types'
import * as itemsService from '@/services/itemsService'
import { queueIfOffline } from '@/services/syncService'
import { useToastStore } from '@/store/toastStore'

function toastError(message: string) {
  useToastStore.getState().push(message, 'error')
}

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
      toastError("Couldn't load your wardrobe. Check your connection and try again.")
    }
  },

  upsertItem: async (uid, item) => {
    const previous = get().items
    const existing = previous.find((i) => i.id === item.id)
    const next = existing ? previous.map((i) => (i.id === item.id ? item : i)) : [item, ...previous]
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
      set({ items: previous })
      throw err
    }
  },

  removeItem: async (uid, itemId) => {
    const previous = get().items
    const item = previous.find((i) => i.id === itemId)
    set({ items: previous.filter((i) => i.id !== itemId) })
    const images = item?.images.map((img) => ({ id: img.id, remoteId: img.remoteId })) ?? []

    const queued = await queueIfOffline({ kind: 'item-delete', uid, payload: { itemId, images } })
    if (queued) return
    try {
      await itemsService.deleteItem(uid, itemId, images)
    } catch (err) {
      console.error('deleteItem failed', err)
      set({ items: previous })
      toastError('Failed to delete item. Please try again.')
      throw err
    }
  },

  toggleFavorite: async (uid, itemId) => {
    const previous = get().items
    const item = previous.find((i) => i.id === itemId)
    if (!item) return
    const favorite = !item.favorite
    set({ items: previous.map((i) => (i.id === itemId ? { ...i, favorite } : i)) })
    try {
      await itemsService.toggleFavoriteItem(uid, itemId, favorite)
    } catch (err) {
      console.error('toggleFavoriteItem failed', err)
      set({ items: previous })
      toastError('Failed to update favorite. Please try again.')
      throw err
    }
  },

  incrementWorn: async (uid, itemId) => {
    const previous = get().items
    const item = previous.find((i) => i.id === itemId)
    if (!item) return
    const timesWorn = item.timesWorn + 1
    set({ items: previous.map((i) => (i.id === itemId ? { ...i, timesWorn } : i)) })
    try {
      await itemsService.incrementWearCount(uid, itemId, item.timesWorn)
    } catch (err) {
      console.error('incrementWearCount failed', err)
      set({ items: previous })
      toastError('Failed to update wear count. Please try again.')
      throw err
    }
  },

  reset: () => set({ items: [], loading: false, loaded: false }),
}))
