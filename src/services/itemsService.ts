import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { storageProvider } from '@/services/storage'
import type { ItemImage, WardrobeItem } from '@/types'

function itemsCol(uid: string) {
  return collection(db, 'users', uid, 'items')
}

/** Strip runtime-only fields (e.g. `url`) so only stable data is persisted. */
function toFirestoreImages(
  images: ItemImage[],
): { id: string; isPrimary: boolean; remoteUrl?: string; remoteId?: string }[] {
  return images.map(({ id, isPrimary, remoteUrl, remoteId }) => ({ id, isPrimary, remoteUrl, remoteId }))
}

export async function fetchItems(uid: string): Promise<WardrobeItem[]> {
  const snap = await getDocs(itemsCol(uid))
  const items = snap.docs.map((d) => d.data() as WardrobeItem)
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      images: await Promise.all(
        item.images.map(async (img) => ({
          ...img,
          url: (await storageProvider.resolveImageUrl(img.id, img.remoteUrl).catch(() => null)) ?? undefined,
        })),
      ),
    })),
  )
}

export async function saveItem(uid: string, item: WardrobeItem): Promise<void> {
  const payload = { ...item, images: toFirestoreImages(item.images), updatedAt: Date.now() }
  await setDoc(doc(itemsCol(uid), item.id), { ...payload, _server: serverTimestamp() }, { merge: true })
}

export async function deleteItem(
  uid: string,
  itemId: string,
  images: { id: string; remoteId?: string }[],
): Promise<void> {
  await deleteDoc(doc(itemsCol(uid), itemId))
  await Promise.all(
    images.map(({ id, remoteId }) => storageProvider.deleteImage(id, remoteId).catch(() => undefined)),
  )
}

/** Persist an image blob locally (instant) and best-effort start a cloud upload. */
export async function saveItemImage(
  id: string,
  blob: Blob,
): Promise<{ remoteUrl?: string; remoteId?: string }> {
  return storageProvider.saveImage(id, blob)
}

export async function incrementWearCount(uid: string, itemId: string, current: number): Promise<void> {
  await updateDoc(doc(itemsCol(uid), itemId), { timesWorn: current + 1, updatedAt: Date.now() })
}

export async function toggleFavoriteItem(uid: string, itemId: string, favorite: boolean): Promise<void> {
  await updateDoc(doc(itemsCol(uid), itemId), { favorite, updatedAt: Date.now() })
}
