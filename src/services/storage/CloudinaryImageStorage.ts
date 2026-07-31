import type { CloudImageStorage } from './CloudImageStorage'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

const DELETE_TOKEN_TTL_MS = 10 * 60 * 1000 // Cloudinary delete tokens are valid ~10 minutes

interface DeleteTokenEntry {
  token: string
  expiresAt: number
}

/**
 * Cloud-backed image storage using Cloudinary's unsigned upload API — safe to
 * call directly from a static, backend-less site since no API secret is
 * needed client-side.
 *
 * Limitation: unsigned uploads cannot be securely deleted from client-side JS
 * (the authenticated `destroy` endpoint requires a signature computed with
 * the API secret, which must never be embedded in the bundle). Cloudinary's
 * `return_delete_token` lets us delete an asset within ~10 minutes of
 * uploading it via a token-based endpoint; we track those tokens in memory
 * and use them opportunistically. Outside that window, `delete()` is a
 * documented no-op — it leaves an orphaned asset in the Cloudinary account,
 * which is an acceptable tradeoff for a backend-less personal app (a real
 * backend could clean these up later via a signed admin call).
 */
export class CloudinaryImageStorage implements CloudImageStorage {
  private deleteTokens = new Map<string, DeleteTokenEntry>()

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
    form.append('return_delete_token', '1')

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: form,
    })

    const json = (await res.json().catch(() => null)) as
      | { secure_url?: string; public_id?: string; delete_token?: string; error?: { message?: string } }
      | null

    if (!res.ok) {
      throw new Error(json?.error?.message ?? `Cloudinary upload failed (${res.status})`)
    }
    if (!json?.secure_url) {
      throw new Error('Cloudinary upload returned no secure_url')
    }

    if (json.public_id && json.delete_token) {
      this.deleteTokens.set(json.public_id, {
        token: json.delete_token,
        expiresAt: Date.now() + DELETE_TOKEN_TTL_MS,
      })
    }

    return { url: json.secure_url, remoteId: json.public_id }
  }

  async delete(remoteId: string): Promise<void> {
    if (!this.isConfigured()) return

    const entry = this.deleteTokens.get(remoteId)
    if (!entry || entry.expiresAt < Date.now()) {
      // Delete token unavailable/expired — documented no-op (see class docstring).
      return
    }

    try {
      await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ token: entry.token }),
      })
    } catch (err) {
      console.error('Cloudinary delete-token destroy failed', err)
    } finally {
      this.deleteTokens.delete(remoteId)
    }
  }
}
