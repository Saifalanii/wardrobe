import { NavLink } from 'react-router-dom'
import { classNames } from '@/utils/format'
import { ThemeToggle } from '@/components/ThemeToggle'

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/wardrobe', label: 'Wardrobe', icon: '👕' },
  { to: '/outfits', label: 'Outfits', icon: '🧥' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/stats', label: 'Statistics', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2 text-lg font-bold">
        <span aria-hidden="true">👔</span> Wardrobe
      </div>
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              classNames(
                'focus-ring flex min-h-[44px] items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
              )
            }
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <ThemeToggle />
    </aside>
  )
}
