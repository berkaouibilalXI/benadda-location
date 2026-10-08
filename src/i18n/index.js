import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { site } from '../config/site'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

export const languages = [
  { code: 'fr', label: 'FR', name: 'Français', dir: 'ltr', locale: 'fr-FR', og: 'fr_FR' },
  { code: 'en', label: 'EN', name: 'English', dir: 'ltr', locale: 'en-GB', og: 'en_US' },
  { code: 'ar', label: 'ع', name: 'العربية', dir: 'rtl', locale: 'ar-DZ-u-nu-latn', og: 'ar_AR' },
]

export const defaultLanguage = site.defaultLanguage

export const getLanguage = (code) =>
  languages.find((l) => l.code === code) ?? languages.find((l) => l.code === defaultLanguage) ?? languages[0]

export const pathFor = (code) => (code === defaultLanguage ? '/' : `/${code}/`)

export function langFromPath(pathname) {
  const first = pathname.split('/').filter(Boolean)[0]
  return languages.some((l) => l.code === first && l.code !== defaultLanguage) ? first : defaultLanguage
}

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
}

export function createI18n(lng) {
  const instance = i18next.createInstance()
  instance.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: defaultLanguage,
    supportedLngs: languages.map((l) => l.code),
    interpolation: { escapeValue: false },
    initImmediate: false,
    react: { useSuspense: false },
  })
  return instance
}
