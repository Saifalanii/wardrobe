import { create } from 'zustand'
import type { Outfit } from '@/types'
import * as outfitsService from '@/services/outfitsService'
import { queueIfOffline } from '@/services/syncService'

interface OutfitsState {
  outfits: Outfit[]
  loading: boolean
  loaded: boolean
  fetchOutfits: (uid: string) => Promise<void>
  upsertOutfit: (uid: string, outfit: Outfit) => Promise<void>
  removeOutfit: (uid: string, outfitId: string) => Promise<void>
  toggleFavorite: (uid: string, outfitId: string) => Promise<void>
  reset: () => void
}

export const useOutfitsStore = create<OutfitsState>((set, get) => ({
  outfits: [],
  loading: false,
  loaded: false,

  fetchOutfits: async (uid) => {
    set({ loading: true })
    try {
      const outfits = await outfitsService.fetchOutfits(uid)
      set({ outfits, loading: false, loaded: true })
    } catch (err) {
      console.error('fetchOutfits failed', err)
      set({ loading: false })
    }
  },

  upsertOutfit: async (uid, outfit) => {
    const existing = get().outfits.find((o) => o.id === outfit.id)
    const next = existing ? get().outfits.map((o) => (o.id === outfit.id ? outfit : o)) : [outfit, ...get().outfits]
    set({ outfits: next })

    const queued = await queueIfOffline({ kind: 'outfit-upsert', uid, payload: outfit })
    if (queued) {
      set({ outfits: get().outfits.map((o) => (o.id === outfit.id ? { ...o, pendingSync: true } : o)) })
      return
    }
    try {
      await outfitsService.saveOutfit(uid, outfit)
    } catch (err) {
      console.error('saveOutfit failed', err)
    }
  },

  removeOutfit: async (uid, outfitId) => {
    set({ outfits: get().outfits.filter((o) => o.id !== outfitId) })
    const queued = await queueIfOffline({ kind: 'outfit-delete', uid, payload: { outfitId } })
    if (queued) return
    try {
      await outfitsService.deleteOutfit(uid, outfitId)
    } catch (err) {
      console.error('deleteOutfit failed', err)
    }
  },

  toggleFavorite: async (uid, outfitId) => {
    const outfit = get().outfits.find((o) => o.id === outfitId)
    if (!outfit) return
    const favorite = !outfit.favorite
    set({ outfits: get().outfits.map((o) => (o.id === outfitId ? { ...o, favorite } : o)) })
    try {
      await outfitsService.toggleFavoriteOutfit(uid, outfitId, favorite)
    } catch (err) {
      console.error('toggleFavoriteOutfit failed', err)
    }
  },

  reset: () => set({ outfits: [], loading: false, loaded: false }),
}))
