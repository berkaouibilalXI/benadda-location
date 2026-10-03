import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Menu, X } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { asset } from '../utils/asset'
import LanguageSwitcher from './LanguageSwitcher'

const links = [
  { href: '#fleet', key: 'nav.fleet' },
  { href: '#how', key: 'nav.how' },
  { href: '#reserve', key: 'nav.reserve' },
]

export default function Header() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink">
      <div className="wrap flex h-header items-center gap-5">
        <a href="#top" aria-label={t('nav.home')} className="shrink-0">
          <img src={asset('logo.png')} alt="Benadda Dreamcar" className="h-11 w-auto" />
        </a>

        <div className="ms-auto flex items-center gap-4 md:gap-6">
          <nav className="hidden gap-5.5 text-[15px] font-semibold md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="no-underline hover:text-brand">
                {t(l.key)}
              </a>
            ))}
          </nav>

          <LanguageSwitcher />

          <a href="#reserve" className="btn hidden py-2.5 sm:inline-flex">
            <CalendarCheck className="size-4.5" aria-hidden="true" />
            {t('header.book')}
          </a>

          <button
            type="button"
            className="p-1 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="wrap flex flex-col py-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line py-3 text-lg font-semibold no-underline"
                >
                  {t(l.key)}
                </a>
              ))}
              <a href="#reserve" onClick={() => setOpen(false)} className="btn mt-4 self-start">
                <CalendarCheck className="size-[18px]" aria-hidden="true" />
                {t('header.book')}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
