import { Suspense, lazy, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ToastHost } from '@/components/ToastHost'
import { LoadingScreen } from '@/components/LoadingScreen'
import { registerSyncListeners, flushQueue } from '@/services/syncService'

const Home = lazy(() => import('@/pages/Home'))
const Wardrobe = lazy(() => import('@/pages/Wardrobe'))
const WardrobeGrid = lazy(() => import('@/pages/WardrobeGrid'))
const ItemDetails = lazy(() => import('@/pages/ItemDetails'))
const AddEditItem = lazy(() => import('@/pages/AddEditItem'))
const OutfitBuilder = lazy(() => import('@/pages/OutfitBuilder'))
const Outfits = lazy(() => import('@/pages/Outfits'))
const OutfitDetail = lazy(() => import('@/pages/OutfitDetail'))
const Search = lazy(() => import('@/pages/Search'))
const Settings = lazy(() => import('@/pages/Settings'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400" />
        Loading…
      </div>
    </div>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <>{children}</>
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        <PageTransition>{children}</PageTransition>
      </AppLayout>
    </ProtectedRoute>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/wardrobe" element={<Protected><Wardrobe /></Protected>} />
        <Route path="/wardrobe/all" element={<Protected><WardrobeGrid /></Protected>} />
        <Route path="/item/:id" element={<Protected><ItemDetails /></Protected>} />
        <Route path="/add-item" element={<Protected><AddEditItem /></Protected>} />
        <Route path="/edit-item/:id" element={<Protected><AddEditItem /></Protected>} />
        <Route path="/outfits" element={<Protected><Outfits /></Protected>} />
        <Route path="/outfit/:id" element={<Protected><OutfitDetail /></Protected>} />
        <Route path="/outfit-builder" element={<Protected><OutfitBuilder /></Protected>} />
        <Route path="/outfit-builder/:id" element={<Protected><OutfitBuilder /></Protected>} />
        <Route path="/search" element={<Protected><Search /></Protected>} />
        <Route path="/settings" element={<Protected><Settings /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    if (navigator.onLine) flushQueue().catch(() => undefined)
    return registerSyncListeners()
  }, [])

  return (
    <HashRouter>
      <ToastHost />
      <Suspense fallback={<Loading />}>
        <AnimatedRoutes />
      </Suspense>
      {showSplash && <LoadingScreen onDone={() => setShowSplash(false)} />}
    </HashRouter>
  )
}

export default App
