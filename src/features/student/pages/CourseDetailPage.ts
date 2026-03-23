import { t } from '@/shared/i18n'
import { renderMobileLayout } from '../components/MobileLayout'
import { studentApi, EnrollmentDetail, CatalogCourseDetail } from '../api/student.api'
import { getAccessToken } from '@/shared/api/auth-session'
import { routes } from '@/app/routes'
import { toast } from '@/shared/ui/toast'

export async function renderCourseDetailPage(container: HTMLElement) {
  const params = new URLSearchParams(window.location.search)
  const courseId = params.get('id') ?? ''

  let enrollmentDetail: EnrollmentDetail | null = null
  let catalogDetail: CatalogCourseDetail | null = null
  let isEnrolled = false

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'
  const token = getAccessToken() ?? ''
  const getImageUrl = (mediaId: string) =>
    `${baseUrl}/media/${mediaId}/stream?token=${token}`

  const getSectionIcon = (status: string) => {
    if (status === 'completed') return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`
    if (status === 'in_progress') return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#35a1b1" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0b4c0" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`
  }

  const render = () => {
    const course = enrollmentDetail?.course ?? catalogDetail
    if (!course) return

    const imageMediaId = 'imageMediaId' in course ? (course as { imageMediaId: string }).imageMediaId : ''
    const progressPercent = enrollmentDetail?.progressPercent ?? 0
    const sections = enrollmentDetail?.sections ?? catalogDetail?.sections?.map(s => ({ ...s, status: 'locked' as const, videoMediaId: null, score: null, totalQuestions: null })) ?? []

    const headerImageHtml = imageMediaId
      ? `<div style="width: 100%; height: 203px; background: url('${getImageUrl(imageMediaId)}') center/cover; position: relative;">
          <button id="course-back-btn" style="position: absolute; top: 16px; left: 16px; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.8); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28363e" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>`
      : `<div style="width: 100%; height: 203px; background: #e8edf0; position: relative;">
          <button id="course-back-btn" style="position: absolute; top: 16px; left: 16px; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.8); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28363e" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>`

    const courseInfoHtml = `
      <div style="background: #fff; border-radius: 16px; margin: -40px 24px 0; position: relative; z-index: 1; padding: 16px; border: 1px solid #e8edf0;">
        <div style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 14px; color: #28363e;">${course.title}</div>
        <div class="mobile-divider" style="margin: 8px 0;"></div>
        ${isEnrolled ? `
          <div class="mobile-progress-bar" style="margin-bottom: 4px;">
            <div class="mobile-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="mobile-divider" style="margin: 4px 0;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #628397;">${progressPercent}% ${t('student.myCourses.percentComplete')}</span>
          </div>
        ` : ''}
      </div>
    `

    const actionBtnHtml = isEnrolled
      ? `<button class="mobile-btn mobile-btn-primary" id="continue-course-btn" style="margin: 16px 24px; width: calc(100% - 48px);">${t('student.myCourses.continueCourse')}</button>`
      : `<button class="mobile-btn mobile-btn-primary" id="enroll-btn" style="margin: 16px 24px; width: calc(100% - 48px);">${t('student.explore.enrollNow')}</button>`

    const sectionsHtml = sections.map(s => `
      <div class="mobile-section-item" data-section-id="${s.id}" data-status="${s.status}">
        <div class="mobile-section-icon ${s.status}">${getSectionIcon(s.status)}</div>
        <div class="mobile-section-info">
          <div class="mobile-section-title">${s.title}</div>
          ${s.duration ? `<div class="mobile-section-meta">${Math.round(s.duration / 60)} min</div>` : ''}
        </div>
        ${s.status !== 'locked' ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#35a1b1" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>` : ''}
      </div>
    `).join('')

    const dropHtml = isEnrolled ? `
      <div style="text-align: center; padding: 16px 24px;">
        <button id="drop-course-btn" style="background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 15px; color: #d62b25; text-decoration: underline;">${t('student.myCourses.dropCourse')}</button>
      </div>
    ` : ''

    const contentHtml = `
      ${headerImageHtml}
      ${courseInfoHtml}
      ${actionBtnHtml}
      <div style="padding: 0 24px;">
        ${sectionsHtml}
      </div>
      ${dropHtml}
    `

    renderMobileLayout(container, 'my-courses', contentHtml)
    bindEvents()
  }

  const bindEvents = () => {
    container.querySelector('#course-back-btn')?.addEventListener('click', () => {
      window.location.assign(routes.studentMyCourses)
    })

    container.querySelector('#enroll-btn')?.addEventListener('click', async () => {
      try {
        await studentApi.enroll(courseId)
        toast(t('student.explore.enrolled'), 'success')
        // Reload with enrollment data
        enrollmentDetail = await studentApi.getEnrollmentDetail(courseId)
        isEnrolled = true
        render()
      } catch {
        toast('Error', 'error')
      }
    })

    container.querySelector('#drop-course-btn')?.addEventListener('click', async () => {
      try {
        await studentApi.dropEnrollment(courseId)
        toast(t('student.myCourses.dropCourse'), 'success')
        window.location.assign(routes.studentMyCourses)
      } catch {
        toast('Error', 'error')
      }
    })
  }

  // Load data
  try {
    enrollmentDetail = await studentApi.getEnrollmentDetail(courseId)
    isEnrolled = true
  } catch {
    try {
      catalogDetail = await studentApi.getCourseDetail(courseId)
      isEnrolled = false
    } catch {
      // Course not found
    }
  }

  render()
}
