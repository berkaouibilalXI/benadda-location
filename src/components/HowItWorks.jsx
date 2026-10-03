import { motion } from 'framer-motion'
import { Check, ClipboardCheck, ShieldCheck } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { asset } from '../utils/asset'

function Checklist({ Icon, title, items }) {
  return (
    <div>
      <h3 className="mb-3.5 flex items-center gap-2.5 text-sub">
        <Icon className="size-6 text-brand" aria-hidden="true" />
        {title}
      </h3>
      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <li key={item} className="my-1.5 flex gap-2.5">
            <Check className="mt-1.5 size-4 shrink-0 text-brand" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HowItWorks() {
  const { t } = useLang()
  const steps = t('how.steps', { returnObjects: true })

  return (
    <section id="how" className="bg-paper py-section text-ink">
      <div className="wrap">
        <div className="mb-11.5 flex flex-wrap items-center gap-10">
          <img src={asset('logo-dark.png')} alt={t('how.logoAlt')} className="h-auto w-57.5" />
          <h2 className="text-h2">{t('how.title')}</h2>
        </div>

        <ol className="m-0 grid list-none grid-cols-1 gap-6.5 p-0 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              <motion.div
                className="h-1.5 origin-left bg-brand"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
              />
              <span className="mt-4 block text-[34px] font-black leading-none stretch-125">{i + 1}</span>
              <h3 className="mb-2 mt-1.5 text-step">{s.title}</h3>
              <p className="m-0 text-base text-graphite">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-13.5 grid grid-cols-1 gap-10 bg-ink p-6 text-paper sm:p-8.5 md:grid-cols-2">
          <Checklist Icon={ClipboardCheck} title={t('how.bring.title')} items={t('how.bring.items', { returnObjects: true })} />
          <Checklist Icon={ShieldCheck} title={t('how.included.title')} items={t('how.included.items', { returnObjects: true })} />
        </div>
      </div>
    </section>
  )
}
