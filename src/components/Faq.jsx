import { ChevronDown } from 'lucide-react'
import { site, vtcUrl } from '../config/site'
import { useLang } from '../hooks/useLang'

// Answers are written from facts already published on the site (rates, documents, hours, VTC service),
// so the section adds real, crawlable text for the questions people actually search.
export default function Faq({ cars = [] }) {
  const { t, code, fmt } = useLang()

  const prices = cars.map((c) => c.pricePerDay).filter((p) => p > 0)
  const from = prices.length ? fmt.number(Math.min(...prices)) : null
  const currency = t('common.currency')

  const items = [
    {
      q: t('faq.q1'),
      a: from ? t('faq.a1', { price: from, currency }) : t('faq.a1NoPrice'),
    },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4', { address: t('footer.address'), hours: t('footer.hours') }) },
    { q: t('faq.q5'), a: t('faq.a5'), link: { href: vtcUrl(code), label: t('footer.vtcLink') } },
  ]

  return (
    <section id="faq" className="py-section">
      <div className="wrap">
        <h2 className="mb-[34px] text-h2">{t('faq.title')}</h2>
        <div className="max-w-[860px]">
          {items.map((item) => (
            <details key={item.q} className="group border-t border-line py-5 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="text-card">{item.q}</h3>
                <ChevronDown
                  className="size-5 shrink-0 text-brand transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 max-w-[60ch] text-soft">{item.a}</p>
              {item.link && (
                <a href={item.link.href} className="mt-3 inline-block font-bold text-brand no-underline hover:text-paper">
                  {item.link.label}
                </a>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
