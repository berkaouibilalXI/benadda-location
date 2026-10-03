import { useTranslation } from 'react-i18next'
import { getLanguage } from '../i18n'
import { localize, makeFormatters } from '../utils/format'

// Current language helpers for components.
export function useLang() {
  const { t, i18n } = useTranslation()
  const code = getLanguage(i18n.resolvedLanguage).code
  const meta = getLanguage(code)
  return {
    t,
    code,
    dir: meta.dir,
    isRTL: meta.dir === 'rtl',
    fmt: makeFormatters(code),
    name: (car) => localize(car.name, code),
    changeLanguage: (c) => i18n.changeLanguage(c),
  }
}
