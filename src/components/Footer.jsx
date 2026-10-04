import { Clock, Mail, Phone } from 'lucide-react'
import { IconBrandInstagram } from '@tabler/icons-react'

import { site } from '../config/site'
import { useLang } from '../hooks/useLang'
import { asset } from '../utils/asset'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="border-t-[6px] border-brand bg-ink pb-[50px] pt-11 text-[15px] text-mute">
      <div className="wrap flex flex-wrap items-center justify-between gap-10">
        {/* Logo */}
        <img
          src={asset('logo.png')}
          alt={site.name}
          className="h-[72px] w-auto"
        />

        {/* Contact information */}
        <ul className="m-0 list-none space-y-2 p-0">
          {/* Phone */}
          <li className="flex items-center gap-2">
            <Phone
              className="size-4 shrink-0"
              aria-hidden="true"
            />

            <span className="sr-only">
              {t('footer.phone')}:
            </span>

            <a
              href={`tel:${site.phoneHref}`}
              dir="ltr"
              className="no-underline transition-colors hover:text-paper"
            >
              {site.phoneDisplay}
            </a>
          </li>

          {/* Opening hours */}
          <li className="flex items-center gap-2">
            <Clock
              className="size-4 shrink-0"
              aria-hidden="true"
            />

            <span>{t('footer.hours')}</span>
          </li>

          <li className="flex items-center gap-2">
            <IconBrandInstagram
              className="size-4 shrink-0"
              aria-hidden="true"
              size={50}
            />

            <a
              href="https://instagram.com/benaddadreamcar"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline transition-colors hover:text-paper"
            >
              @benaddadreamcar
            </a>
          </li>

          <li className="flex items-center gap-2">
            <Mail
              className="size-4 shrink-0"
              aria-hidden="true"
            />

            <a
              href="mailto:benaddadreamcar@gmail.com"
              className="no-underline transition-colors hover:text-paper"
            >
              benaddadreamcar@gmail.com
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}