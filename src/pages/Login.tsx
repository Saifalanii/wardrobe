import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signInWithEmail, signInWithGoogle } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export default function Login() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signInWithEmail(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  async function onGoogle() {
    setError(null)
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Sign in to your Wardrobe</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring min-h-[44px] w-full rounded-2xl border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 py-2"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <Button variant="secondary" className="mt-3 w-full" onClick={onGoogle} disabled={loading}>
          Continue with Google
        </Button>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No account?{' '}
          <Link to="/signup" className="focus-ring font-medium text-indigo-600 dark:text-indigo-400">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}
