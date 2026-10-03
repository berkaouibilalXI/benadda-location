import { Languages } from 'lucide-react'
import { languages } from '../i18n'
import { useLang } from '../hooks/useLang'

export default function LanguageSwitcher() {
  const { t, code, changeLanguage } = useLang()
  return (
    <div className="flex items-center gap-2">
      <Languages className="size-[18px] text-mute max-sm:hidden" aria-hidden="true" />
      <div role="group" aria-label={t('common.language')} className="flex border-2 border-edge">
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            title={l.name}
            aria-pressed={l.code === code}
            onClick={() => changeLanguage(l.code)}
            className={`min-w-9 px-2 py-1 text-sm font-bold transition-colors ${
              l.code === code ? 'bg-brand text-paper' : 'text-paper hover:bg-edge'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  )
}
