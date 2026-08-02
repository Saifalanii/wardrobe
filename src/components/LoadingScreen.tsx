import { useEffect, useRef, useState } from 'react'

const PARTICLE_COUNT = 14

interface Particle {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
  opacity: number
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    left: Math.round(Math.random() * 100),
    top: Math.round(Math.random() * 100),
    size: 2 + Math.round(Math.random() * 3),
    duration: 14 + Math.random() * 10,
    delay: Math.random() * -20,
    opacity: 0.05 + Math.random() * 0.05,
  }))
}

interface LoadingScreenProps {
  onDone?: () => void
  /** Set once the app has real content ready to show (e.g. auth state resolved). Defaults to true. */
  ready?: boolean
}

export function LoadingScreen({ onDone, ready = true }: LoadingScreenProps) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const particlesRef = useRef(makeParticles())
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const fineCursor =
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches

  useEffect(() => {
    const delay = reduceMotion ? 600 : 2300
    const timer = setTimeout(() => setMinTimeElapsed(true), delay)
    return () => clearTimeout(timer)
  }, [reduceMotion])

  // Only reveal the app once the choreography has played out AND real content
  // is actually ready — otherwise dismissing early exposes an in-between
  // loading state (e.g. the auth-check spinner) for a jarring split second.
  useEffect(() => {
    if (minTimeElapsed && ready) setLoaded(true)
  }, [minTimeElapsed, ready])

  useEffect(() => {
    if (!loaded) return
    const timer = setTimeout(() => onDone?.(), 750)
    return () => clearTimeout(timer)
  }, [loaded, onDone])

  useEffect(() => {
    if (!fineCursor || reduceMotion) return
    function handleMove(e: MouseEvent) {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      setParallax({
        x: (e.clientX / w - 0.5) * 10,
        y: (e.clientY / h - 0.5) * 8,
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [fineCursor, reduceMotion])

  return (
    <div
      className="wl-root fixed inset-0 z-[9999] overflow-hidden"
      style={{ minHeight: 560, backgroundColor: 'var(--wl-bg-1)' }}
    >
      <div
        className="wl-stage absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 15%, var(--wl-bg-3) 0%, var(--wl-bg-2) 45%, var(--wl-bg-1) 100%)',
        }}
      >
        {particlesRef.current.map((p) => (
          <div
            key={p.id}
            className="wl-particle absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: 'var(--wl-text-primary)',
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        <div
          className={`wl-splash absolute inset-0 flex flex-col items-center justify-center gap-7 p-6 ${
            loaded ? 'wl-loaded' : ''
          }`}
        >
          <p
            className="wl-subtitle wl-glow wl-shimmerText m-0 uppercase"
            style={{
              transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 500,
              fontSize: 'clamp(28px, 6vw, 44px)',
              letterSpacing: '0.04em',
            }}
          >
            WARDROBE
          </p>

          <div className="mt-2" style={{ width: 64, height: 46, perspective: 320 }}>
            <div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="absolute inset-0 rounded-[5px]"
                style={{ background: 'var(--wl-text-primary)', opacity: 0.14 }}
              />
              <div
                className="wl-flapLeft absolute bottom-0 left-0 top-0 rounded-l-[5px]"
                style={{
                  width: '50%',
                  background: 'var(--wl-text-primary)',
                  opacity: 0.85,
                  transformOrigin: 'left center',
                }}
              />
              <div
                className="wl-flapRight absolute bottom-0 right-0 top-0 rounded-r-[5px]"
                style={{
                  width: '50%',
                  background: 'var(--wl-text-primary)',
                  opacity: 0.6,
                  transformOrigin: 'right center',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
