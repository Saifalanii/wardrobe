import { motion, type HTMLMotionProps } from 'framer-motion'
import { classNames } from '@/utils/format'

interface ChipProps extends HTMLMotionProps<'button'> {
  active?: boolean
}

export function Chip({ active, className, children, ...props }: ChipProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
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
    </motion.button>
  )
}
