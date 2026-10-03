import { getLanguage } from '../i18n'

export function localize(value, lang) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value[lang] ?? value.en ?? Object.values(value)[0] ?? ''
}

export function makeFormatters(langCode) {
  const { locale } = getLanguage(langCode)
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  return {
    number: (n) => number.format(n),
    date: (d) => date.format(d),
  }
}
