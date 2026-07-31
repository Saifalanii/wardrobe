import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const initializing = useAuthStore((s) => s.initializing)

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400" />
          Loading…
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
