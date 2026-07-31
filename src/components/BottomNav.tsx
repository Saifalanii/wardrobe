import { NavLink } from 'react-router-dom'
import { classNames } from '@/utils/format'

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/wardrobe', label: 'Wardrobe', icon: '👕' },
  { to: '/outfits', label: 'Outfits', icon: '🧥' },
  { to: '/stats', label: 'Stats', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            classNames(
              'focus-ring flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-xs',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400',
            )
          }
        >
          <span aria-hidden="true" className="text-lg">
            {link.icon}
          </span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
