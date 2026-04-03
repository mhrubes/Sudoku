import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import { AppTopBar } from './components/AppTopBar'
import { ToastHost } from './components/ToastHost'
import { I18nProvider } from './i18n/I18nProvider'
import { BoxTooltipPreferenceProvider } from './preferences/BoxTooltipPreferenceContext'
import { ThemeProvider } from './theme/ThemeProvider'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <ThemeProvider>
          <BoxTooltipPreferenceProvider>
            <AppTopBar />
            <App />
          </BoxTooltipPreferenceProvider>
          <ToastHost />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
