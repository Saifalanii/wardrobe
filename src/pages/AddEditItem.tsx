import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { useItemsStore } from '@/store/itemsStore'
import { CATEGORIES, SEASONS, type ItemImage, type WardrobeItem } from '@/types'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ImageUploader } from '@/components/ImageUploader'
import { ColorPicker } from '@/components/ColorPicker'
import { TagInput } from '@/components/TagInput'
import { generateId } from '@/utils/id'

function emptyItem(): WardrobeItem {
  const now = Date.now()
  return {
    id: generateId(),
    name: '',
    category: 'T-Shirts',
    brand: '',
    color: { hex: '#4f46e5', name: '' },
    size: '',
    season: 'AllSeason',
    material: '',
    purchaseDate: null,
    purchasePrice: null,
    favorite: false,
    timesWorn: 0,
    notes: '',
    tags: [],
    images: [],
    createdAt: now,
    updatedAt: now,
  }
}

export default function AddEditItem() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { items, uid } = useWardrobeData()
  const upsertItem = useItemsStore((s) => s.upsertItem)

  const existing = id ? items.find((i) => i.id === id) : undefined
  const [form, setForm] = useState<WardrobeItem>(existing ?? emptyItem())
  const [images, setImages] = useState<ItemImage[]>(existing?.images ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const brandOptions = useMemo(() => Array.from(new Set(items.map((i) => i.brand).filter(Boolean))), [items])

  function update<K extends keyof WardrobeItem>(key: K, value: WardrobeItem[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!uid) return
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const finalImages: ItemImage[] = images.map(({ id: imgId, isPrimary, remoteUrl, remoteId }) => ({
        id: imgId,
        isPrimary,
        remoteUrl,
        remoteId,
      }))
      const payload: WardrobeItem = { ...form, images: finalImages, updatedAt: Date.now() }
      await upsertItem(uid, payload)
      navigate(`/item/${form.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 py-2">
      <h1 className="text-2xl font-bold">{existing ? 'Edit item' : 'Add item'}</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <Card>
          <p className="mb-2 text-sm font-medium">Photos</p>
          <ImageUploader images={images} onChange={setImages} />
        </Card>

        <Card className="space-y-3">
          <Field label="Name" htmlFor="name">
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
            />
          </Field>

          <Field label="Category" htmlFor="category">
            <select
              id="category"
              value={form.category}
              onChange={(e) => update('category', e.target.value as WardrobeItem['category'])}
              className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Brand" htmlFor="brand">
            <input
              id="brand"
              list="brand-options"
              value={form.brand}
              onChange={(e) => update('brand', e.target.value)}
              className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
            />
            <datalist id="brand-options">
              {brandOptions.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </Field>

          <Field label="Color" htmlFor="color">
            <ColorPicker value={form.color} onChange={(color) => update('color', color)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Size" htmlFor="size">
              <input
                id="size"
                value={form.size}
                onChange={(e) => update('size', e.target.value)}
                className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
              />
            </Field>
            <Field label="Season" htmlFor="season">
              <select
                id="season"
                value={form.season}
                onChange={(e) => update('season', e.target.value as WardrobeItem['season'])}
                className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Material" htmlFor="material">
            <input
              id="material"
              value={form.material}
              onChange={(e) => update('material', e.target.value)}
              className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Purchase date" htmlFor="purchaseDate">
              <input
                id="purchaseDate"
                type="date"
                value={form.purchaseDate ?? ''}
                onChange={(e) => update('purchaseDate', e.target.value || null)}
                className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
              />
            </Field>
            <Field label="Purchase price" htmlFor="purchasePrice">
              <input
                id="purchasePrice"
                type="number"
                min={0}
                step="0.01"
                value={form.purchasePrice ?? ''}
                onChange={(e) => update('purchasePrice', e.target.value ? Number(e.target.value) : null)}
                className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900"
              />
            </Field>
          </div>

          <Field label="Tags" htmlFor="tags">
            <TagInput tags={form.tags} onChange={(tags) => update('tags', tags)} />
          </Field>

          <Field label="Notes" htmlFor="notes">
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className="focus-ring w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
            />
          </Field>

          <label className="flex min-h-[44px] items-center gap-2 text-sm">
            <input type="checkbox" checked={form.favorite} onChange={(e) => update('favorite', e.target.checked)} className="focus-ring h-5 w-5" />
            Mark as favorite
          </label>
        </Card>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save item'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}
