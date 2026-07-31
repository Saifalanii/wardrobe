/**
 * Remote source-of-truth for item photo bytes — a durable, cross-device URL.
 * See `CloudinaryImageStorage` for the current implementation.
 */
export interface CloudImageStorage {
  upload(id: string, blob: Blob): Promise<{ url: string; remoteId?: string }>
  /** Best-effort delete. May be a no-op depending on backend limitations (see CloudinaryImageStorage). */
  delete(remoteId: string): Promise<void>
}
