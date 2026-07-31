import { Link } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <PackageOpen className="h-10 w-10 text-gray-400" aria-hidden="true" />
      <h1 className="text-xl font-bold">Page not found</h1>
      <Link to="/" className="focus-ring text-indigo-600 dark:text-indigo-400">
        Back home
      </Link>
    </div>
  )
}
