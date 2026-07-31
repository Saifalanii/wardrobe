import type { StorageProvider } from './StorageProvider'
import { IndexedDBImageCache } from './IndexedDBImageCache'
import { CloudinaryImageStorage } from './CloudinaryImageStorage'
import { HybridStorageProvider } from './HybridStorageProvider'

export type { StorageProvider } from './StorageProvider'
export type { ImageCache } from './ImageCache'
export type { CloudImageStorage } from './CloudImageStorage'

/**
 * Active storage backend for item photos: IndexedDB as a local cache,
 * Cloudinary as the cross-device source of truth. This is the single import
 * point the rest of the app uses — nothing outside `src/services/storage/`
 * needs to know Cloudinary exists. If Cloudinary env vars aren't set, the
 * cloud calls fail gracefully and the app keeps working fully offline/
 * single-device via the local cache only.
 */
export const storageProvider: StorageProvider = new HybridStorageProvider(
  new IndexedDBImageCache(),
  new CloudinaryImageStorage(),
)
