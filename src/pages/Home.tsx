import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'

export function Home() {
  const { t } = useI18n()

  return (
    <div className="app-page-home d-flex flex-column">
      <header className="pt-0 pb-2 pb-sm-3 text-center px-1 flex-shrink-0">
        <h1 className="home-title fw-semibold mb-0">{t('home.title')}</h1>
      </header>
      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-2 px-sm-3 pb-0 pt-1 min-h-0">
        <div className="d-grid gap-2 gap-md-3 w-100" style={{ maxWidth: 280 }}>
          <Link to="/hra/easy" className="btn btn-success btn-lg py-2 py-sm-3">
            {t('home.easy')}
          </Link>
          <Link to="/hra/medium" className="btn btn-primary btn-lg py-2 py-sm-3">
            {t('home.medium')}
          </Link>
          <Link to="/hra/hard" className="btn btn-danger btn-lg py-2 py-sm-3">
            {t('home.hard')}
          </Link>
        </div>
      </main>
    </div>
  )
}
