import { NavLink } from 'react-router-dom'
import { Home as HomeIcon, Layers, Search as SearchIcon, Settings as SettingsIcon, Shirt } from 'lucide-react'
import { classNames } from '@/utils/format'
import { ThemeToggle } from '@/components/ThemeToggle'

const links = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/wardrobe', label: 'Wardrobe', Icon: Shirt },
  { to: '/outfits', label: 'Outfits', Icon: Layers },
  { to: '/search', label: 'Search', Icon: SearchIcon },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2 text-lg font-bold">
        <Shirt className="h-5 w-5" aria-hidden="true" /> Wardrobe
      </div>
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              classNames(
                'focus-ring flex min-h-[44px] items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
              )
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <ThemeToggle />
    </aside>
  )
}
