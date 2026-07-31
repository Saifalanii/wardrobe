import { Suspense, lazy, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { registerSyncListeners, flushQueue } from '@/services/syncService'

const Home = lazy(() => import('@/pages/Home'))
const Wardrobe = lazy(() => import('@/pages/Wardrobe'))
const ItemDetails = lazy(() => import('@/pages/ItemDetails'))
const AddEditItem = lazy(() => import('@/pages/AddEditItem'))
const OutfitBuilder = lazy(() => import('@/pages/OutfitBuilder'))
const Outfits = lazy(() => import('@/pages/Outfits'))
const OutfitDetail = lazy(() => import('@/pages/OutfitDetail'))
const Search = lazy(() => import('@/pages/Search'))
const Statistics = lazy(() => import('@/pages/Statistics'))
const Settings = lazy(() => import('@/pages/Settings'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="animate-pulse text-sm text-gray-500">Loading…</span>
    </div>
  )
}

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

function App() {
  useEffect(() => {
    if (navigator.onLine) flushQueue().catch(() => undefined)
    return registerSyncListeners()
  }, [])

  return (
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="/wardrobe" element={<Protected><Wardrobe /></Protected>} />
          <Route path="/item/:id" element={<Protected><ItemDetails /></Protected>} />
          <Route path="/add-item" element={<Protected><AddEditItem /></Protected>} />
          <Route path="/edit-item/:id" element={<Protected><AddEditItem /></Protected>} />
          <Route path="/outfits" element={<Protected><Outfits /></Protected>} />
          <Route path="/outfit/:id" element={<Protected><OutfitDetail /></Protected>} />
          <Route path="/outfit-builder" element={<Protected><OutfitBuilder /></Protected>} />
          <Route path="/outfit-builder/:id" element={<Protected><OutfitBuilder /></Protected>} />
          <Route path="/search" element={<Protected><Search /></Protected>} />
          <Route path="/stats" element={<Protected><Statistics /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
