import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, MessageCircle, Send } from 'lucide-react'
import { site } from '../config/site'
import { useBooking } from '../context/BookingContext'
import { useLang } from '../hooks/useLang'
import { getLanguage } from '../i18n'
import { addDays, parseISO, todayISO } from '../utils/dates'
import { localize, makeFormatters } from '../utils/format'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp'
import CarImage from './CarImage'

function Field({ label, className = '', children }) {
  return (
    <label className={`grid gap-1.5 text-[15px] font-semibold ${className}`}>
      {label}
      {children}
    </label>
  )
}

export default function Reserve({ cars }) {
  const { t, code, fmt, name } = useLang()
  const { i18n } = useTranslation()
  const { form, setField, car } = useBooking()

  const msgLang = site.whatsappLanguage || code
  const tMsg = useMemo(() => i18n.getFixedT(msgLang), [i18n, msgLang, code])
  const fMsg = useMemo(() => makeFormatters(msgLang), [msgLang])

  const days = Math.min(Math.max(parseInt(form.days, 10) || 0, 0), site.maxDays)
  const start = parseISO(form.startDate)
  const end = start && days ? addDays(start, days) : null
  const total = car && days ? car.pricePerDay * days : 0
  const currency = t('common.currency')

  const lines = useMemo(
    () =>
      buildWhatsAppMessage(tMsg, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        carName: car ? localize(car.name, msgLang) : '',
        days: days || '',
        from: start ? fMsg.date(start) : '',
        to: end ? fMsg.date(end) : '',
        total: total ? `${fMsg.number(total)} ${tMsg('common.currency')}` : '',
        notes: form.notes,
      }),
    [tMsg, fMsg, msgLang, form.name, form.phone, form.notes, car, days, form.startDate, total],
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (!car || !days) return
    window.open(buildWhatsAppUrl(site.whatsappNumber, lines), '_blank', 'noopener')
  }

  return (
    <section id="reserve" className="py-section">
      <div className="wrap">
        <div className="mb-[34px]">
          <h2 className="text-h2">{t('reserve.title')}</h2>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form onSubmit={onSubmit} className="grid max-w-[760px] gap-4 md:grid-cols-2">
            <Field label={t('reserve.name')}>
              <input
                name="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
            </Field>
            <Field label={t('reserve.phone')}>
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                dir="ltr"
                className="text-start"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
              />
            </Field>
            <Field label={t('reserve.car')}>
              <select
                name="car"
                value={car?.id ?? ''}
                onChange={(e) => setField('carId', e.target.value)}
                disabled={!car}
              >
                {cars.map((c) => (
                  <option key={c.id} value={c.id} disabled={!c.available}>
                    {name(c)} - {fmt.number(c.pricePerDay)} {currency}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('reserve.days')}>
              <input
                name="days"
                type="number"
                inputMode="numeric"
                min="1"
                max={site.maxDays}
                required
                value={form.days}
                onChange={(e) => setField('days', e.target.value)}
              />
            </Field>
            <Field label={t('reserve.pickup')}>
              <input
                name="start"
                type="date"
                required
                min={todayISO()}
                value={form.startDate}
                onChange={(e) => setField('startDate', e.target.value)}
              />
            </Field>
            <Field label={t('reserve.notes')}>
              <input
                name="notes"
                placeholder={t('reserve.notesPlaceholder')}
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
              />
            </Field>

            <div className="md:col-span-2">
              <button type="submit" className="btn" disabled={!car}>
                <Send className="size-[18px] rtl:-scale-x-100" aria-hidden="true" />
                {t('reserve.submit')}
              </button>
              {!car && <p className="mb-0 mt-3 text-mute">{t('reserve.noCars')}</p>}
            </div>
          </form>

          <aside
            aria-live="polite"
            className="border border-line p-5 lg:sticky lg:top-[88px]"
          >
            <h3 className="mb-4 flex items-center gap-2 text-step">
              <MessageCircle className="size-5 text-brand" aria-hidden="true" />
              {t('reserve.previewTitle')}
            </h3>

            {car && (
              <div className="mb-4 flex items-center gap-4 border-b border-line pb-4">
                <div className="w-24 shrink-0">
                  <CarImage car={car} label={name(car)} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold">{name(car)}</div>
                  {days > 0 && (
                    <div className="text-sm text-mute">
                      {t('reserve.rate', { price: fmt.number(car.pricePerDay), currency, count: days })}
                    </div>
                  )}
                  {end && (
                    <div className="mt-0.5 flex items-center gap-1.5 text-sm text-mute">
                      <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
                      {t('reserve.returnOn')} {fmt.date(end)}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4 flex items-baseline justify-between gap-3">
              <span className="text-[15px] text-mute">{t('reserve.total')}</span>
              <div className="relative h-7.25 overflow-hidden text-end">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b
                    key={total}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block text-price font-black text-brand stretch-112"
                  >
                    {total ? `${fmt.number(total)} ${currency}` : '-'}
                  </motion.b>
                </AnimatePresence>
              </div>
            </div>

            <div
              dir={getLanguage(msgLang).dir}
              className="space-y-0.5 break-words border-s-4 border-brand bg-field p-4 text-[15px] leading-relaxed"
            >
              {lines.map((line, i) => (
                <motion.p
                  key={`${i}-${line}`}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="m-0"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
