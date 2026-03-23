import { t } from '@/shared/i18n'
import { studentApi } from '../api/student.api'
import { setAccessToken } from '@/shared/api/auth-session'
import { routes } from '@/app/routes'
import { toast } from '@/shared/ui/toast'

export function renderStudentRegisterPage(container: HTMLElement) {
  let firstName = ''
  let lastName = ''
  let email = ''
  let phone = ''
  let dateOfBirth = ''
  let isSubmitting = false

  const render = () => {
    container.innerHTML = `
      <div class="mobile-app" style="justify-content: center; padding: 32px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="/images/logo_black240.png" alt="EDUCADO" style="height: 32px;">
          <h1 style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 24px; color: #141b1f; margin: 16px 0 8px;">${t('student.register.title')}</h1>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="mobile-input-group">
            <label class="mobile-input-label">${t('student.register.firstName')} *</label>
            <input class="mobile-input" type="text" id="reg-firstName" value="${firstName}" required>
          </div>
          <div class="mobile-input-group">
            <label class="mobile-input-label">${t('student.register.lastName')} *</label>
            <input class="mobile-input" type="text" id="reg-lastName" value="${lastName}" required>
          </div>
          <div class="mobile-input-group">
            <label class="mobile-input-label">${t('student.register.email')}</label>
            <input class="mobile-input" type="email" id="reg-email" value="${email}">
          </div>
          <div class="mobile-input-group">
            <label class="mobile-input-label">${t('student.register.phone')}</label>
            <input class="mobile-input" type="tel" id="reg-phone" value="${phone}">
          </div>
          <div class="mobile-input-group">
            <label class="mobile-input-label">${t('student.register.dateOfBirth')}</label>
            <input class="mobile-input" type="date" id="reg-dob" value="${dateOfBirth}">
          </div>
        </div>

        <button class="mobile-btn mobile-btn-primary" id="register-btn" style="margin-top: 24px;" ${isSubmitting ? 'disabled' : ''}>${t('student.register.createAccount')}</button>
      </div>
    `
    bindEvents()
  }

  const bindEvents = () => {
    container.querySelector('#register-btn')?.addEventListener('click', async () => {
      firstName = (container.querySelector('#reg-firstName') as HTMLInputElement)?.value ?? ''
      lastName = (container.querySelector('#reg-lastName') as HTMLInputElement)?.value ?? ''
      email = (container.querySelector('#reg-email') as HTMLInputElement)?.value ?? ''
      phone = (container.querySelector('#reg-phone') as HTMLInputElement)?.value ?? ''
      dateOfBirth = (container.querySelector('#reg-dob') as HTMLInputElement)?.value ?? ''

      if (!firstName || !lastName) {
        toast(t('student.register.firstName'), 'error')
        return
      }

      isSubmitting = true
      render()

      try {
        const result = await studentApi.register({
          firstName,
          lastName,
          email: email || undefined,
          phone: phone || undefined,
          dateOfBirth: dateOfBirth || undefined,
          deviceId: getDeviceId(),
        })
        setAccessToken(result.accessToken)
        window.location.assign(routes.studentMyCourses)
      } catch {
        toast('Error', 'error')
        isSubmitting = false
        render()
      }
    })
  }

  render()
}

function getDeviceId(): string {
  const key = 'educado.deviceId'
  let deviceId = localStorage.getItem(key)
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem(key, deviceId)
  }
  return deviceId
}
