import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Shirt } from 'lucide-react'
import { useWardrobeData } from '@/hooks/useWardrobeData'
import { useOutfitsStore } from '@/store/outfitsStore'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { generateId } from '@/utils/id'
import { sortByBodyOrder } from '@/utils/bodyOrder'
import type { WardrobeItem } from '@/types'

export default function OutfitDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { outfits, items, uid } = useWardrobeData()
  const removeOutfit = useOutfitsStore((s) => s.removeOutfit)
  const toggleFavorite = useOutfitsStore((s) => s.toggleFavorite)
  const upsertOutfit = useOutfitsStore((s) => s.upsertOutfit)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const outfit = outfits.find((o) => o.id === id)

  if (!outfit) {
    return (
      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
        <p>Outfit not found.</p>
        <Link to="/outfits" className="focus-ring text-indigo-600 dark:text-indigo-400">
          Back to outfits
        </Link>
      </div>
    )
  }

  const resolvedItems = sortByBodyOrder(
    outfit.itemIds
      .map((itemId) => items.find((i) => i.id === itemId))
      .filter((i): i is WardrobeItem => Boolean(i)),
  )

  async function handleDelete() {
    if (!uid || !outfit) return
    try {
      await removeOutfit(uid, outfit.id)
      navigate('/outfits')
    } catch {
      // Store already reverted the optimistic change and shown an error toast.
    }
  }

  async function handleDuplicate() {
    if (!uid || !outfit) return
    const now = Date.now()
    try {
      await upsertOutfit(uid, { ...outfit, id: generateId(), name: `${outfit.name} (Copy)`, createdAt: now, updatedAt: now })
      navigate('/outfits')
    } catch {
      // Store already reverted the optimistic change and shown an error toast.
    }
  }

  return (
    <div className="space-y-4 py-2">
      <button onClick={() => navigate('/outfits')} className="focus-ring inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
      </button>

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-bold">{outfit.name}</h1>
        <button
          type="button"
          className="focus-ring"
          aria-pressed={outfit.favorite}
          aria-label={outfit.favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => uid && toggleFavorite(uid, outfit.id).catch(() => undefined)}
        >
          <Heart className={outfit.favorite ? 'h-6 w-6 fill-red-500 text-red-500' : 'h-6 w-6 text-gray-400'} aria-hidden="true" />
        </button>
      </div>

      {outfit.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {outfit.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {resolvedItems.map((item) => {
          const primary = item.images.find((im) => im.isPrimary) ?? item.images[0]
          return (
            <Link key={item.id} to={`/item/${item.id}`} className="focus-ring block">
              <Card className="p-0">
                <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                  {primary?.url ? (
                    <img src={primary.url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Shirt className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <p className="truncate p-2 text-sm font-medium">{item.name}</p>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to={`/outfit-builder/${outfit.id}`} className="focus-ring inline-flex min-h-[44px] items-center rounded-2xl bg-gray-100 px-4 text-sm font-medium dark:bg-gray-800">
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
        title="Delete outfit"
        message={`Are you sure you want to delete "${outfit.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
