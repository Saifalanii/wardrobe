/**
 * Pure local cache for item photo blobs, keyed by image id. Backed by
 * IndexedDB (see `IndexedDBImageCache`). This is a cache, not the source of
 * truth — the source of truth is the cloud (see `CloudImageStorage`) plus the
 * `remoteUrl` stored in Firestore.
 */
export interface ImageCache {
  get(id: string): Promise<Blob | undefined>
  put(id: string, blob: Blob): Promise<void>
  delete(id: string): Promise<void>
  /** Resolve a cached blob to a cached `blob:` object URL (or null if not cached). */
  getObjectUrl(id: string): Promise<string | null>
  /** Release any cached object URL for an id, to avoid leaking blob: URLs. */
  revokeObjectUrl(id: string): void
}
