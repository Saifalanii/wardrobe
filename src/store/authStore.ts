import { create } from 'zustand'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthState {
  user: User | null
  initializing: boolean
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user, initializing: false }),
}))

// Persist auth session across reloads via Firebase's own persistence and mirror into the store.
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user)
})
