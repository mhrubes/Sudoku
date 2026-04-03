import { ToastContainer } from 'react-toastify'
import { useTheme } from '../theme/ThemeContext'

export function ToastHost() {
  const { theme } = useTheme()

  return (
    <ToastContainer
      theme={theme === 'dark' ? 'dark' : 'light'}
      limit={3}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover={false}
    />
  )
}
