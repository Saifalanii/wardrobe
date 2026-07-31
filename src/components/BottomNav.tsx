import { NavLink } from 'react-router-dom'
import { Home as HomeIcon, Layers, Settings as SettingsIcon, Shirt } from 'lucide-react'
import { classNames } from '@/utils/format'

const links = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/wardrobe', label: 'Wardrobe', Icon: Shirt },
  { to: '/outfits', label: 'Outfits', Icon: Layers },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {links.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            classNames(
              'focus-ring flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-xs',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400',
            )
          }
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
