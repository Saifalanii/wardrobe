import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Shirt } from 'lucide-react'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { useOutfitsStore } from '@/store/outfitsStore'
import { OUTFIT_TAGS, type Outfit, type OutfitTag } from '@/types'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Chip } from '@/components/Chip'
import { generateId } from '@/utils/id'
import { useToastStore } from '@/store/toastStore'

function emptyOutfit(): Outfit {
  const now = Date.now()
  return { id: generateId(), name: '', itemIds: [], tags: [], favorite: false, createdAt: now, updatedAt: now }
}

export default function OutfitBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { items, outfits, uid } = useWardrobeData()
  const upsertOutfit = useOutfitsStore((s) => s.upsertOutfit)

  const existing = id ? outfits.find((o) => o.id === id) : undefined
  const [form, setForm] = useState<Outfit>(existing ?? emptyOutfit())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedItems = items.filter((i) => form.itemIds.includes(i.id))

  function toggleItem(itemId: string) {
    setForm((f) => ({
      ...f,
      itemIds: f.itemIds.includes(itemId) ? f.itemIds.filter((i) => i !== itemId) : [...f.itemIds, itemId],
    }))
  }

  function toggleTag(tag: OutfitTag) {
    setForm((f) => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag] }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!uid) return
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    if (form.itemIds.length === 0) {
      setError('Select at least one item.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await upsertOutfit(uid, { ...form, updatedAt: Date.now() })
      useToastStore.getState().push(existing ? 'Outfit updated.' : 'Outfit saved.', 'success')
      navigate(`/outfit/${form.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save outfit')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 py-2">
      <h1 className="text-2xl font-bold">{existing ? 'Edit outfit' : 'Build outfit'}</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <Card className="space-y-3">
          <div>
            <label htmlFor="outfit-name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="outfit-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 py-2"
            />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-2">
              {OUTFIT_TAGS.map((tag) => (
                <Chip key={tag} active={form.tags.includes(tag)} onClick={() => toggleTag(tag)}>
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        </Card>

        {selectedItems.length > 0 && (
          <Card>
            <p className="mb-2 text-sm font-medium">Live preview</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {selectedItems.map((item) => {
                const primary = item.images.find((im) => im.isPrimary) ?? item.images[0]
                return (
                  <div key={item.id} className="aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                    {primary?.url ? (
                      <img src={primary.url} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <Shirt className="h-8 w-8" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        <div>
          <p className="mb-2 text-sm font-medium">Select items ({form.itemIds.length} selected)</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {items.map((item) => {
              const primary = item.images.find((im) => im.isPrimary) ?? item.images[0]
              const selected = form.itemIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-pressed={selected}
                  className={`focus-ring relative aspect-square overflow-hidden rounded-2xl border-2 ${
                    selected ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  {primary?.url ? (
                    <img src={primary.url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800">
                      <Shirt className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}
                  {selected && (
                    <span className="absolute right-1 top-1 flex items-center justify-center rounded-full bg-indigo-600 p-0.5 text-white">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save outfit'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
