import { useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Shirt, Sparkles } from 'lucide-react'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { useOutfitsStore } from '@/store/outfitsStore'
import { useFilteredItems } from '@/hooks/useFilteredItems'
import {
  CATEGORIES,
  OUTFIT_TAGS,
  type Category,
  type Outfit,
  type OutfitItemLayout,
  type OutfitTag,
  type WardrobeItem,
} from '@/types'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Chip } from '@/components/Chip'
import { OutfitCanvas } from '@/components/OutfitCanvas'
import { VirtualGrid } from '@/components/VirtualGrid'
import { generateId } from '@/utils/id'
import { defaultLayoutFor } from '@/utils/outfitLayout'

function emptyOutfit(): Outfit {
  const now = Date.now()
  return { id: generateId(), name: '', itemIds: [], tags: [], favorite: false, createdAt: now, updatedAt: now, layout: {} }
}

const CONFETTI_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e']

function ConfettiBurst() {
  const dots = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2
    const distance = 60 + Math.random() * 40
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    }
  })

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <div className="relative h-0 w-0">
        {dots.map((dot) => (
          <motion.span
            key={dot.id}
            className="absolute h-2 w-2 rounded-full"
            style={{ backgroundColor: dot.color, left: 0, top: 0 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: dot.x, y: dot.y, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        ))}
        <motion.span
          className="absolute -left-6 -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Check className="h-6 w-6" aria-hidden="true" />
        </motion.span>
      </div>
    </div>
  )
}

export default function OutfitBuilder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { items, outfits, uid } = useWardrobeData()
  const upsertOutfit = useOutfitsStore((s) => s.upsertOutfit)
  const reduceMotion = useReducedMotion()

  const existing = id ? outfits.find((o) => o.id === id) : undefined
  const [form, setForm] = useState<Outfit>(existing ?? emptyOutfit())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const [itemSearch, setItemSearch] = useState('')
  const [itemCategory, setItemCategory] = useState<Category | 'All'>('All')

  const selectedItems = items.filter((i) => form.itemIds.includes(i.id))
  const visibleItems = useFilteredItems(
    items,
    {
      search: itemSearch,
      categories: itemCategory === 'All' ? [] : [itemCategory],
      brands: [],
      colors: [],
      seasons: [],
      favoritesOnly: false,
    },
    'newest',
  )

  function toggleItem(itemId: string) {
    setForm((f) => {
      const layout = { ...(f.layout ?? {}) }
      if (f.itemIds.includes(itemId)) {
        delete layout[itemId]
        return { ...f, itemIds: f.itemIds.filter((i) => i !== itemId), layout }
      }
      layout[itemId] = defaultLayoutFor(f.itemIds.length)
      return { ...f, itemIds: [...f.itemIds, itemId], layout }
    })
  }

  function handleLayoutChange(itemId: string, itemLayout: OutfitItemLayout) {
    setForm((f) => ({ ...f, layout: { ...(f.layout ?? {}), [itemId]: itemLayout } }))
  }

  function toggleTag(tag: OutfitTag) {
    setForm((f) => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag] }))
  }

  function renderPickerTile(item: WardrobeItem) {
    const primary = item.images.find((im) => im.isPrimary) ?? item.images[0]
    const selected = form.itemIds.includes(item.id)
    return (
      <motion.button
        type="button"
        onClick={() => toggleItem(item.id)}
        aria-pressed={selected}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        animate={reduceMotion ? undefined : { scale: selected ? 1.03 : 1 }}
        transition={{ duration: 0.15 }}
        className={`focus-ring relative aspect-square min-w-0 overflow-hidden rounded-2xl border-2 transition-colors ${
          selected
            ? 'border-indigo-600 ring-2 ring-indigo-300 dark:ring-indigo-800'
            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
        }`}
      >
        {primary?.url ? (
          <img
            src={primary.url}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800">
            <Shirt className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
        <div className={`absolute inset-0 transition-colors ${selected ? 'bg-indigo-600/10' : 'bg-transparent'}`} />
        <AnimatePresence>
          {selected && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="absolute right-1 top-1 flex items-center justify-center rounded-full bg-indigo-600 p-1 text-white shadow"
            >
              <Check className="h-3 w-3" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    )
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
      if (!reduceMotion) {
        setCelebrate(true)
        setTimeout(() => {
          navigate(`/outfit/${form.id}`)
        }, 650)
      } else {
        navigate(`/outfit/${form.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save outfit')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 py-2">
      {createPortal(
        <AnimatePresence>{celebrate && <ConfettiBurst />}</AnimatePresence>,
        document.body,
      )}

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

        <Card>
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            <p className="text-sm font-medium">
              {selectedItems.length > 0 ? 'Your look — drag items to arrange' : 'Tap items below to start styling'}
            </p>
          </div>
          <OutfitCanvas
            items={selectedItems}
            layout={form.layout ?? {}}
            editable
            onLayoutChange={handleLayoutChange}
          />
        </Card>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Select items ({form.itemIds.length} selected)</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {visibleItems.length} of {items.length}
            </p>
          </div>
          <div className="mb-3 flex gap-2">
            <input
              type="search"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Search your items…"
              aria-label="Search items to add to outfit"
              className="focus-ring min-h-[44px] min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value as Category | 'All')}
              aria-label="Filter items by category"
              className="focus-ring min-h-[44px] rounded-2xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="All">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {visibleItems.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">No items match your search.</p>
          ) : (
            <VirtualGrid
              items={visibleItems}
              renderItem={renderPickerTile}
              columnMinWidth={100}
              rowHeight={100}
              className="h-[min(60vh,480px)] overflow-y-auto"
            />
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save outfit'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(existing ? `/outfit/${existing.id}` : '/outfits')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
