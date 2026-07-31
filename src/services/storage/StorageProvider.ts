/**
 * Facade over local image caching + cloud image storage for item photos.
 * The rest of the app talks to this interface only (via the `storageProvider`
 * singleton in `./index.ts`) — never to `ImageCache` or `CloudImageStorage`
 * directly, so the split between "fast local cache" and "cross-device source
 * of truth" stays an implementation detail.
 */
export interface StorageProvider {
  /**
   * Cache the blob locally immediately (always, for instant offline
   * availability), and best-effort start a cloud upload if online. Returns
   * once the local cache write is done and resolves with the eventual cloud
   * upload result — `remoteUrl`/`remoteId` are undefined if offline or the
   * upload failed, so callers can proceed without blocking the UI on network.
   */
  saveImage(id: string, blob: Blob): Promise<{ remoteUrl?: string; remoteId?: string }>
  /**
   * Resolve a displayable URL for an image: local cache first (fast, works
   * offline), else fetch from `remoteUrl` over the network and opportunistically
   * cache the bytes locally for next time, else null.
   */
  resolveImageUrl(id: string, remoteUrl?: string): Promise<string | null>
  /** Best-effort delete from both cache and cloud (see CloudinaryImageStorage's delete-token limitation). */
  deleteImage(id: string, remoteId?: string): Promise<void>
  /** Release any cached object URL for an id (call e.g. when an item is deleted or unmounted, to avoid leaking blob: URLs). */
  revokeImageUrl(id: string): void
  /** Upload a locally-cached-but-not-yet-synced image now (used by the offline sync queue once back online). Reads the blob from the local cache by id. */
  syncPendingImage(id: string): Promise<{ remoteUrl: string; remoteId?: string } | null>
}
