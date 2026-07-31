import type { ButtonHTMLAttributes } from 'react'
import { classNames } from '@/utils/format'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Chip({ active, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={classNames(
        'focus-ring inline-flex min-h-[36px] items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        active
          ? 'border-indigo-600 bg-indigo-600 text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
