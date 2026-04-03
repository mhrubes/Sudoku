import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'

export function Home() {
  const { t } = useI18n()

  return (
    <div className="min-vh-100 d-flex flex-column pe-5">
      <header className="py-4 text-center">
        <h1 className="display-5 fw-semibold mb-0">{t('home.title')}</h1>
      </header>
      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3 pb-5">
        <div className="d-grid gap-3" style={{ maxWidth: 280, width: '100%' }}>
          <Link to="/hra/easy" className="btn btn-success btn-lg">
            {t('home.easy')}
          </Link>
          <Link to="/hra/medium" className="btn btn-primary btn-lg">
            {t('home.medium')}
          </Link>
          <Link to="/hra/hard" className="btn btn-danger btn-lg">
            {t('home.hard')}
          </Link>
        </div>
      </main>
    </div>
  )
}
