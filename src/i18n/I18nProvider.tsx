import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { I18nContext, type TFunction } from './I18nContext'
import { LOCALE_STORAGE_KEY, type Locale } from './locale'
import { messages, type MessageTree } from './messages'

function readStoredLocale(): Locale | null {
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (v === 'cs' || v === 'en' || v === 'sk') return v
  } catch {
    /* ignore */
  }
  return null
}

function getInitialLocale(): Locale {
  const stored = readStoredLocale()
  if (stored) return stored
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.slice(0, 2).toLowerCase()
    if (lang === 'sk') return 'sk'
    if (lang === 'cs') return 'cs'
    if (lang === 'en') return 'en'
  }
  return 'cs'
}

function getString(tree: MessageTree, path: string): string | undefined {
  const parts = path.split('.')
  let cur: unknown = tree
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return undefined
    }
  }
  return typeof cur === 'string' ? cur : undefined
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  useLayoutEffect(() => {
    document.documentElement.lang = locale
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const t: TFunction = useCallback(
    (path: string) => {
      const value = getString(messages[locale], path)
      return value ?? path
    },
    [locale],
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
