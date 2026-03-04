import '@/app/styles/globals.css'
import { renderAuthLanding } from '@/features/auth'
import { mountLanguageSwitcher } from '@/shared/ui/languageSwitcher'
import { routes } from '@/app/routes'
import { renderHomePage } from '@/app/pages/HomePage'
import { clearAccessToken, getCurrentUser } from '@/shared/api/auth-session'
import { subscribeLanguage } from '@/shared/i18n'
import { MediaBankPage } from '@/features/media'
import { MediaTabs } from '@/features/media/components/MediaTabs'

let currentLanguageListenerCleanup: (() => void) | null = null
let closeDropdownListener: ((e: Event) => void) | null = null

function setupDropdownToggle() {
  // Clean up previous listener
  if (closeDropdownListener) {
    document.removeEventListener('click', closeDropdownListener)
  }

  const userButton = document.querySelector('.header-user-button') as HTMLButtonElement | null
  const userDropdown = document.querySelector('.header-user-dropdown') as HTMLElement | null

  if (!userButton || !userDropdown) return

  // Click handler for button
  const handleButtonClick = (e: Event) => {
    e.stopPropagation()
    const isVisible = userDropdown.style.display !== 'none'
    userDropdown.style.display = isVisible ? 'none' : 'block'
    userButton.setAttribute('aria-expanded', isVisible ? 'false' : 'true')
  }

  // Prevent closing when clicking inside dropdown
  const handleDropdownClick = (e: Event) => {
    e.stopPropagation()
  }

  // Close dropdown when clicking outside
  closeDropdownListener = (e: Event) => {
    const target = e.target as HTMLElement
    if (!target.closest('.header-user-area')) {
      userDropdown.style.display = 'none'
      userButton.setAttribute('aria-expanded', 'false')
    }
  }

  userButton.removeEventListener('click', handleButtonClick)
  userDropdown.removeEventListener('click', handleDropdownClick)

  userButton.addEventListener('click', handleButtonClick)
  userDropdown.addEventListener('click', handleDropdownClick)
  document.addEventListener('click', closeDropdownListener)
}

function initializeApp() {
  const currentPath = window.location.pathname
  const isCreatorHome = currentPath === routes.home
  const isAdminHome = currentPath === routes.adminHome
  const isMediaBank = currentPath === routes.mediaBank
  const isAuthenticatedRoute = isCreatorHome || isAdminHome || isMediaBank

  const appHeader = document.querySelector('.app-header')
  const languageSwitcherContainer = document.getElementById('language-switcher')

  if (appHeader) {
    appHeader.classList.toggle('public-header', !isAuthenticatedRoute)
    appHeader.classList.toggle('private-header', isAuthenticatedRoute)
  }

  if (languageSwitcherContainer) {
    if (isAuthenticatedRoute) {
      const user = getCurrentUser()
      const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'User Name'
      const email = user?.email ?? 'user@email.com'
      const initials = user ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase() : 'UN'

      languageSwitcherContainer.innerHTML = `
        <div class="header-user-area">
          <img src="/icons/bell.png" alt="Notifications" class="header-bell-icon" width="24" height="24">
          <button class="header-user-button" type="button" aria-haspopup="menu" aria-expanded="false">
            <div class="header-user-info">
              <strong>${fullName}</strong>
              <small>${email}</small>
            </div>
            <div class="header-user-avatar">${initials}</div>
          </button>
          <div class="header-user-dropdown" role="menu" style="display: none;">
            <div id="header-language-switcher" class="header-dropdown-content"></div>
            <div class="header-dropdown-divider" aria-hidden="true"></div>
            <button id="header-logout-btn" class="header-logout-btn" type="button">Sair</button>
          </div>
        </div>
      `
      
      const headerLanguageSwitcher = document.getElementById('header-language-switcher')
      if (headerLanguageSwitcher) {
        mountLanguageSwitcher(headerLanguageSwitcher)
      }

      const headerLogoutButton = document.getElementById('header-logout-btn')
      headerLogoutButton?.addEventListener('click', () => {
        clearAccessToken()
        window.location.assign('/')
      })

      // Setup dropdown after DOM is ready
      setTimeout(() => {
        setupDropdownToggle()
      }, 0)
    } else {
      mountLanguageSwitcher(languageSwitcherContainer)
    }
  }

  const root = document.getElementById('app-root')
  if (!root) return

  if (isCreatorHome) {
    MediaTabs.renderInHeader('courses', routes.home)
    renderHomePage(root, 'USER')
  } else if (isAdminHome) {
    MediaTabs.renderInHeader('courses', routes.adminHome)
    renderHomePage(root, 'ADMIN')
  } else if (isMediaBank) {
    MediaTabs.renderInHeader('media-bank')
    const mediaBankPage = new MediaBankPage(root)
    mediaBankPage.init()
  } else {
    renderAuthLanding(root)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApp()
  
  // Only subscribe to language changes on authenticated routes
  const currentPath = window.location.pathname
  const isAuthenticatedRoute = currentPath === routes.home || currentPath === routes.adminHome || currentPath === routes.mediaBank
  
  if (isAuthenticatedRoute) {
    if (currentLanguageListenerCleanup) {
      currentLanguageListenerCleanup()
    }
    currentLanguageListenerCleanup = subscribeLanguage(() => {
      initializeApp()
    })
  }
})