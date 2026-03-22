import { t } from '@/shared/i18n'
import { renderMobileLayout } from '../components/MobileLayout'
import { studentApi, StudentProfile } from '../api/student.api'
import { getAccessToken } from '@/shared/api/auth-session'
import { routes } from '@/app/routes'
import { toast } from '@/shared/ui/toast'

export async function renderStudentEditProfilePage(container: HTMLElement) {
  let profile: StudentProfile | null = null
  let firstName = ''
  let lastName = ''
  let email = ''

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'
  const token = getAccessToken() ?? ''
  const getImageUrl = (mediaId: string) =>
    `${baseUrl}/media/${mediaId}/stream?token=${token}`

  const render = () => {
    const initials = profile
      ? `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()
      : 'UN'

    const avatarHtml = profile?.avatarMediaId
      ? `<img src="${getImageUrl(profile.avatarMediaId)}" alt="" style="width: 100%; height: 100%; object-fit: cover;">`
      : `<span>${initials}</span>`

    const contentHtml = `
      <div style="padding: 24px 32px;">
        <div class="mobile-page-header" style="padding: 0 0 24px;">
          <button class="back-btn" id="back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28363e" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span class="mobile-page-title">${t('student.profile.editProfile')}</span>
          <div style="width: 24px;"></div>
        </div>

        <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 32px;">
          <div class="mobile-avatar" style="width: 80px; height: 80px; font-size: 28px;">${avatarHtml}</div>
          <div>
            <button class="mobile-btn mobile-btn-secondary" style="width: auto; height: 38px; padding: 0 24px; font-size: 13px; margin-bottom: 8px;">${t('student.profile.changePhoto')}</button>
            <div style="font-size: 11px; color: #d62b25; cursor: pointer; text-align: center;">${t('student.profile.removePhoto')}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div class="mobile-input-group">
            <label class="mobile-input-label">${t('student.profile.firstName')}</label>
            <input class="mobile-input" type="text" id="edit-firstName" value="${firstName}">
          </div>
          <div class="mobile-input-group">
            <label class="mobile-input-label">${t('student.profile.lastName')}</label>
            <input class="mobile-input" type="text" id="edit-lastName" value="${lastName}">
          </div>
          <div class="mobile-input-group">
            <label class="mobile-input-label">${t('student.profile.email')}</label>
            <input class="mobile-input" type="email" id="edit-email" value="${email}">
          </div>
        </div>

        <div style="margin-top: 32px;">
          <button class="mobile-btn mobile-btn-primary" id="save-profile-btn">${t('student.profile.save')}</button>
          <div style="text-align: center; margin-top: 16px;">
            <button class="mobile-btn-danger" id="delete-account-btn">${t('student.profile.deleteAccount')}</button>
          </div>
        </div>
      </div>
    `

    renderMobileLayout(container, 'profile', contentHtml)
    bindEvents()
  }

  const bindEvents = () => {
    container.querySelector('#back-btn')?.addEventListener('click', () => {
      window.location.assign(routes.studentProfile)
    })

    container.querySelector('#save-profile-btn')?.addEventListener('click', async () => {
      const fn = (container.querySelector('#edit-firstName') as HTMLInputElement)?.value
      const ln = (container.querySelector('#edit-lastName') as HTMLInputElement)?.value
      const em = (container.querySelector('#edit-email') as HTMLInputElement)?.value

      try {
        await studentApi.updateProfile({
          firstName: fn,
          lastName: ln,
          email: em || undefined,
        })
        toast(t('student.profile.save'), 'success')
        window.location.assign(routes.studentProfile)
      } catch {
        toast('Error', 'error')
      }
    })

    container.querySelector('#delete-account-btn')?.addEventListener('click', async () => {
      if (confirm(t('student.profile.deleteAccount') + '?')) {
        try {
          await studentApi.deleteAccount()
          window.location.assign('/student/register')
        } catch {
          toast('Error', 'error')
        }
      }
    })
  }

  try {
    profile = await studentApi.getProfile()
    firstName = profile.firstName
    lastName = profile.lastName
    email = profile.email ?? ''
  } catch {
    profile = null
  }

  render()
}
