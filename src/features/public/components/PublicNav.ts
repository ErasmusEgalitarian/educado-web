import { t } from '@/shared/i18n'
import { routes } from '@/app/routes'
import { mountLanguageSwitcher } from '@/shared/ui/languageSwitcher'

export function renderPublicNav(container: HTMLElement, options: { currentPath: string }) {
  const navLinks = [
    { key: 'publicNav.home', href: routes.landing },
    { key: 'publicNav.solution', href: routes.solution },
    { key: 'publicNav.institutions', href: routes.institutions },
    { key: 'publicNav.about', href: routes.about },
  ]

  container.innerHTML = `
    <nav class="public-nav" aria-label="${t('publicNav.ariaLabel')}">
      ${navLinks
        .map(
          (link) =>
            `<a href="${link.href}" class="public-nav-link${options.currentPath === link.href ? ' is-active' : ''}">${t(link.key)}</a>`
        )
        .join('')}
    </nav>
  `
}

export function renderPublicHeaderRight(container: HTMLElement) {
  container.innerHTML = `
    <div class="public-header-actions">
      <div id="public-lang-switcher"></div>
      <a href="${routes.auth}" class="public-header-login-btn">${t('publicNav.login')}</a>
      <a href="${routes.auth}" class="public-header-register-btn">${t('publicNav.register')}</a>
    </div>
  `

  const langContainer = document.getElementById('public-lang-switcher')
  if (langContainer) {
    mountLanguageSwitcher(langContainer)
  }
}

export function setupPublicMobileSidebar(currentPath: string) {
  // Remove previous sidebar if any
  document.querySelector('.public-mobile-overlay')?.remove()
  document.querySelector('.public-mobile-hamburger')?.remove()

  const headerLeft = document.querySelector('.header-left')
  if (!headerLeft) return

  // Hamburger button
  const hamburger = document.createElement('button')
  hamburger.className = 'public-mobile-hamburger'
  hamburger.type = 'button'
  hamburger.setAttribute('aria-label', t('common.openMenu'))
  hamburger.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28363e" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
  headerLeft.insertBefore(hamburger, headerLeft.firstChild)

  // Overlay + sidebar
  const overlay = document.createElement('div')
  overlay.className = 'public-mobile-overlay'

  const navLinks = [
    { key: 'publicNav.home', href: routes.landing },
    { key: 'publicNav.solution', href: routes.solution },
    { key: 'publicNav.institutions', href: routes.institutions },
    { key: 'publicNav.about', href: routes.about },
  ]

  overlay.innerHTML = `
    <aside class="public-mobile-sidebar">
      <div class="public-mobile-sidebar-header">
        <div class="logo">
          <img src="/images/logo_black240.png" alt="EDUCADO" class="logo-img">
          <span class="logo-text">EDUCADO</span>
        </div>
        <button class="public-mobile-sidebar-close" type="button" aria-label="${t('common.closeMenu')}">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#4e6879" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></svg>
        </button>
      </div>

      <nav class="public-mobile-sidebar-nav">
        ${navLinks
          .map(
            (link) =>
              `<a href="${link.href}" class="public-mobile-sidebar-link${currentPath === link.href ? ' is-active' : ''}">${t(link.key)}</a>`
          )
          .join('')}
      </nav>

      <div class="public-mobile-sidebar-divider"></div>

      <div class="public-mobile-sidebar-actions">
        <a href="${routes.auth}" class="public-mobile-sidebar-login">${t('publicNav.login')}</a>
        <a href="${routes.auth}" class="public-mobile-sidebar-register">${t('publicNav.register')}</a>
      </div>
    </aside>
  `
  document.body.appendChild(overlay)

  const openSidebar = () => {
    overlay.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }

  const closeSidebar = () => {
    overlay.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  hamburger.addEventListener('click', openSidebar)
  overlay.querySelector('.public-mobile-sidebar-close')?.addEventListener('click', closeSidebar)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSidebar()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeSidebar()
    }
  })

  // Close sidebar if window resizes past mobile breakpoint
  const onResize = () => {
    if (window.innerWidth > 768 && overlay.classList.contains('is-open')) {
      closeSidebar()
    }
  }
  window.addEventListener('resize', onResize)
}
