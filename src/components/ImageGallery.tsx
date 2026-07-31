import { useState } from 'react'
import { ChevronLeft, ChevronRight, Shirt } from 'lucide-react'
import type { ItemImage } from '@/types'
import { useSwipe } from '@/hooks/useSwipe'
import { classNames } from '@/utils/format'

export function ImageGallery({ images }: { images: ItemImage[] }) {
  const [index, setIndex] = useState(0)
  const swipe = useSwipe(
    () => setIndex((i) => Math.min(i + 1, images.length - 1)),
    () => setIndex((i) => Math.max(i - 1, 0)),
  )

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
        <Shirt className="h-16 w-16" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div>
      <div
        className="relative aspect-square w-full touch-pan-y select-none overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800"
        {...swipe}
      >
        {images[index].url ? (
          <img
            src={images[index].url}
            alt={`Photo ${index + 1} of ${images.length}`}
            className="h-full w-full object-cover"
            style={{ transform: `translateX(${swipe.dragOffset}px)` }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <Shirt className="h-16 w-16" aria-hidden="true" />
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white"
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              aria-label="Previous photo"
              disabled={index === 0}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white"
              onClick={() => setIndex((i) => Math.min(i + 1, images.length - 1))}
              aria-label="Next photo"
              disabled={index === images.length - 1}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5" role="tablist" aria-label="Photo selector">
          {images.map((img, i) => (
            <button
              key={img.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`View photo ${i + 1}`}
              className={classNames('h-2 w-2 rounded-full', i === index ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600')}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
