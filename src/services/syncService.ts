import { enqueueOp, getQueuedOps, removeQueuedOp, type QueuedOp } from '@/lib/syncQueue'
import { saveItem, deleteItem } from '@/services/itemsService'
import { saveOutfit, deleteOutfit } from '@/services/outfitsService'
import { storageProvider } from '@/services/storage'
import type { WardrobeItem, Outfit } from '@/types'
import { generateId } from '@/utils/id'

/** Queue a write for later if offline, otherwise return null (caller performs it directly). */
export async function queueIfOffline(op: Omit<QueuedOp, 'id' | 'createdAt'>): Promise<boolean> {
  if (navigator.onLine) return false
  await enqueueOp({ ...op, id: generateId(), createdAt: Date.now() })
  return true
}

/** Flush all queued offline operations to Firestore/Storage. Call on `online` event. */
export async function flushQueue(): Promise<void> {
  const ops = await getQueuedOps()
  for (const op of ops) {
    try {
      await applyOp(op)
      await removeQueuedOp(op.id)
    } catch (err) {
      console.error('Failed to flush queued op', op, err)
      // leave in queue for the next attempt
    }
  }
}

async function applyOp(op: QueuedOp): Promise<void> {
  switch (op.kind) {
    case 'item-upsert': {
      const item = op.payload as WardrobeItem
      // Any images that were cached locally while offline still need their
      // cloud upload; the cache already has the bytes, so we just need the id.
      const images = await Promise.all(
        item.images.map(async (img) => {
          if (img.remoteUrl) return img
          const result = await storageProvider.syncPendingImage(img.id).catch(() => null)
          return result ? { ...img, remoteUrl: result.remoteUrl, remoteId: result.remoteId } : img
        }),
      )
      await saveItem(op.uid, { ...item, images })
      return
    }
    case 'item-delete': {
      const { itemId, images } = op.payload as { itemId: string; images: { id: string; remoteId?: string }[] }
      await deleteItem(op.uid, itemId, images)
      return
    }
    case 'outfit-upsert':
      await saveOutfit(op.uid, op.payload as Outfit)
      return
    case 'outfit-delete': {
      const { outfitId } = op.payload as { outfitId: string }
      await deleteOutfit(op.uid, outfitId)
      return
    }
  }
}

export function registerSyncListeners(): () => void {
  const handler = () => {
    flushQueue().catch((err) => console.error('flushQueue failed', err))
  }
  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}
