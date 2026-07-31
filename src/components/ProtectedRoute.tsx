import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const initializing = useAuthStore((s) => s.initializing)

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="animate-pulse text-sm text-gray-500">Loading…</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
