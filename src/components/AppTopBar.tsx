import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function AppTopBar() {
  return (
    <div className="app-top-controls">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  )
}
