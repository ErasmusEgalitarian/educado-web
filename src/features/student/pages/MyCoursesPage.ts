import { t } from '@/shared/i18n'
import { renderMobileLayout } from '../components/MobileLayout'
import { studentApi, Enrollment } from '../api/student.api'
import { getAccessToken } from '@/shared/api/auth-session'
import { routes } from '@/app/routes'

export async function renderMyCoursesPage(container: HTMLElement) {
  let activeTab: 'in-progress' | 'completed' = 'in-progress'
  let enrollments: Enrollment[] = []
  let gamification: { totalPoints: number; currentLevel: number; levelName: string; xpProgress: number; xpNeeded: number; currentStreak: number } | null = null

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'
  const token = getAccessToken() ?? ''

  const getImageUrl = (mediaId: string) =>
    `${baseUrl}/media/${mediaId}/stream?token=${token}`

  const render = () => {
    const filtered = enrollments.filter(e =>
      activeTab === 'in-progress' ? e.status === 'ACTIVE' : e.status === 'COMPLETED'
    )

    const welcomeHtml = gamification ? `
      <div style="padding: 16px 24px;">
        <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #628397;">
          ${gamification.levelName} · ${gamification.totalPoints} ${t('student.myCourses.points')}
        </div>
      </div>
    ` : ''

    const tabsHtml = `
      <div class="mobile-tabs">
        <button class="mobile-tab${activeTab === 'in-progress' ? ' active' : ''}" data-tab="in-progress">${t('student.myCourses.inProgress')}</button>
        <button class="mobile-tab${activeTab === 'completed' ? ' active' : ''}" data-tab="completed">${t('student.myCourses.completed')}</button>
      </div>
    `

    const coursesHtml = filtered.length === 0 ? `
      <div class="mobile-empty-state">
        <div class="mobile-empty-state-title">${t('student.myCourses.emptyTitle')}</div>
        <div class="mobile-empty-state-text">${t('student.myCourses.emptyText')}</div>
        <button class="mobile-btn mobile-btn-primary" style="width: auto; padding: 0 32px;" id="go-explore-btn">${t('student.myCourses.exploreCourses')}</button>
      </div>
    ` : filtered.map(e => `
      <a href="${routes.studentCourseDetail}?id=${e.courseId}" class="mobile-course-card" data-course-id="${e.courseId}" style="text-decoration: none; display: block;">
        ${e.course?.imageMediaId ? `<img class="mobile-course-card-img" src="${getImageUrl(e.course.imageMediaId)}" alt="${e.course?.title ?? ''}">` : '<div class="mobile-course-card-img"></div>'}
        <div class="mobile-course-card-body">
          <div class="mobile-course-card-title">${e.course?.title ?? ''}</div>
          <div class="mobile-course-card-meta">
            <span class="mobile-course-card-meta-item">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 10h8M3 2h6v6H3z"/></svg>
              ${e.course?.category ?? ''}
            </span>
            <span class="mobile-course-card-meta-item">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="5"/><path d="M6 3v3l2 1"/></svg>
              ${e.course?.estimatedTime ?? ''}
            </span>
          </div>
          <div class="mobile-course-card-progress">
            <div class="mobile-progress-bar" style="flex: 1;">
              <div class="mobile-progress-bar-fill" style="width: ${e.progressPercent}%;"></div>
            </div>
            <span class="mobile-course-card-progress-text">${e.progressPercent}% ${t('student.myCourses.percentComplete')}</span>
          </div>
        </div>
      </a>
    `).join('')

    const contentHtml = `
      <div style="padding: 16px 24px 0;">
        <h1 style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 20px; color: #141b1f; margin: 0;">${t('student.myCourses.title')}</h1>
      </div>
      ${welcomeHtml}
      <div style="padding: 0 24px;">
        ${tabsHtml}
        ${coursesHtml}
      </div>
    `

    renderMobileLayout(container, 'my-courses', contentHtml)
    bindEvents()
  }

  const bindEvents = () => {
    container.querySelectorAll('.mobile-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = (tab as HTMLElement).dataset.tab as 'in-progress' | 'completed'
        render()
      })
    })

    container.querySelector('#go-explore-btn')?.addEventListener('click', () => {
      window.location.assign(routes.studentExplore)
    })

    container.querySelectorAll('.mobile-course-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault()
        const courseId = (card as HTMLElement).dataset.courseId
        window.location.assign(`${routes.studentCourseDetail}?id=${courseId}`)
      })
    })
  }

  // Load data
  try {
    const [enrollData, gamData] = await Promise.all([
      studentApi.listEnrollments(),
      studentApi.getGamificationSummary().catch(() => null),
    ])
    enrollments = enrollData.enrollments
    gamification = gamData
  } catch {
    enrollments = []
  }

  render()
}
