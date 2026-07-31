import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { classNames } from '@/utils/format'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children: ReactNode
}

const variants: Record<string, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-500',
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={classNames(
        'focus-ring inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
