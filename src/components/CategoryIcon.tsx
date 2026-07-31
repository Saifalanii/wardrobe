import type { Category } from '@/types'

interface CategoryIconProps {
  category: Category | 'All'
  className?: string
}

const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function TShirtIcon() {
  // short-sleeve crew tee, rounded neckline
  return (
    <path d="M8 3.5L4.3 6.8L5.8 9.8L7.7 8.4V20h8.6V8.4l1.9 1.4l1.5-3L16 3.5c-.5 1.3-1.9 2.1-4 2.1s-3.5-.8-4-2.1Z" />
  )
}

function ShirtIcon() {
  // collared button-front shirt, long straight sleeves, open V collar, buttons
  return (
    <>
      <path d="M7.3 3.4L3 7l1.8 3.4L7.7 8V21h8.6V8l2.9 2.4L21 7l-4.3-3.6l-4 3l-1.5-1l-1.5 1Z" />
      <path d="M9.7 3.6L12 6.4l2.3-2.8" />
      <path d="M12 6.4v1.2" />
      <circle cx="12" cy="10" r="0.5" />
      <circle cx="12" cy="13" r="0.5" />
      <circle cx="12" cy="16" r="0.5" />
    </>
  )
}

function SweaterIcon() {
  // boxy sweater with a raised ribbed turtleneck collar and ribbed hem
  return (
    <>
      <path d="M7.3 5.6L3.6 8.4l1.6 3l2.1-1.4V20h9.4V10l2.1 1.4l1.6-3l-3.7-2.8c-.2 1.5-1.9 2.6-4.7 2.6s-4.5-1.1-4.7-2.6Z" />
      <path d="M9 3.6v2c0 .8 1.3 1.4 3 1.4s3-.6 3-1.4v-2" />
      <path d="M8 17.3h8" />
    </>
  )
}

function HoodieIcon() {
  // hood at neckline, drawstrings, kangaroo pocket
  return (
    <>
      <path d="M9.2 4C7.2 4.6 6.5 6.6 7.4 8.4L4.3 10l1.6 2.8L7.7 11.6V20h8.6v-8.4l1.8 1.2l1.6-2.8L16.6 8.4c.9-1.8.2-3.8-1.8-4.4" />
      <path d="M9.2 4a2.9 2.9 0 0 0 5.6 0" />
      <path d="M10.6 12v3M13.4 12v3" />
      <path d="M8.7 16.5h6.6" />
    </>
  )
}

function JacketIcon() {
  // zip-front jacket, structured stand collar, center zipper, cropped length
  return (
    <>
      <path d="M9.3 3.6L4.6 6.3L6.2 9.6L7.9 8.4V19h8.2V8.4l1.7 1.2l1.6-3.3l-4.7-2.7l-2.3 2.2l-.4-1.2h-1L10.8 5.8Z" />
      <path d="M8.6 3.9L12 6.6l3.4-2.7" />
      <path d="M12 6.6V19" />
    </>
  )
}

function CoatIcon() {
  // long A-line coat with wide lapels and belt line
  return (
    <>
      <path d="M8.7 3.3L4.2 5.9l1.7 3.3L7.6 8V21.5h2.9l1.1-2l.4 2h2l1.1-2l.4 2h2.9V8l1.7 1.2l1.7-3.3l-4.5-2.6l-2.5 3.3l-1.4-1.9l-1.4 1.9Z" />
      <path d="M9.9 4.5L12 8l2.1-3.5" />
      <path d="M6.7 15h10.6" />
    </>
  )
}

function PantsIcon() {
  return (
    <>
      <path d="M8.4 3h7.2l.6 5.5l-.9 11.5h-2.3L12.3 9L11.5 20H9.1L8.4 8.5Z" />
      <path d="M8.4 3h7.2" />
    </>
  )
}

function JeansIcon() {
  return (
    <>
      <path d="M8.4 3h7.2l.6 5.5l-.9 11.5h-2.3L12.3 9L11.5 20H9.1L8.4 8.5Z" />
      <path d="M8.4 3h7.2" />
      <path d="M9.5 5.5c1 .6 1.7 1.7 1.9 3" />
    </>
  )
}

function ShortsIcon() {
  return (
    <>
      <path d="M8.4 3h7.2l.7 8l-1 3.5h-2L12.4 11l-.9 3.5h-2l-1-3.5Z" />
      <path d="M8.4 3h7.2" />
    </>
  )
}

function ShoesIcon() {
  return <path d="M4 18.5c0-1.4.6-2 1.6-2.6L9 13.8c.6-.4.9-1 .9-1.7V9.5c0-.6.5-1 1-.8c1 .3 1.6 1.2 2.6 2.3c1.4 1.6 3.2 2.3 5 2.4c1 .1 1.5.6 1.5 1.6v3.5H4Z" />
}

