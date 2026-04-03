import { useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'

function IconSun({ className }: { className?: string }) {
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
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-7a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
    </svg>
  )
}

function IconMoon({ className }: { className?: string }) {
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
      <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0 .878 3.46c0 4.021-3.278 7.277-7.318 7.277C.982 15 0 14.962 0 14.462c0-.654.383-1.362.687-1.938.306-.58.638-1.22.638-1.938 0-3.28 2.66-5.94 5.94-5.94.72 0 1.36.332 1.938.638.576.304 1.284.687 1.938.687.5 0 .538-.982.038-1.962a7.208 7.208 0 0 0-3.46-.878A.768.768 0 0 1 6 .278z" />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center theme-toggle-btn shadow-sm"
      onClick={toggleTheme}
      title={isDark ? t('theme.lightTitle') : t('theme.darkTitle')}
      aria-label={isDark ? t('theme.lightAria') : t('theme.darkAria')}
    >
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  )
}
