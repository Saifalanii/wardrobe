import type { StorageProvider } from './StorageProvider'
import type { ImageCache } from './ImageCache'
import type { CloudImageStorage } from './CloudImageStorage'

/**
 * Composes a local `ImageCache` (fast, works offline) with a `CloudImageStorage`
 * (durable, cross-device). IndexedDB is a cache, not the source of truth —
 * the cloud + the `remoteUrl` persisted in Firestore is.
 */
export class HybridStorageProvider implements StorageProvider {
  private cache: ImageCache
  private cloud: CloudImageStorage

  constructor(cache: ImageCache, cloud: CloudImageStorage) {
    this.cache = cache
    this.cloud = cloud
  }

  async saveImage(id: string, blob: Blob): Promise<{ remoteUrl?: string; remoteId?: string }> {
    await this.cache.put(id, blob)

    if (!navigator.onLine) return {}

    // The cloud upload is the only thing that survives clearing local site data
    // (e.g. uninstalling the PWA) — a transient failure here silently leaves the
    // image cache-only, so retry a couple of times before giving up.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { url, remoteId } = await this.cloud.upload(id, blob)
        return { remoteUrl: url, remoteId }
      } catch (err) {
        console.error(`Cloud image upload failed (attempt ${attempt + 1}/3)`, err)
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)))
      }
    }
    return {}
  }

  async resolveImageUrl(id: string, remoteUrl?: string): Promise<string | null> {
    const cached = await this.cache.getObjectUrl(id).catch(() => null)
    if (cached) return cached

    if (remoteUrl && navigator.onLine) {
      try {
        const res = await fetch(remoteUrl)
        if (res.ok) {
          const blob = await res.blob()
          await this.cache.put(id, blob)
          return await this.cache.getObjectUrl(id)
        }
      } catch (err) {
        console.error('Failed to fetch remote image, falling back', err)
      }
    }

    return remoteUrl ?? null
  }

  async deleteImage(id: string, remoteId?: string): Promise<void> {
    await this.cache.delete(id).catch(() => undefined)
    if (remoteId) {
      await this.cloud.delete(remoteId).catch(() => undefined)
    }
  }

  revokeImageUrl(id: string): void {
    this.cache.revokeObjectUrl(id)
  }

  async syncPendingImage(id: string): Promise<{ remoteUrl: string; remoteId?: string } | null> {
    const blob = await this.cache.get(id)
    if (!blob) return null
    try {
      const { url, remoteId } = await this.cloud.upload(id, blob)
      return { remoteUrl: url, remoteId }
    } catch (err) {
      console.error('syncPendingImage upload failed', err)
      return null
    }
  }
}
