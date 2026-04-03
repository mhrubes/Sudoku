import { LOCALES, type Locale } from '../i18n/locale'
import { useI18n } from '../i18n/I18nContext'

const LABEL: Record<Locale, string> = {
  cs: 'CZ',
  en: 'EN',
  sk: 'SK',
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      className="btn-group btn-group-sm shadow-sm lang-switcher"
      role="group"
      aria-label={t('lang.pickerAria')}
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`btn ${locale === code ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setLocale(code)}
          title={LABEL[code]}
        >
          {LABEL[code]}
        </button>
      ))}
    </div>
  )
}
