import { t } from '@/shared/i18n'
import { renderMobileLayout } from '../components/MobileLayout'
import { studentApi, CertificateItem } from '../api/student.api'
import { getAccessToken } from '@/shared/api/auth-session'
import { routes } from '@/app/routes'

export async function renderCertificatesPage(container: HTMLElement) {
  let certificates: CertificateItem[] = []

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'
  const token = getAccessToken() ?? ''
  const getImageUrl = (mediaId: string) =>
    `${baseUrl}/media/${mediaId}/stream?token=${token}`

  const render = () => {
    const headerHtml = `
      <div class="mobile-page-header">
        <button class="back-btn" id="back-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28363e" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span class="mobile-page-title">${t('student.certificates.title')}</span>
        <div style="width: 24px;"></div>
      </div>
    `

    const bodyHtml = certificates.length === 0 ? `
      <div class="mobile-empty-state" style="padding-top: 80px;">
        <div style="width: 104px; height: 105px; background: #e8edf0; border-radius: 16px;"></div>
        <div class="mobile-empty-state-title">${t('student.certificates.emptyTitle')}</div>
        <div class="mobile-empty-state-text">${t('student.certificates.emptyText')}</div>
        <button class="mobile-btn mobile-btn-primary" style="width: auto; padding: 0 32px;" id="go-courses-btn">${t('student.certificates.goToCourses')}</button>
      </div>
    ` : `
      <div style="padding: 0 24px;">
        ${certificates.map(cert => {
          const imgSrc = cert.course?.imageMediaId ? getImageUrl(cert.course.imageMediaId) : ''
          const dateStr = new Date(cert.completedAt).toLocaleDateString('pt-BR')
          return `
            <div class="mobile-certificate-card">
              ${imgSrc ? `<img class="mobile-certificate-card-img" src="${imgSrc}" alt="">` : '<div class="mobile-certificate-card-img"></div>'}
              <div class="mobile-certificate-card-body">
                <div class="mobile-certificate-card-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#35a1b1" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  ${cert.courseName}
                </div>
                <div class="mobile-course-card-meta">
                  <span class="mobile-course-card-meta-item">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 10h8M3 2h6v6H3z"/></svg>
                    ${cert.course?.title ?? ''}
                  </span>
                  <span class="mobile-course-card-meta-item">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="1" width="8" height="10" rx="1"/><path d="M5 4h2M4 6h4"/></svg>
                    ${dateStr}
                  </span>
                </div>
                <div class="mobile-certificate-card-action">
                  <a href="${baseUrl}${studentApi.getCertificatePdfUrl(cert.id)}?token=${token}" target="_blank">
                    ${t('student.certificates.view')}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </a>
                </div>
              </div>
            </div>
          `
        }).join('')}
      </div>
    `

    const contentHtml = `${headerHtml}${bodyHtml}`
    renderMobileLayout(container, 'profile', contentHtml)
    bindEvents()
  }

  const bindEvents = () => {
    container.querySelector('#back-btn')?.addEventListener('click', () => {
      window.location.assign(routes.studentProfile)
    })
    container.querySelector('#go-courses-btn')?.addEventListener('click', () => {
      window.location.assign(routes.studentExplore)
    })
  }

  try {
    const data = await studentApi.listCertificates()
    certificates = data.certificates
  } catch {
    certificates = []
  }

  render()
}
