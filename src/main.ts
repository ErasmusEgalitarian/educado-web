import '@/app/styles/globals.css'
import { renderAuthLanding } from '@/features/auth'
import { mountLanguageSwitcher } from '@/shared/ui/languageSwitcher'
import { routes } from '@/app/routes'
import { renderHomePage } from '@/app/pages/HomePage'
import { clearAccessToken, getAccessToken, getCurrentUser } from '@/shared/api/auth-session'
import { subscribeLanguage, t } from '@/shared/i18n'
import { MediaBankPage } from '@/features/media'
import { MediaTabs } from '@/features/media/components/MediaTabs'
import { hideAppLoader, showAppLoader } from '@/shared/ui/app-loader'
import { renderAdminUsersPage } from '@/features/admin/pages/AdminUsersPage'
import { renderAdminUserReviewPage } from '@/features/admin/pages/AdminUserReviewPage'
import { renderAdminInstitutionsPage } from '@/features/admin/pages/AdminInstitutionsPage'
import { renderEditProfilePage } from '@/features/auth/pages/EditProfilePage'
import { renderDashboardPage } from '@/features/dashboard/pages/DashboardPage'
import {
  renderMyCoursesPage,
  renderExplorePage,
  renderProfilePage,
  renderStudentEditProfilePage,
  renderCertificatesPage,
  renderLeaderboardPage,
  renderRatingPage,
  renderCourseDetailPage,
  renderStudentRegisterPage,
} from '@/features/student'
import '@/features/student/styles/mobile.css'
import { renderLandingPage, renderAboutPage, renderSolutionPage, renderInstitutionsPage, renderContactPage } from '@/features/public'
import { renderPublicNav, renderPublicHeaderRight, setupPublicMobileSidebar } from '@/features/public/components/PublicNav'
import '@/features/public/styles/public.css'

let currentLanguageListenerCleanup: (() => void) | null = null
let closeDropdownListener: ((e: Event) => void) | null = null
let closeMobileSidebarOnResize: (() => void) | null = null

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

function setupMobileSidebar(options: {
  fullName: string
  email: string
  initials: string
  avatarUrl: string
  navTabs: { id: string; label: string; href: string; active: boolean }[]
}) {
  // Remove previous sidebar if any
  document.querySelector('.mobile-sidebar-overlay')?.remove()
  document.querySelector('.mobile-hamburger-btn')?.remove()

  // Clean up previous resize listener
  if (closeMobileSidebarOnResize) {
    window.removeEventListener('resize', closeMobileSidebarOnResize)
  }

  const headerLeft = document.querySelector('.header-left')
  if (!headerLeft) return

  // Add hamburger button
  const hamburger = document.createElement('button')
  hamburger.className = 'mobile-hamburger-btn'
  hamburger.type = 'button'
  hamburger.setAttribute('aria-label', t('common.openMenu'))
  hamburger.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28363e" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
  headerLeft.insertBefore(hamburger, headerLeft.firstChild)

  // Create sidebar overlay
  const overlay = document.createElement('div')
  overlay.className = 'mobile-sidebar-overlay'

  const navItems = options.navTabs.map(tab => `
    <a href="${tab.href}" class="mobile-sidebar-nav-item${tab.active ? ' is-active' : ''}">${tab.label}</a>
  `).join('')

  overlay.innerHTML = `
    <aside class="mobile-sidebar">
      <div class="mobile-sidebar-header">
        <div class="logo">
          <img src="/images/logo_black240.png" alt="EDUCADO" class="logo-img">
          <span class="logo-text">EDUCADO</span>
        </div>
        <button class="mobile-sidebar-close" type="button" aria-label="${t('common.closeMenu')}">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#4e6879" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></svg>
        </button>
      </div>

      <div class="mobile-sidebar-user">
        <div class="mobile-sidebar-avatar">
          ${options.avatarUrl ? `<img src="${options.avatarUrl}" alt="${options.fullName}">` : `<span>${options.initials}</span>`}
        </div>
        <div class="mobile-sidebar-user-info">
          <strong>${options.fullName}</strong>
          <small>${options.email}</small>
        </div>
      </div>
      <div id="mobile-sidebar-language-switcher" class="mobile-sidebar-section"></div>
      <button id="mobile-sidebar-edit-profile" class="mobile-sidebar-btn" type="button">${t('common.editProfile')}</button>

      <div class="mobile-sidebar-divider"></div>

      <nav class="mobile-sidebar-nav">
        ${navItems}
      </nav>

      <div class="mobile-sidebar-footer">
        <button id="mobile-sidebar-logout" class="mobile-sidebar-logout-btn" type="button">${t('common.logout')}</button>
      </div>
    </aside>
  `
  document.body.appendChild(overlay)

  // Mount language switcher inside sidebar
  const sidebarLangContainer = document.getElementById('mobile-sidebar-language-switcher')
  if (sidebarLangContainer) {
    mountLanguageSwitcher(sidebarLangContainer)
  }

  const openSidebar = () => {
    overlay.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }

  const closeSidebar = () => {
    overlay.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  hamburger.addEventListener('click', openSidebar)
  overlay.querySelector('.mobile-sidebar-close')?.addEventListener('click', closeSidebar)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSidebar()
  })

  // On mobile, clicking user avatar/name in header opens sidebar instead of dropdown
  const userButton = document.querySelector('.header-user-button') as HTMLElement | null
  if (userButton) {
    userButton.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.stopPropagation()
        e.preventDefault()
        const dropdown = document.querySelector('.header-user-dropdown') as HTMLElement | null
        if (dropdown) dropdown.style.display = 'none'
        openSidebar()
      }
    }, true)
  }

  document.getElementById('mobile-sidebar-edit-profile')?.addEventListener('click', () => {
    closeSidebar()
    window.location.assign(routes.profile)
  })

  document.getElementById('mobile-sidebar-logout')?.addEventListener('click', () => {
    closeSidebar()
    clearAccessToken()
    window.location.assign('/')
  })

  // Close sidebar on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeSidebar()
    }
  })

  // Close sidebar if window resizes past mobile breakpoint
  closeMobileSidebarOnResize = () => {
    if (window.innerWidth > 768 && overlay.classList.contains('is-open')) {
      closeSidebar()
    }
  }
  window.addEventListener('resize', closeMobileSidebarOnResize)
}

