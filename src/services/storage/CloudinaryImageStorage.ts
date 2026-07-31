import type { CloudImageStorage } from './CloudImageStorage'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

/**
 * Cloud-backed image storage using Cloudinary's unsigned upload API — safe to
 * call directly from a static, backend-less site since no API secret is
 * needed client-side.
 *
 * Limitation: unsigned uploads cannot be deleted from client-side JS at all.
 * Cloudinary's authenticated `destroy` endpoint requires a signature computed
 * with the API secret, which must never be embedded in the bundle. An
 * earlier version of this class tried to use `return_delete_token` to allow
 * a short-lived client-side delete, but Cloudinary rejects that parameter
 * for unsigned uploads outright (the whole upload fails, not just the delete
 * capability) — so `delete()` is unconditionally a no-op here. It leaves an
 * orphaned asset in the Cloudinary account, which is an acceptable tradeoff
 * for a backend-less personal app (a real backend could clean these up later
 * via a signed admin call).
 */
export class CloudinaryImageStorage implements CloudImageStorage {
  isConfigured(): boolean {
    return Boolean(CLOUD_NAME && UPLOAD_PRESET)
  }

  async upload(_id: string, blob: Blob): Promise<{ url: string; remoteId?: string }> {
    if (!this.isConfigured()) {
      throw new Error(
        'Cloudinary is not configured (missing VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET).',
      )
    }

    const form = new FormData()
    form.append('file', blob)
    form.append('upload_preset', UPLOAD_PRESET as string)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: form,
    })

    const json = (await res.json().catch(() => null)) as
      | { secure_url?: string; public_id?: string; error?: { message?: string } }
      | null

    if (!res.ok) {
      throw new Error(json?.error?.message ?? `Cloudinary upload failed (${res.status})`)
    }
    if (!json?.secure_url) {
      throw new Error('Cloudinary upload returned no secure_url')
    }

    return { url: json.secure_url, remoteId: json.public_id }
  }

  async delete(_remoteId: string): Promise<void> {
    // Documented no-op — see class docstring.
  }
}
