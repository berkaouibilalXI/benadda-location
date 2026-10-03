import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import CarCard from './CarCard'

export default function Fleet({ cars, status, reload }) {
  const { t } = useLang()
  const [filter, setFilter] = useState('all')

  // Tabs come from the data: add a car with a new category and its tab appears.
  const categories = useMemo(() => ['all', ...new Set(cars.map((c) => c.category))], [cars])
  const visible = cars.filter((c) => filter === 'all' || c.category === filter)
  const labelFor = (c) => (c === 'all' ? t('fleet.all') : t(`categories.${c}`, { defaultValue: c }))

  return (
    <section id="fleet" className="py-section">
      <div className="wrap">
        <div className="mb-[34px] flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-h2">{t('fleet.title')}</h2>

          {status === 'ready' && (
            <div role="group" aria-label={t('fleet.filter')} className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = filter === c
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(c)}
                    className={`relative border-2 px-4 py-2 font-bold transition-colors ${
                      active ? 'border-brand' : 'border-edge hover:border-mute'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="fleet-tab"
                        className="absolute inset-0 bg-brand"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <span className="relative">{labelFor(c)}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {status === 'loading' && (
          <div role="status" aria-label={t('fleet.loading')}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[111px] animate-pulse border-t border-line last:border-b" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-start gap-4 border-y border-line py-8" role="alert">
            <p className="m-0 text-soft">{t('fleet.error')}</p>
            <button type="button" onClick={reload} className="btn btn-ghost">
              <RotateCw className="size-[18px]" aria-hidden="true" />
              {t('fleet.retry')}
            </button>
          </div>
        )}

        {status === 'ready' && (
          <div>
            <AnimatePresence mode="popLayout">
              {visible.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </AnimatePresence>
            {visible.length === 0 && (
              <p className="border-y border-line py-8 text-mute">{t('fleet.empty')}</p>
            )}
          </div>
        )}

        <p className="mt-5 text-sm text-mute">{t('fleet.rateNote')}</p>
      </div>
    </section>
  )
}
