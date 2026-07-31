import { openDB, type IDBPDatabase } from 'idb'
import type { ImageCache } from './ImageCache'

const DB_NAME = 'wardrobe-images'
const STORE = 'images'

interface StoredImage {
  id: string
  blob: Blob
}

/** Local, per-device implementation of `ImageCache` backed by IndexedDB. */
export class IndexedDBImageCache implements ImageCache {
  private dbPromise: Promise<IDBPDatabase> | null = null
  private urlCache = new Map<string, string>()

  private getDb() {
    if (!this.dbPromise) {
      this.dbPromise = openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE)) {
            db.createObjectStore(STORE, { keyPath: 'id' })
          }
        },
      })
    }
    return this.dbPromise
  }

  async get(id: string): Promise<Blob | undefined> {
    const db = await this.getDb()
    const record = (await db.get(STORE, id)) as StoredImage | undefined
    return record?.blob
  }

  async put(id: string, blob: Blob): Promise<void> {
    const db = await this.getDb()
    const record: StoredImage = { id, blob }
    await db.put(STORE, record)
    // Invalidate any cached URL so a subsequent getObjectUrl reflects the new blob.
    this.revokeObjectUrl(id)
  }

  async getObjectUrl(id: string): Promise<string | null> {
    const cached = this.urlCache.get(id)
    if (cached) return cached

    const db = await this.getDb()
    const record = (await db.get(STORE, id)) as StoredImage | undefined
    if (!record) return null

    const url = URL.createObjectURL(record.blob)
    this.urlCache.set(id, url)
    return url
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDb()
    await db.delete(STORE, id)
    this.revokeObjectUrl(id)
  }

  revokeObjectUrl(id: string): void {
    const cached = this.urlCache.get(id)
    if (cached) {
      URL.revokeObjectURL(cached)
      this.urlCache.delete(id)
    }
  }
}
