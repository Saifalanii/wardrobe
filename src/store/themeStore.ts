import { create } from 'zustand'
import type { ThemeMode } from '@/types'

const STORAGE_KEY = 'wardrobe-theme'

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const isDark =
    mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.classList.toggle('dark', isDark)
}

function readInitial(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  return stored ?? 'system'
}

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: readInitial(),
  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode)
    applyTheme(mode)
    set({ mode })
  },
}))

applyTheme(readInitial())

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (useThemeStore.getState().mode === 'system') applyTheme('system')
})
