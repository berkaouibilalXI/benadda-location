import { Clock, Phone } from 'lucide-react'
import { site } from '../config/site'
import { useLang } from '../hooks/useLang'
import { asset } from '../utils/asset'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t-[6px] border-brand bg-ink pb-[50px] pt-11 text-[15px] text-mute">
      <div className="wrap flex flex-wrap items-center justify-between gap-10">
        <img src={asset('logo.png')} alt={site.name} className="h-[72px] w-auto" />
        <ul className="m-0 list-none space-y-1.5 p-0">
          <li className="flex items-center gap-2">
            <Phone className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">{t('footer.phone')}:</span>
            <a href={`tel:${site.phoneHref}`} dir="ltr" className="no-underline hover:text-paper">
              {site.phoneDisplay}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            {t('footer.hours')}
          </li>
          <li>{t('footer.note')}</li>
        </ul>
      </div>
    </footer>
  )
}
