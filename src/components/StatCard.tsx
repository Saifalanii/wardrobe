import type { ReactNode } from 'react'
import { Card } from '@/components/Card'

interface StatCardProps {
  label: string
  value: ReactNode
  icon?: string
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="flex items-center gap-3">
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl dark:bg-indigo-900/40" aria-hidden="true">
          {icon}
        </span>
      )}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </Card>
  )
}
