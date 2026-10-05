import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Smartphone, UserCheck, PlaneTakeoff, X } from 'lucide-react'
import { site } from '../config/site'
import { useVtc } from '../context/VtcContext'
import { useLang } from '../hooks/useLang'
import { asset } from '../utils/asset'

const icons = [PlaneTakeoff, UserCheck, Smartphone]

export default function VtcModal() {
  const { t } = useLang()
  const { open, hide } = useVtc()
  const translatedFeatures = t('vtc.features', { returnObjects: true })
  const features = Array.isArray(translatedFeatures) ? translatedFeatures : []

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) hide()
      }}
    >
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                style={{ x: '-50%', y: '-50%' }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed left-1/2 top-1/2 z-70 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto border border-t-[6px] border-line border-t-brand bg-ink shadow-2xl"
              >
                <div className="p-6 sm:p-8">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="bg-brand px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-paper">
                      {t('vtc.badge')}
                    </span>
                    <Dialog.Close
                      aria-label={t('vtc.close')}
                      className="grid size-9 place-items-center border-2 border-edge transition-colors hover:border-brand hover:text-brand"
                    >
                      <X className="size-5" aria-hidden="true" />
                    </Dialog.Close>
                  </div>

                  <p className="m-0 mb-2 text-sm font-extrabold uppercase text-brand stretch-112">
                    {t('vtc.eyebrow')}
                  </p>
                  <Dialog.Title className="text-3xl leading-none sm:text-4xl">{t('vtc.title')}</Dialog.Title>
                  <Dialog.Description className="mb-6 mt-4 text-soft">{t('vtc.text')}</Dialog.Description>

                  <img
                    src={asset('/vtc.jpeg')}
                    alt={t('vtc.imageAlt')}
                    className="mx-auto mb-6 scale-75 object-contain"
                  />

                  <ul className="m-0 grid list-none gap-4 p-0">
                    {features.map((f, i) => {
                      const Icon = icons[i] ?? Smartphone
                      return (
                        <li key={f.title} className="flex gap-3.5">
                          <span className="grid size-10 shrink-0 place-items-center bg-brand">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <div>
                            <b className="block">{f.title}</b>
                            <span className="text-[15px] text-mute">{f.text}</span>
                          </div>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="mt-8 flex flex-wrap justify-end gap-3">
                    <Dialog.Close className="btn btn-ghost">{t('vtc.later')}</Dialog.Close>
                    <a href={site.vtc.url} target="_blank" rel="noopener" className="btn">
                      {t('vtc.cta')}
                      <ArrowUpRight className="size-4.5 rtl:-scale-x-100" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}