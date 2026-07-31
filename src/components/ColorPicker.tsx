import type { ItemColor } from '@/types'

interface ColorPickerProps {
  value: ItemColor
  onChange: (value: ItemColor) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="focus-ring relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-300 dark:border-gray-600">
        <input
          type="color"
          className="absolute -left-1 -top-1 h-12 w-12 cursor-pointer"
          value={value.hex}
          onChange={(e) => onChange({ ...value, hex: e.target.value })}
          aria-label="Color swatch"
        />
      </label>
      <input
        type="text"
        className="focus-ring min-h-[44px] flex-1 rounded-2xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        placeholder="Color name (e.g. Navy Blue)"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        aria-label="Color name"
      />
    </div>
  )
}
