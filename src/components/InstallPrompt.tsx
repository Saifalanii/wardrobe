import { useState } from 'react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'
import { Button } from '@/components/Button'

export function InstallPrompt() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) return null

  return (
    <div className="fixed bottom-16 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-soft dark:border-gray-800 dark:bg-gray-900 md:bottom-4">
      <p className="mb-3 text-sm">Install Wardrobe on your device for quick, offline access.</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setDismissed(true)}>
          Not now
        </Button>
        <Button onClick={() => promptInstall()}>Install</Button>
      </div>
    </div>
  )
}
