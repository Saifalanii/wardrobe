import { useState, type KeyboardEvent } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ tags, onChange, placeholder = 'Add tag and press Enter' }: TagInputProps) {
  const [value, setValue] = useState('')

  function addTag() {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed])
    setValue('')
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !value && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 p-2 dark:border-gray-700">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove tag ${tag}`}
            className="focus-ring rounded-full"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="focus-ring min-w-[120px] flex-1 border-none bg-transparent p-1 text-sm outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addTag}
        placeholder={placeholder}
        aria-label="Add tag"
      />
    </div>
  )
}
