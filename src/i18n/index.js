import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { site } from '../config/site'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

export const languages = [
  { code: 'en', label: 'EN', name: 'English', dir: 'ltr', locale: 'en-GB' },
  { code: 'fr', label: 'FR', name: 'Français', dir: 'ltr', locale: 'fr-FR' },
  // { code: 'ar', label: 'ع', name: 'العربية', dir: 'rtl', locale: 'ar-DZ-u-nu-latn' },
]

export const getLanguage = (code) =>
  languages.find((l) => l.code === code) ??
  languages.find((l) => l.code === site.defaultLanguage) ??
  languages[0]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, fr: { translation: fr }, ar: { translation: ar } },
    supportedLngs: languages.map((l) => l.code),
    fallbackLng: site.defaultLanguage,
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  })

export default i18n
