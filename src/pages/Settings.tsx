import { useRef, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useItemsStore } from '@/store/itemsStore'
import { useOutfitsStore } from '@/store/outfitsStore'
import { logOut } from '@/services/authService'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Outfit, WardrobeItem } from '@/types'

export default function Settings() {
  const user = useAuthStore((s) => s.user)
  const items = useItemsStore((s) => s.items)
  const outfits = useOutfitsStore((s) => s.outfits)
  const upsertItem = useItemsStore((s) => s.upsertItem)
  const upsertOutfit = useOutfitsStore((s) => s.upsertOutfit)
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  function exportJson() {
    const data = { items, outfits, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wardrobe-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importJson(file: File) {
    if (!user) return
    let parsed: { items?: WardrobeItem[]; outfits?: Outfit[] }
    try {
      const text = await file.text()
      parsed = JSON.parse(text)
    } catch {
      setMessage('Import failed: invalid JSON file.')
      return
    }
    try {
      for (const item of parsed.items ?? []) {
        await upsertItem(user.uid, item)
      }
      for (const outfit of parsed.outfits ?? []) {
        await upsertOutfit(user.uid, outfit)
      }
      setMessage(`Imported ${parsed.items?.length ?? 0} items and ${parsed.outfits?.length ?? 0} outfits.`)
    } catch {
      setMessage('Import failed partway through — some items may not have saved. Check your connection and try again.')
    }
  }

  return (
    <div className="space-y-4 py-2">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <p className="mb-2 text-sm font-semibold">Account</p>
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        <Button variant="secondary" onClick={() => logOut()}>
          Sign out
        </Button>
      </Card>

      <Card>
        <p className="mb-2 text-sm font-semibold">Appearance</p>
        <ThemeToggle />
      </Card>

      <Card className="space-y-3">
        <p className="text-sm font-semibold">Data</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportJson}>
            Export JSON
          </Button>
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            Import JSON
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
          />
        </div>
        {message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}
      </Card>
    </div>
  )
}
