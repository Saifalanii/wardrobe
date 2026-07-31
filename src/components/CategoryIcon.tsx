import { HugeiconsIcon } from '@hugeicons/react'
import {
  TShirtIcon,
  LongSleeveShirtIcon,
  CardiganIcon,
  HoodieIcon,
  ShortsPantsIcon,
  RunningShoesIcon,
  ArmoredBootIcon,
  HandbagIcon,
  HatIcon,
  BeltIcon,
  SocksIcon,
  Underpants01Icon,
  BowTieIcon,
  HangerIcon,
} from '@hugeicons/core-free-icons'
import { IconJacket, IconShoe, IconShirtSport } from '@tabler/icons-react'
import type { Category } from '@/types'

interface CategoryIconProps {
  category: Category | 'All'
  className?: string
}

const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// Hand-built icons only for categories with no good match in either icon
// library (Hugeicons' free set or Tabler) — kept as simple straight-line
// shapes, which render predictably, rather than freehand curves.

function CoatsIcon() {
  return (
    <>
      <path d="M9 3L4.5 5.5l1.5 3.5L7.5 8v14h3l1-2l.5 2h2l1-2l.5 2h3V8l1.5 1l1.5-3.5L15 3l-3 4Z" />
      <path d="M9 3l3 4l3-4" />
      <path d="M6.5 15h11" />
    </>
  )
}

function PantsIcon() {
  return (
    <>
      <path d="M8 3h8l.6 6l-.9 12h-2.2L12 10l-1.5 11H8.3L7.4 9Z" />
      <path d="M8 3h8" />
    </>
  )
}

function JeansIcon() {
  return (
    <>
      <path d="M8 3h8l.6 6l-.9 12h-2.2L12 10l-1.5 11H8.3L7.4 9Z" />
      <path d="M8 3h8" />
      <path d="M9 5.5c.8.5 1.3 1.3 1.5 2.3" />
    </>
  )
}

function ScarvesIcon() {
  // a flat diagonal draped band with a simple rectangular hanging tail — straight lines only
  return (
    <>
      <path d="M5 4L18 7L17 10L4 7Z" />
      <path d="M15 8.5L18 9.2L16.5 20L14 19.3Z" />
    </>
  )
}

function AllIcon() {
  return (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </>
  )
}

/** Categories rendered with a real Hugeicons free icon (MIT rendering component, free icon set). */
const HUGEICONS: Partial<Record<Category, typeof TShirtIcon>> = {
  'T-Shirts': TShirtIcon,
  Shirts: LongSleeveShirtIcon,
  Sweaters: CardiganIcon,
  Hoodies: HoodieIcon,
  Shorts: ShortsPantsIcon,
  Sneakers: RunningShoesIcon,
  Boots: ArmoredBootIcon,
  Accessories: HandbagIcon,
  Hats: HatIcon,
  Belts: BeltIcon,
  Socks: SocksIcon,
  Underwear: Underpants01Icon,
  Formal: BowTieIcon,
  Other: HangerIcon,
}

/** Categories rendered with a real Tabler icon (no Hugeicons free-tier match existed). */
const TABLER_ICONS: Partial<Record<Category, typeof IconJacket>> = {
  Jackets: IconJacket,
  Shoes: IconShoe,
  Sportswear: IconShirtSport,
}

/** Categories with no good match in either library — hand-built, straight-line shapes. */
const CUSTOM_ICONS: Partial<Record<Category, () => React.JSX.Element>> = {
  Coats: CoatsIcon,
  Pants: PantsIcon,
  Jeans: JeansIcon,
  Scarves: ScarvesIcon,
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  if (category === 'All') {
    return (
      <svg {...common} className={className} aria-hidden="true">
        <AllIcon />
      </svg>
    )
  }

  const HugeIcon = HUGEICONS[category]
  if (HugeIcon) {
    return <HugeiconsIcon icon={HugeIcon} className={className} strokeWidth={1.8} />
  }

  const TablerIcon = TABLER_ICONS[category]
  if (TablerIcon) {
    return <TablerIcon className={className} stroke={1.8} />
  }

  const Custom = CUSTOM_ICONS[category] ?? CoatsIcon
  return (
    <svg {...common} className={className} aria-hidden="true">
      <Custom />
    </svg>
  )
}
