import { useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import CarIllustration from './CarIllustration'

export default function CarCarousel({ images = [], label }) {
  const { t, isRTL } = useLang()

  const [failed, setFailed] = useState(() => new Set())
  const slides = useMemo(() => images.filter(Boolean).filter((src) => !failed.has(src)), [images, failed])
  const multiple = slides.length > 1

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: multiple,
    watchDrag: multiple,
    direction: isRTL ? 'rtl' : 'ltr',
    duration: 25,
  })

  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect).on('reInit', onSelect)
    return () => emblaApi.off('select', onSelect).off('reInit', onSelect)
  }, [emblaApi])

  useEffect(() => {
    if (!slides.length) {
      setSelected(0)
      return
    }
    setSelected((current) => Math.min(current, slides.length - 1))
  }, [slides.length])

  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, slides.length])

  if (slides.length === 0) {
    return <CarIllustration label={label} className="w-full max-md:w-42.5" />
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative aspect-3/2 w-full select-none bg-field max-md:max-w-[320px]"
    >
      <div ref={emblaRef} className="size-full overflow-hidden">
        <div
          className={`flex size-full touch-pan-y touch-pinch-zoom ${
            multiple ? 'cursor-grab' : ''
          }`}
        >
          {slides.map((src, i) => (
            <div key={src} className="min-w-0 flex-[0_0_100%]">
              <img
                src={src}
                alt={multiple ? `${label} (${i + 1}/${slides.length})` : label}
                loading="lazy"
                decoding="async"
                draggable={false}
                onError={() => setFailed((prev) => new Set(prev).add(src))}
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {multiple && (
        <>
          {[
            { side: 'start-1.5', Icon: ChevronLeft, key: 'fleet.prev', go: () => emblaApi?.scrollPrev() },
            { side: 'end-1.5', Icon: ChevronRight, key: 'fleet.next', go: () => emblaApi?.scrollNext() },
          ].map(({ side, Icon, key, go }) => (
            <button
              key={key}
              type="button"
              aria-label={t(key)}
              onClick={go}
              className={`absolute top-1/2 ${side} grid size-8 -translate-y-1/2 place-items-center bg-ink/65 text-paper transition-colors hover:bg-brand`}
            >
              <Icon className="size-5 rtl:rotate-180" aria-hidden="true" />
            </button>
          ))}

          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={t('fleet.goTo', { n: i + 1 })}
                aria-current={i === selected}
                onClick={() => emblaApi?.scrollTo(i)}
                className="p-1.5"
              >
                <span
                  className={`block h-1.5 transition-all ${
                    i === selected ? 'w-5 bg-brand' : 'w-1.5 bg-paper/70'
                  }`}
                />
              </button>
            ))}
          </div>

          <span className="sr-only" aria-live="polite">
            {t('fleet.photoOf', { current: selected + 1, total: slides.length })}
          </span>
        </>
      )}
    </div>
  )
}
