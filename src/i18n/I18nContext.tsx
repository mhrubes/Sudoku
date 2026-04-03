import { createContext, useContext } from 'react'
import type { Locale } from './locale'

export type TFunction = (path: string) => string

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TFunction
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
