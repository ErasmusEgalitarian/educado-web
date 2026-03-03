import '@/app/styles/globals.css'
import { renderAuthLanding } from '@/features/auth'
import { mountLanguageSwitcher } from '@/shared/ui/languageSwitcher'
import { routes } from '@/app/routes'
import { renderHomePage } from '@/app/pages/HomePage'

document.addEventListener('DOMContentLoaded', () => {
  const languageSwitcherContainer = document.getElementById('language-switcher')
  if (languageSwitcherContainer) {
    mountLanguageSwitcher(languageSwitcherContainer)
  }

  const root = document.getElementById('app-root')
  if (!root) return

  if (window.location.pathname === routes.home) {
    renderHomePage(root)
    return
  }

  renderAuthLanding(root)
})