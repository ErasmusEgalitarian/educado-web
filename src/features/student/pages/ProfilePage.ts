import { t } from '@/shared/i18n'
import { renderMobileLayout } from '../components/MobileLayout'
import { studentApi, StudentProfile, GamificationSummary } from '../api/student.api'
import { clearAccessToken, getAccessToken } from '@/shared/api/auth-session'
import { routes } from '@/app/routes'

export async function renderProfilePage(container: HTMLElement) {
  let profile: StudentProfile | null = null
  let gamification: GamificationSummary | null = null

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'
  const token = getAccessToken() ?? ''
  const getImageUrl = (mediaId: string) =>
    `${baseUrl}/media/${mediaId}/stream?token=${token}`

  const render = () => {
    const initials = profile
      ? `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()
      : 'UN'
    const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : ''

    const avatarHtml = profile?.avatarMediaId
      ? `<img src="${getImageUrl(profile.avatarMediaId)}" alt="${fullName}">`
      : `<span>${initials}</span>`

    const statsHtml = gamification ? `
      <div class="mobile-stats-card" style="margin-top: 16px;">
        <div class="mobile-stat-item">
          <div class="mobile-stat-value">🔥</div>
          <div class="mobile-stat-label">${gamification.currentStreak} ${gamification.currentStreak === 1 ? t('student.profile.consecutiveDays') : t('student.profile.consecutiveDaysPlural')}</div>
        </div>
        <div class="mobile-stat-item">
          <div class="mobile-stat-value">⭐</div>
          <div class="mobile-stat-label">${gamification.totalPoints} ${t('student.myCourses.points')}</div>
        </div>
        <div class="mobile-stat-item">
          <div class="mobile-stat-value">🏆</div>
          <div class="mobile-stat-label">${t('student.profile.position')}</div>
        </div>
      </div>
      <div class="mobile-level-bar">
        <span class="mobile-level-label">${t('student.profile.level')} ${gamification.currentLevel}</span>
        <div class="mobile-progress-bar" style="flex: 1;">
          <div class="mobile-progress-bar-fill" style="width: ${gamification.xpNeeded > 0 ? Math.round((gamification.xpProgress / gamification.xpNeeded) * 100) : 0}%;"></div>
        </div>
      </div>
    ` : ''

    const menuItems = [
      { label: t('student.profile.editProfile'), href: routes.studentEditProfile },
      { label: t('student.profile.certificates'), href: routes.studentCertificates },
      { label: t('student.profile.ranking'), href: routes.studentLeaderboard },
      { label: t('student.profile.downloads'), href: routes.studentDownloads },
      { label: t('student.profile.changePassword'), href: '#' },
    ]

    const menuHtml = menuItems.map(item => `
      <a class="mobile-profile-menu-item" href="${item.href}">
        <span>${item.label}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#628397" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </a>
    `).join('')

    const contentHtml = `
      <div style="padding: 24px 32px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="mobile-avatar">${avatarHtml}</div>
          <div>
            <div style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 16px; color: #141b1f;">${fullName}</div>
            ${profile?.email ? `<div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #628397; margin-top: 2px;">${profile.email}</div>` : ''}
          </div>
        </div>
        ${statsHtml}
        <div style="margin-top: 16px;">
          ${menuHtml}
        </div>
        <div style="text-align: center; margin-top: 32px;">
          <button id="profile-logout-btn" style="background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; color: #d62b25; font-family: 'Inter', sans-serif; font-size: 15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            ${t('student.profile.logout')}
          </button>
        </div>
      </div>
    `

    renderMobileLayout(container, 'profile', contentHtml)
    bindEvents()
  }

  const bindEvents = () => {
    container.querySelector('#profile-logout-btn')?.addEventListener('click', () => {
      clearAccessToken()
      window.location.assign('/student/register')
    })

    container.querySelectorAll('.mobile-profile-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        const href = (item as HTMLAnchorElement).getAttribute('href')
        if (href && href !== '#') {
          window.location.assign(href)
        }
      })
    })
  }

  try {
    const [profileData, gamData] = await Promise.all([
      studentApi.getProfile(),
      studentApi.getGamificationSummary().catch(() => null),
    ])
    profile = profileData
    gamification = gamData
  } catch {
    profile = null
  }

  render()
}
