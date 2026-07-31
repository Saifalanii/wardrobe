import type { HTMLAttributes, ReactNode } from 'react'
import { classNames } from '@/utils/format'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={classNames(
        'rounded-2xl border border-gray-200/70 bg-white p-4 shadow-soft dark:border-gray-800 dark:bg-gray-900 dark:shadow-soft-dark',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
