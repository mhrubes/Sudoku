import { useI18n } from '../i18n/I18nContext'
import { useBoxTooltipPreference } from '../preferences/BoxTooltipPreferenceContext'

/** Ikona mřížky (nápověda u bloku) — stejná pro oba stavy, liší se styl tlačítka */
function IconBlockHint({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="1.25rem"
      height="1.25rem"
      fill="currentColor"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zM1.5 1a.5.5 0 0 0-.5.5V5h4V1H1.5zM5 6H1v3h4V6zm1 4h4v4H6v-4zm-1 0H1v3.5a.5.5 0 0 0 .5.5H5v-4zm5 0v4h4v-4h-4zm4-1h4v-.5a.5.5 0 0 0-.5-.5H11v4zm0-5h4V1.5a.5.5 0 0 0-.5-.5H11v4zm-1 0V1H6v4h4zm-5 0H1V1.5a.5.5 0 0 0 .5-.5H5v4zm0 5H1v3h4V6z" />
    </svg>
  )
}

export function BoxTooltipToggle() {
  const { boxTooltipEnabled, toggleBoxTooltip } = useBoxTooltipPreference()
  const { t } = useI18n()

  return (
    <button
      type="button"
      className={`btn rounded-circle p-2 d-flex align-items-center justify-content-center box-tooltip-toggle-btn shadow-sm ${
        boxTooltipEnabled ? 'btn-outline-primary' : 'btn-outline-secondary'
      }`}
      onClick={toggleBoxTooltip}
      title={
        boxTooltipEnabled ? t('hints.boxTooltipOffTitle') : t('hints.boxTooltipOnTitle')
      }
      aria-label={
        boxTooltipEnabled ? t('hints.boxTooltipOffAria') : t('hints.boxTooltipOnAria')
      }
      aria-pressed={boxTooltipEnabled}
    >
      <IconBlockHint />
    </button>
  )
}
