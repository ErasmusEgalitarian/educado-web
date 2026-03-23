import { t } from '@/shared/i18n'

export type MobileTab = 'my-courses' | 'explore' | 'profile'

const SVG_MY_COURSES = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
const SVG_EXPLORE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
const SVG_PROFILE = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`

export function renderMobileLayout(
  container: HTMLElement,
  activeTab: MobileTab,
  contentHtml: string
) {
  container.innerHTML = `
    <div class="mobile-app">
      <div class="mobile-content" id="mobile-page-content">
        ${contentHtml}
      </div>
      <nav class="mobile-bottom-nav">
        <a href="/student/my-courses" class="mobile-nav-item${activeTab === 'my-courses' ? ' active' : ''}" data-tab="my-courses">
          ${SVG_MY_COURSES}
          <span>${t('student.nav.myCourses')}</span>
        </a>
        <a href="/student/explore" class="mobile-nav-item${activeTab === 'explore' ? ' active' : ''}" data-tab="explore">
          ${SVG_EXPLORE}
          <span>${t('student.nav.explore')}</span>
        </a>
        <a href="/student/profile" class="mobile-nav-item${activeTab === 'profile' ? ' active' : ''}" data-tab="profile">
          ${SVG_PROFILE}
          <span>${t('student.nav.profile')}</span>
        </a>
      </nav>
    </div>
  `

  // Handle nav clicks with SPA navigation
  container.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      const href = (item as HTMLAnchorElement).href
      if (href && window.location.href !== href) {
        window.location.assign(new URL(href).pathname)
      }
    })
  })
}

export function getMobilePageContent(): HTMLElement | null {
  return document.getElementById('mobile-page-content')
}
