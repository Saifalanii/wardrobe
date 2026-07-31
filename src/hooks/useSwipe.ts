import { useRef, useState } from 'react'

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  dragOffset: number
}

/** Custom touch/drag swipe hook powering the item image gallery. */
export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void, threshold = 50): SwipeHandlers {
  const startX = useRef<number | null>(null)
  const dragging = useRef(false)
  const [dragOffset, setDragOffset] = useState(0)

  function start(x: number) {
    startX.current = x
    dragging.current = true
  }

  function move(x: number) {
    if (!dragging.current || startX.current === null) return
    setDragOffset(x - startX.current)
  }

  function end() {
    if (startX.current !== null) {
      if (dragOffset < -threshold) onSwipeLeft()
      else if (dragOffset > threshold) onSwipeRight()
    }
    startX.current = null
    dragging.current = false
    setDragOffset(0)
  }

  return {
    onTouchStart: (e) => start(e.touches[0].clientX),
    onTouchMove: (e) => move(e.touches[0].clientX),
    onTouchEnd: end,
    onMouseDown: (e) => start(e.clientX),
    onMouseMove: (e) => move(e.clientX),
    onMouseUp: end,
    onMouseLeave: end,
    dragOffset,
  }
}
