import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'

const STORAGE_KEY = 'sudoku-ui-onboarding-seen'

/**
 * Zachytí rozhodnutí „prázdné localStorage“ z prvního renderu i v React Strict Mode
 * (po zápisu tématu už délka není 0, ale modal má zůstat otevřený do zavření).
 */
let emptyStorageWelcomeLatch: boolean | null = null

function readShowOnFirstEmptyStorage(): boolean {
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return false
    if (emptyStorageWelcomeLatch !== null) return emptyStorageWelcomeLatch
    const show = localStorage.length === 0
    emptyStorageWelcomeLatch = show
    return show
  } catch {
    return false
  }
}

export function UiWelcomeModal() {
  const { t } = useI18n()
  const [open, setOpen] = useState(readShowOnFirstEmptyStorage)
  const dismissBtnRef = useRef<HTMLButtonElement>(null)

  const dismiss = useCallback(() => {
    emptyStorageWelcomeLatch = false
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dismissBtnRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, dismiss])

  if (!open) return null

  return (
    <>
      <div
        className="modal-backdrop fade show ui-welcome-modal__backdrop"
        aria-hidden
        onClick={dismiss}
      />
      <div
        className="modal fade show d-block ui-welcome-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-welcome-modal-title"
        tabIndex={-1}
        onClick={dismiss}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="ui-welcome-modal-title" className="modal-title h5 mb-0">
                {t('onboarding.title')}
              </h2>
              <button
                type="button"
                className="btn-close"
                onClick={dismiss}
                aria-label={t('onboarding.closeAria')}
              />
            </div>
            <div className="modal-body">
              <p className="mb-3">{t('onboarding.intro')}</p>
              <ul className="mb-0 ps-3 small">
                <li className="mb-2">{t('onboarding.itemLang')}</li>
                <li className="mb-2">{t('onboarding.itemHint')}</li>
                <li>{t('onboarding.itemTheme')}</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button
                ref={dismissBtnRef}
                type="button"
                className="btn btn-primary"
                onClick={dismiss}
              >
                {t('onboarding.dismiss')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
