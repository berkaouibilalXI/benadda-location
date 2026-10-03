import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Fuel, Settings2, Sparkles, Users } from 'lucide-react'
import { useBooking } from '../context/BookingContext'
import { useLang } from '../hooks/useLang'
import CarImage from './CarImage'

const CarCard = forwardRef(function CarCard({ car }, ref) {
  const { t, fmt, name } = useLang()
  const { selectCar } = useBooking()
  const label = name(car)

  const specs = [
    car.transmission && {
      Icon: Settings2,
      text: t(`specs.transmission.${car.transmission}`, { defaultValue: car.transmission }),
    },
    car.seats && { Icon: Users, text: t('specs.seats', { count: car.seats }) },
    car.fuel && { Icon: Fuel, text: t(`specs.fuel.${car.fuel}`, { defaultValue: car.fuel }) },
    ...car.features.map((f) => ({ Icon: Sparkles, text: t(`features.${f}`, { defaultValue: f }) })),
  ].filter(Boolean)

  return (
    <motion.article
      ref={ref}
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="grid grid-cols-1 items-center gap-3 border-t border-line py-[22px] last:border-b md:grid-cols-[200px_1fr_auto] md:gap-7"
    >
      <CarImage
        car={car}
        label={label}
        className={car.image ? 'max-md:max-w-[320px]' : 'max-md:w-[170px]'}
      />

      <div>
        <h3 className="text-card">{label}</h3>
        <ul className="m-0 mt-2 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[15px] text-mute">
          {specs.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-1.5">
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="whitespace-nowrap text-start md:text-end">
        <b className="block text-price font-black stretch-112">
          {fmt.number(car.pricePerDay)} {t('common.currency')}
        </b>
        <small className="text-mute">{t('fleet.perDay')}</small>
        <br />
        {car.available ? (
          <button
            type="button"
            onClick={() => selectCar(car.id)}
            className="mt-2 inline-flex items-center gap-1.5 bg-transparent p-0 font-bold text-brand transition-colors hover:text-paper"
          >
            {t('fleet.reserve')}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </button>
        ) : (
          <span className="mt-2 inline-block font-bold text-mute">{t('fleet.booked')}</span>
        )}
      </div>
    </motion.article>
  )
})

export default CarCard