function SneakersIcon() {
  return (
    <>
      <path d="M4 18.3c0-1.2.6-1.8 1.6-2.3l3.6-1.8c.5-.3.8-.8.8-1.4V9.7c0-.5.5-.9 1-.6c1.1.6 1.6 1.5 2.7 2.6c1.3 1.4 3 2 4.7 2.1c1 .1 1.6.6 1.6 1.6v3H4Z" />
      <path d="M4 18.3h16M8 11.5l1.5 1.5M10 10l1.5 1.5M12 8.8l1.5 1.5" />
    </>
  )
}

function BootsIcon() {
  return (
    <>
      <path d="M8 3v8.3c0 .5-.3 1-.8 1.3L5 14.2c-.9.5-1 1.4-1 2.3v2h13.5c1 0 1.5-.5 1.5-1.4c0-1-.6-1.6-1.5-1.7c-1.7-.2-3.3-.9-4.5-2.2c-1-1-1.6-2.5-1.6-4V3Z" />
      <path d="M8 7h3.6" />
    </>
  )
}

function AccessoriesIcon() {
  // simple handbag glyph
  return (
    <>
      <path d="M5 9.5h14l-1 10.5H6Z" />
      <path d="M8.5 9.5v-2a3.5 3.5 0 0 1 7 0v2" />
    </>
  )
}

function HatsIcon() {
  return (
    <>
      <path d="M4.5 15c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5" />
      <path d="M3 15h18" />
      <path d="M3 15v1.2c0 .5.4.8.9.8h16.2c.5 0 .9-.3.9-.8V15" />
    </>
  )
}

function ScarvesIcon() {
  return (
    <path d="M4 6c2 0 2-2 4-2s2 2 4 2s2-2 4-2s2 2 4 2M6 6c0 3 2 4 2 7s-2 3-2 6c0 1.4 1 2.4 2.5 2.4S11 20.4 11 19c0-2.5-2-3-2-6.5S6 9 6 6Z" />
  )
}

function BeltsIcon() {
  return (
    <>
      <path d="M2.5 11h6.5v3H2.5z" />
      <rect x="9" y="10.2" width="5.5" height="4.6" rx="0.8" />
      <path d="M14.5 11h7v3h-7" />
      <circle cx="11.7" cy="12.5" r="0.9" />
    </>
  )
}

function SocksIcon() {
  return <path d="M9 3h5v8.5c0 1 .3 1.9 1 2.6l3.3 3.4c.6.6.3 1.5-.5 1.5H8c-1.7 0-3-1.3-3-3v-3.3c0-.4.1-.8.4-1.1L9 8.5Z" />
}

function UnderwearIcon() {
  return <path d="M4 6h16l-1 4c-.3 1.5-1.5 2.5-3 2.5c-1.6 0-2.8-1-3.3-2.5h-1.4C10.8 11.5 9.6 12.5 8 12.5c-1.5 0-2.7-1-3-2.5Z" />
}

function SportswearIcon() {
  return <path d="M9.5 3.5L8 4.8V8.3L6 7.2L4.7 10l2.8 1.7V20h9v-8.3L19.3 10L18 7.2l-2 1.1V4.8l-1.5-1.3c-.4.9-1.4 1.5-2.5 1.5s-2.1-.6-2.5-1.5Z" />
}

function FormalIcon() {
  // bow tie glyph
  return (
    <>
      <path d="M12 12L5 8v8Z" />
      <path d="M12 12l7-4v8Z" />
      <circle cx="12" cy="12" r="1.3" />
    </>
  )
}

function OtherIcon() {
  // hanger glyph
  return <path d="M12 3.5a1.5 1.5 0 1 1 1.4 2.1L12 6.8V8l7 4.4c.7.4 1 1 1 1.7c0 .8-.6 1.4-1.4 1.4H5.4C4.6 15.5 4 14.9 4 14.1c0-.7.3-1.3 1-1.7L12 8V6.8" />
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

const ICONS: Record<Category | 'All', () => JSX.Element> = {
  All: AllIcon,
  'T-Shirts': TShirtIcon,
  Shirts: ShirtIcon,
  Sweaters: SweaterIcon,
  Hoodies: HoodieIcon,
  Jackets: JacketIcon,
  Coats: CoatIcon,
  Pants: PantsIcon,
  Jeans: JeansIcon,
  Shorts: ShortsIcon,
  Shoes: ShoesIcon,
  Sneakers: SneakersIcon,
  Boots: BootsIcon,
  Accessories: AccessoriesIcon,
  Hats: HatsIcon,
  Scarves: ScarvesIcon,
  Belts: BeltsIcon,
  Socks: SocksIcon,
  Underwear: UnderwearIcon,
  Sportswear: SportswearIcon,
  Formal: FormalIcon,
  Other: OtherIcon,
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const Body = ICONS[category] ?? OtherIcon
  return (
    <svg
      viewBox={common.viewBox}
      fill={common.fill}
      stroke={common.stroke}
      strokeWidth={common.strokeWidth}
      strokeLinecap={common.strokeLinecap}
      strokeLinejoin={common.strokeLinejoin}
      className={className}
      aria-hidden="true"
    >
      <Body />
    </svg>
  )
}
