import { Laptop, Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import type { ThemeMode } from '@/types'
import { classNames } from '@/utils/format'

const options: { value: ThemeMode; Icon: typeof Sun; label: string }[] = [
  { value: 'light', Icon: Sun, label: 'Light' },
  { value: 'dark', Icon: Moon, label: 'Dark' },
  { value: 'system', Icon: Laptop, label: 'System' },
]

export function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  return (
    <div role="radiogroup" aria-label="Theme" className="flex gap-1 rounded-2xl bg-gray-100 p-1 dark:bg-gray-800">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={mode === opt.value}
          onClick={() => setMode(opt.value)}
          className={classNames(
            'focus-ring flex min-h-[36px] flex-1 items-center justify-center rounded-xl text-sm transition-colors',
            mode === opt.value
              ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 dark:text-gray-400',
          )}
          aria-label={opt.label}
          title={opt.label}
        >
          <opt.Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
