import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { useItemsStore } from '@/store/itemsStore'
import { ImageGallery } from '@/components/ImageGallery'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { formatCurrency, formatDate } from '@/utils/format'
import { generateId } from '@/utils/id'

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { items, uid } = useWardrobeData()
  const removeItem = useItemsStore((s) => s.removeItem)
  const toggleFavorite = useItemsStore((s) => s.toggleFavorite)
  const incrementWorn = useItemsStore((s) => s.incrementWorn)
  const upsertItem = useItemsStore((s) => s.upsertItem)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const item = items.find((i) => i.id === id)

  if (!item) {
    return (
      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
        <p>Item not found.</p>
        <Link to="/wardrobe" className="focus-ring text-indigo-600 dark:text-indigo-400">
          Back to wardrobe
        </Link>
      </div>
    )
  }

  async function handleDelete() {
    if (!uid || !item) return
    await removeItem(uid, item.id)
    navigate('/wardrobe')
  }

  async function handleDuplicate() {
    if (!uid || !item) return
    const now = Date.now()
    await upsertItem(uid, { ...item, id: generateId(), name: `${item.name} (Copy)`, timesWorn: 0, createdAt: now, updatedAt: now })
    navigate('/wardrobe')
  }

  return (
    <div className="space-y-4 py-2">
      <button onClick={() => navigate(-1)} className="focus-ring text-sm text-gray-500 dark:text-gray-400">
        ← Back
      </button>

      <ImageGallery images={item.images} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{item.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.category} {item.brand && `· ${item.brand}`}
          </p>
        </div>
        <button
          type="button"
          className="focus-ring text-2xl"
          aria-pressed={item.favorite}
          aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => uid && toggleFavorite(uid, item.id)}
        >
          {item.favorite ? '♥' : '♡'}
        </button>
      </div>

      <Card className="grid grid-cols-2 gap-3 text-sm">
        <Info label="Color" value={item.color.name} />
        <Info label="Size" value={item.size} />
        <Info label="Season" value={item.season} />
        <Info label="Material" value={item.material || '—'} />
        <Info label="Purchase date" value={formatDate(item.purchaseDate)} />
        <Info label="Purchase price" value={item.purchasePrice != null ? formatCurrency(item.purchasePrice) : '—'} />
        <Info label="Times worn" value={String(item.timesWorn)} />
      </Card>

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.notes && <p className="text-sm text-gray-600 dark:text-gray-300">{item.notes}</p>}

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => uid && incrementWorn(uid, item.id)}>+1 Wear</Button>
        <Link to={`/edit-item/${item.id}`} className="focus-ring inline-flex min-h-[44px] items-center rounded-2xl bg-gray-100 px-4 text-sm font-medium dark:bg-gray-800">
          Edit
        </Link>
        <Button variant="secondary" onClick={handleDuplicate}>
          Duplicate
        </Button>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete item"
        message={`Are you sure you want to delete "${item.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
