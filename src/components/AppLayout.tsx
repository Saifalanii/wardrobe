import type { ReactNode } from 'react'
import { BottomNav } from '@/components/BottomNav'
import { Sidebar } from '@/components/Sidebar'
import { InstallPrompt } from '@/components/InstallPrompt'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 md:ml-60 md:pb-4">
        <div className="mx-auto max-w-5xl px-4">{children}</div>
      </main>
      <BottomNav />
      <InstallPrompt />
    </div>
  )
}