function setupHeaderLogoNavigation(isAuthenticatedRoute: boolean) {
  const logo = document.querySelector('.logo') as HTMLElement | null
  if (!logo) return

  const currentUser = getCurrentUser()
  const targetRoute = isAuthenticatedRoute ? (currentUser?.role === 'ADMIN' ? routes.adminHome : routes.home) : '/'

  logo.setAttribute('role', 'button')
  logo.setAttribute('tabindex', '0')

  logo.onclick = () => {
    if (window.location.pathname === targetRoute) return
    window.location.assign(targetRoute)
  }

  logo.onkeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    if (window.location.pathname === targetRoute) return
    window.location.assign(targetRoute)
  }
}

async function initializeApp() {
  const currentPath = window.location.pathname
  const isCreatorHome = currentPath === routes.home
  const isAdminHome = currentPath === routes.adminHome
  const isAdminUsers = currentPath === routes.adminUsers
  const isAdminInstitutions = currentPath === routes.adminInstitutions
  const isAdminUserReview = currentPath === routes.adminUserReview
  const isMediaBank = currentPath === routes.mediaBank
  const isDashboard = currentPath === routes.dashboard
  const isProfile = currentPath === routes.profile

  // Public routes
  const isLanding = currentPath === routes.landing
  const isAbout = currentPath === routes.about
  const isSolution = currentPath === routes.solution
  const isInstitutions = currentPath === routes.institutions
  const isContact = currentPath === routes.contact
  const isAuth = currentPath === routes.auth
  const isPublicRoute = isLanding || isAbout || isSolution || isInstitutions || isContact || isAuth

  // Redirect authenticated users away from landing to their home
  if (isLanding && getAccessToken()) {
    const user = getCurrentUser()
    window.location.assign(user?.role === 'ADMIN' ? routes.adminHome : routes.home)
    return
  }

  // Student mobile routes
  const isStudentRoute = currentPath.startsWith('/student/')
  const isStudentRegister = currentPath === routes.studentRegister
  const isStudentMyCourses = currentPath === routes.studentMyCourses
  const isStudentExplore = currentPath === routes.studentExplore
  const isStudentProfile = currentPath === routes.studentProfile
  const isStudentCourseDetail = currentPath === routes.studentCourseDetail
  const isStudentCertificates = currentPath === routes.studentCertificates
  const isStudentLeaderboard = currentPath === routes.studentLeaderboard
  const isStudentRating = currentPath === routes.studentRating
  const isStudentEditProfile = currentPath === routes.studentEditProfile

  const isAuthenticatedRoute = isCreatorHome || isAdminHome || isAdminUsers || isAdminInstitutions || isAdminUserReview || isMediaBank || isDashboard || isProfile

  setupHeaderLogoNavigation(isAuthenticatedRoute)

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

      const avatarUrl = user?.avatarMediaId
        ? `${import.meta.env.VITE_API_URL ?? 'http://localhost:5001'}/media/${user.avatarMediaId}/stream?token=${getAccessToken() ?? ''}`
        : ''

      languageSwitcherContainer.innerHTML = `
        <div class="header-user-area">
          <img src="/icons/bell.png" alt="Notifications" class="header-bell-icon" width="24" height="24">
          <button class="header-user-button" type="button" aria-haspopup="menu" aria-expanded="false">
            <div class="header-user-info">
              <strong>${fullName}</strong>
              <small>${email}</small>
            </div>
            <div class="header-user-avatar">${avatarUrl ? `<img src="${avatarUrl}" alt="${fullName}" class="header-avatar-img">` : initials}</div>
          </button>
          <div class="header-user-dropdown" role="menu" style="display: none;">
            <div class="header-profile-card">
              <div class="header-profile-avatar">
                ${avatarUrl ? `<img src="${avatarUrl}" alt="${fullName}">` : `<span>${initials}</span>`}
              </div>
              <div class="header-profile-info">
                <strong>${fullName}</strong>
                <small>${email}</small>
              </div>
            </div>
            <div class="header-dropdown-divider" aria-hidden="true"></div>
            <div id="header-language-switcher" class="header-dropdown-content"></div>
            <div class="header-dropdown-divider" aria-hidden="true"></div>
            <button id="header-edit-profile-btn" class="header-menu-btn" type="button">${t('common.editProfile')}</button>
            <div class="header-dropdown-divider" aria-hidden="true"></div>
            <button id="header-logout-btn" class="header-logout-btn" type="button">${t('common.logout')}</button>
          </div>
        </div>
      `
      
      const headerLanguageSwitcher = document.getElementById('header-language-switcher')
      if (headerLanguageSwitcher) {
        mountLanguageSwitcher(headerLanguageSwitcher)
      }

      const headerEditProfileButton = document.getElementById('header-edit-profile-btn')
      headerEditProfileButton?.addEventListener('click', () => {
        window.location.assign(routes.profile)
      })

      const headerLogoutButton = document.getElementById('header-logout-btn')
      headerLogoutButton?.addEventListener('click', () => {
        clearAccessToken()
        window.location.assign('/')
      })

      // Setup dropdown after DOM is ready
      setTimeout(() => {
        setupDropdownToggle()
      }, 0)

      // Build mobile sidebar nav tabs
      const isAdmin = user?.role === 'ADMIN'
      const coursesPath = isAdmin ? routes.adminHome : routes.home
      const sidebarNavTabs: { id: string; label: string; href: string; active: boolean }[] = [
        { id: 'courses', label: t('courses.home.mediaBank.headerTabs.courses'), href: coursesPath, active: isCreatorHome || isAdminHome || isProfile },
        { id: 'media-bank', label: t('courses.home.mediaBank.headerTabs.mediaBank'), href: routes.mediaBank, active: isMediaBank },
        { id: 'dashboard', label: t('courses.home.mediaBank.headerTabs.dashboard'), href: routes.dashboard, active: isDashboard },
      ]
      if (isAdmin) {
        sidebarNavTabs.push({ id: 'admin', label: t('courses.home.mediaBank.headerTabs.admin'), href: routes.adminUsers, active: isAdminUsers || isAdminInstitutions || isAdminUserReview })
      }

      setupMobileSidebar({ fullName, email, initials, avatarUrl, navTabs: sidebarNavTabs })
    } else if (isPublicRoute) {
      const headerTabsContainer = document.getElementById('header-tabs-container')
      if (headerTabsContainer) {
        renderPublicNav(headerTabsContainer, { currentPath })
      }
      renderPublicHeaderRight(languageSwitcherContainer)
      setupPublicMobileSidebar(currentPath)
    } else {
      mountLanguageSwitcher(languageSwitcherContainer)
    }
  }

  const root = document.getElementById('app-root')
  if (!root) return

  if (isCreatorHome) {
    MediaTabs.renderInHeader('courses', { coursesPath: routes.home })
    renderHomePage(root, 'USER')
  } else if (isAdminHome) {
    MediaTabs.renderInHeader('courses', { coursesPath: routes.adminHome, adminPath: routes.adminUsers })
    renderHomePage(root, 'ADMIN')
  } else if (isAdminUsers) {
    MediaTabs.renderInHeader('admin', { coursesPath: routes.adminHome, adminPath: routes.adminUsers })
    renderAdminUsersPage(root)
  } else if (isAdminInstitutions) {
    MediaTabs.renderInHeader('admin', { coursesPath: routes.adminHome, adminPath: routes.adminUsers })
    renderAdminInstitutionsPage(root)
  } else if (isAdminUserReview) {
    MediaTabs.renderInHeader('admin', { coursesPath: routes.adminHome, adminPath: routes.adminUsers })
    renderAdminUserReviewPage(root)
  } else if (isMediaBank) {
    const currentUser = getCurrentUser()
    const coursesPath = currentUser?.role === 'ADMIN' ? routes.adminHome : routes.home
    const adminPath = currentUser?.role === 'ADMIN' ? routes.adminUsers : undefined
    MediaTabs.renderInHeader('media-bank', { coursesPath, adminPath })
    const mediaBankPage = new MediaBankPage(root)
    await mediaBankPage.init()
  } else if (isDashboard) {
    const currentUser = getCurrentUser()
    const coursesPath = currentUser?.role === 'ADMIN' ? routes.adminHome : routes.home
    const adminPath = currentUser?.role === 'ADMIN' ? routes.adminUsers : undefined
    MediaTabs.renderInHeader('dashboard', { coursesPath, adminPath })
    renderDashboardPage(root)
  } else if (isProfile) {
    const currentUser = getCurrentUser()
    const coursesPath = currentUser?.role === 'ADMIN' ? routes.adminHome : routes.home
    const adminPath = currentUser?.role === 'ADMIN' ? routes.adminUsers : undefined
    MediaTabs.renderInHeader('courses', { coursesPath, adminPath })
    await renderEditProfilePage(root, {
      onNavigateHome: () => {
        history.pushState(null, '', currentUser?.role === 'ADMIN' ? routes.adminHome : routes.home)
        MediaTabs.renderInHeader('courses', { coursesPath, adminPath })
        renderHomePage(root, currentUser?.role === 'ADMIN' ? 'ADMIN' : 'USER')
      },
    })
  } else if (isStudentRoute) {
    // Student mobile routes — hide desktop header
    const appHeader = document.querySelector('.app-header') as HTMLElement | null
    if (appHeader) appHeader.style.display = 'none'

    if (isStudentRegister) {
      renderStudentRegisterPage(root)
    } else if (isStudentMyCourses) {
      await renderMyCoursesPage(root)
    } else if (isStudentExplore) {
      await renderExplorePage(root)
    } else if (isStudentProfile) {
      await renderProfilePage(root)
    } else if (isStudentCourseDetail) {
      await renderCourseDetailPage(root)
    } else if (isStudentCertificates) {
      await renderCertificatesPage(root)
    } else if (isStudentLeaderboard) {
      await renderLeaderboardPage(root)
    } else if (isStudentRating) {
      await renderRatingPage(root)
    } else if (isStudentEditProfile) {
      await renderStudentEditProfilePage(root)
    } else {
      // Default student route
      window.location.assign(routes.studentMyCourses)
    }
  } else if (isLanding) {
    renderLandingPage(root)
  } else if (isAbout) {
    renderAboutPage(root)
  } else if (isSolution) {
    renderSolutionPage(root)
  } else if (isInstitutions) {
    renderInstitutionsPage(root)
  } else if (isContact) {
    renderContactPage(root)
  } else if (isAuth) {
    renderAuthLanding(root)
  } else {
    window.location.assign(routes.landing)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  showAppLoader()

  try {
    await initializeApp()
  } finally {
    await hideAppLoader()
  }
  
  // Subscribe to language changes on authenticated and public routes
  const currentPath = window.location.pathname
  const isPublicRoute =
    currentPath === routes.landing ||
    currentPath === routes.about ||
    currentPath === routes.solution ||
    currentPath === routes.institutions ||
    currentPath === routes.contact ||
    currentPath === routes.auth
  const isAuthenticatedRoute =
    currentPath === routes.home ||
    currentPath === routes.adminHome ||
    currentPath === routes.adminUsers ||
    currentPath === routes.adminInstitutions ||
    currentPath === routes.adminUserReview ||
    currentPath === routes.mediaBank ||
    currentPath === routes.dashboard ||
    currentPath === routes.profile ||
    currentPath.startsWith('/student/')

  if (isAuthenticatedRoute || isPublicRoute) {
    if (currentLanguageListenerCleanup) {
      currentLanguageListenerCleanup()
    }
    currentLanguageListenerCleanup = subscribeLanguage(async () => {
      showAppLoader()
      try {
        await initializeApp()
      } finally {
        await hideAppLoader()
      }
    })
  }
})