import { motion } from 'framer-motion'
import { useLang } from '../hooks/useLang'

const column = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } }
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const arcs = [
  { d: 'M110 560A290 290 0 0 1 150 190', width: 46, delay: 0.1 },
  { d: 'M190 140A290 290 0 0 1 380 70', width: 30, delay: 0.5 },
  { d: 'M420 68A290 290 0 0 1 640 200', width: 18, delay: 0.9 },
]

function Gauge() {
  return (
    <svg
      viewBox="0 0 700 700"
      fill="none"
      stroke="#E51D23"
      aria-hidden="true"
      className="pointer-events-none absolute -top-[90px] end-[-140px] w-[760px] max-w-none opacity-95 rtl:-scale-x-100 max-md:-top-[60px] max-md:end-[-190px] max-md:w-[520px] max-md:opacity-55"
    >
      {arcs.map((a) => (
        <motion.path
          key={a.d}
          d={a.d}
          strokeWidth={a.width}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: a.delay, ease: 'easeOut' }}
        />
      ))}
    </svg>
  )
}

export default function Hero() {
  const { t } = useLang()
  const facts = t('hero.facts', { returnObjects: true })

  return (
    <div className="relative overflow-hidden pb-[70px] pt-[84px]">
      <Gauge />
      <motion.div variants={column} initial="hidden" animate="show" className="wrap relative">
        <motion.h1 variants={rise} className="max-w-[9.5em] text-display">
          {t('hero.title')}
        </motion.h1>
        <motion.p variants={rise} className="my-[26px] mb-8 max-w-[30em] text-[19px] text-soft">
          {t('hero.text')}
        </motion.p>
        <motion.div variants={rise} className="flex flex-wrap gap-3.5">
          <a href="#fleet" className="btn">
            {t('hero.seeFleet')}
          </a>
          <a href="#reserve" className="btn btn-ghost">
            {t('hero.getQuote')}
          </a>
        </motion.div>

        <motion.div
          variants={rise}
          className="mt-[70px] grid grid-cols-1 border-t border-line md:grid-cols-3"
        >
          {facts.map((f) => (
            <div key={f.title} className="pe-[18px] pt-5">
              <b className="block text-stat font-black stretch-125 text-brand">{f.title}</b>
              <span className="text-[15px] text-mute">{f.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
