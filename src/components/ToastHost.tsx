import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'
import { classNames } from '@/utils/format'

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+12px)] z-50 flex flex-col items-center gap-2 px-4 md:left-60"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={classNames(
              'flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-soft dark:shadow-soft-dark',
              toast.variant === 'error'
                ? 'bg-red-600 text-white'
                : toast.variant === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900',
            )}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              className="focus-ring shrink-0 rounded-full px-1 text-white/80 hover:text-white"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
