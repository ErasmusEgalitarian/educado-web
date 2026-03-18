import { clearAccessToken, getAccessToken, getCurrentUser, setCurrentUser } from '@/shared/api/auth-session'
import { authApi } from '@/features/auth/api/auth.api'
import { mediaApi } from '@/features/media/api/media.api'
import { routes } from '@/app/routes'
import { toast } from '@/shared/ui/toast'
import { getLanguage, t } from '@/shared/i18n'
import flatpickr from 'flatpickr'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import { Portuguese } from 'flatpickr/dist/l10n/pt'
import 'flatpickr/dist/flatpickr.min.css'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import '../styles/edit-profile.css'
import '../styles/password-reset.css'
import { PasswordResetFlow } from '@/features/auth/components/PasswordResetFlow'

type SectionKey = 'personal' | 'academic' | 'professional'

const chevronSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const personSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/></svg>`
const deleteSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4.667L4 12.667C4 13.403 4.597 14 5.333 14H10.667C11.403 14 12 13.403 12 12.667V4.667M6 4.667V3.333C6 2.597 6.597 2 7.333 2H8.667C9.403 2 10 2.597 10 3.333V4.667M3.333 4.667H12.667" stroke="#d62b25" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const plusSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#28363e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const closeSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

interface AcademicEntry {
  educationLevel: string
  status: string
  course: string
  institution: string
  startDate: string
  endDate: string
}

interface ProfessionalEntry {
  company: string
  role: string
  startDate: string
  endDate: string
  isCurrentJob: boolean
  activities: string
}

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
}

function createAcademicEntry(): AcademicEntry {
  return { educationLevel: '', status: '', course: '', institution: '', startDate: '', endDate: '' }
}

function createProfessionalEntry(): ProfessionalEntry {
  return { company: '', role: '', startDate: '', endDate: '', isCurrentJob: false, activities: '' }
}

interface EditProfilePageOptions {
  onNavigateHome?: () => void
}

export async function renderEditProfilePage(root: HTMLElement, options?: EditProfilePageOptions) {
  const maybeUser = getCurrentUser()
  if (!maybeUser) {
    window.location.assign('/')
    return
  }
  const user = maybeUser

  let activeSection: SectionKey | null = 'personal'
  let isDeleteModalOpen = false
  let isAvatarModalOpen = false
  let isLoading = true
  let avatarMediaId: string | null = user.avatarMediaId ?? null
  const maxBioLength = 400
  const maxActivitiesLength = 400
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'

  const values: FormValues = {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    phone: '',
    bio: '',
  }

  let academicEntries: AcademicEntry[] = [createAcademicEntry()]
  let professionalEntries: ProfessionalEntry[] = [createProfessionalEntry()]

  const escapeHtml = (raw: string) =>
    raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

  const getInitials = () => `${values.firstName[0] ?? ''}${values.lastName[0] ?? ''}`.toUpperCase()

  const parseMonthYear = (value: string): Date | null => {
    const match = /^(\d{2})\/(\d{4})$/.exec(value.trim())
    if (!match) return null
    const month = Number(match[1])
    const year = Number(match[2])
    if (month < 1 || month > 12) return null
    return new Date(year, month - 1, 1)
  }

  const toNextMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 1)

  const buildAcademicSummary = () =>
    academicEntries
      .map((e, i) => `${t('editProfilePage.academicEntry')} ${i + 1}: ${e.educationLevel} | ${e.status} | ${e.course} | ${e.institution} | ${e.startDate} - ${e.endDate}`)
      .join('\n')

  const buildProfessionalSummary = () =>
    professionalEntries
      .map((e, i) => {
        const endDate = e.isCurrentJob ? t('editProfilePage.currentJob') : e.endDate
        return `${t('editProfilePage.professionalEntry')} ${i + 1}: ${e.company} | ${e.role} | ${e.startDate} - ${endDate} | ${e.activities}`
      })
      .join('\n')

  // ── Parsers for pre-filling data ──
  function parseAcademicSummary(text: string): AcademicEntry[] {
    if (!text.trim()) return []
    const lines = text.split('\n').filter(l => l.trim())
    const entries: AcademicEntry[] = []
    for (const line of lines) {
      const colonIdx = line.indexOf(':')
      if (colonIdx === -1) continue
      const parts = line.slice(colonIdx + 1).split('|').map(p => p.trim())
      if (parts.length < 4) continue
      const datePart = parts[4] ?? ''
      const [startDate = '', endDate = ''] = datePart.split('-').map(d => d.trim())
      entries.push({
        educationLevel: parts[0] ?? '',
        status: parts[1] ?? '',
        course: parts[2] ?? '',
        institution: parts[3] ?? '',
        startDate,
        endDate,
      })
    }
    return entries
  }

  function parseProfessionalSummary(text: string): ProfessionalEntry[] {
    if (!text.trim()) return []
    const lines = text.split('\n').filter(l => l.trim())
    const entries: ProfessionalEntry[] = []
    for (const line of lines) {
      const colonIdx = line.indexOf(':')
      if (colonIdx === -1) continue
      const parts = line.slice(colonIdx + 1).split('|').map(p => p.trim())
      if (parts.length < 3) continue
      const datePart = parts[2] ?? ''
      const [startDate = '', endDateRaw = ''] = datePart.split('-').map(d => d.trim())
      const currentJobLabel = t('editProfilePage.currentJob')
      const isCurrentJob = endDateRaw === currentJobLabel
      entries.push({
        company: parts[0] ?? '',
        role: parts[1] ?? '',
        startDate,
        endDate: isCurrentJob ? '' : endDateRaw,
        isCurrentJob,
        activities: parts[3] ?? '',
      })
    }
    return entries
  }

  // ── Load profile from API ──
  try {
    const profile = await authApi.getMyProfile()
    values.firstName = profile.firstName
    values.lastName = profile.lastName
    values.email = profile.email
    if (profile.motivations) values.bio = profile.motivations
    if (profile.avatarMediaId) avatarMediaId = profile.avatarMediaId

    if (profile.academicBackground) {
      const parsed = parseAcademicSummary(profile.academicBackground)
      if (parsed.length > 0) academicEntries = parsed
    }
    if (profile.professionalExperience) {
      const parsed = parseProfessionalSummary(profile.professionalExperience)
      if (parsed.length > 0) professionalEntries = parsed
    }
  } catch {
    // Fallback to localStorage user data
  }
  isLoading = false

  function navigateHome() {
    if (options?.onNavigateHome) {
      options.onNavigateHome()
    } else {
      window.location.assign(routes.home)
    }
  }

  // ── Sync form values before re-render ──
  function syncFormValues() {
    const firstName = (document.getElementById('ep-firstName') as HTMLInputElement)?.value
    const lastName = (document.getElementById('ep-lastName') as HTMLInputElement)?.value
    const email = (document.getElementById('ep-email') as HTMLInputElement)?.value
    const phone = (document.getElementById('ep-phone') as HTMLInputElement)?.value
    const bio = (document.getElementById('ep-bio') as HTMLTextAreaElement)?.value

    if (firstName !== undefined) values.firstName = firstName
    if (lastName !== undefined) values.lastName = lastName
    if (email !== undefined) values.email = email
    if (phone !== undefined) values.phone = phone
    if (bio !== undefined) values.bio = bio

    academicEntries.forEach((entry, i) => {
      const level = (document.querySelector(`[data-ep-academic="${i}"][data-field="educationLevel"]`) as HTMLSelectElement)?.value
      const status = (document.querySelector(`[data-ep-academic="${i}"][data-field="status"]`) as HTMLSelectElement)?.value
      const course = (document.querySelector(`[data-ep-academic="${i}"][data-field="course"]`) as HTMLInputElement)?.value
      const institution = (document.querySelector(`[data-ep-academic="${i}"][data-field="institution"]`) as HTMLInputElement)?.value
      const startDate = (document.querySelector(`[data-ep-academic="${i}"][data-field="startDate"]`) as HTMLInputElement)?.value
      const endDate = (document.querySelector(`[data-ep-academic="${i}"][data-field="endDate"]`) as HTMLInputElement)?.value

      if (level !== undefined) entry.educationLevel = level
      if (status !== undefined) entry.status = status
      if (course !== undefined) entry.course = course
      if (institution !== undefined) entry.institution = institution
      if (startDate !== undefined) entry.startDate = startDate
      if (endDate !== undefined) entry.endDate = endDate
    })

    professionalEntries.forEach((entry, i) => {
      const company = (document.querySelector(`[data-ep-professional="${i}"][data-field="company"]`) as HTMLInputElement)?.value
      const role = (document.querySelector(`[data-ep-professional="${i}"][data-field="role"]`) as HTMLInputElement)?.value
      const startDate = (document.querySelector(`[data-ep-professional="${i}"][data-field="startDate"]`) as HTMLInputElement)?.value
      const endDate = (document.querySelector(`[data-ep-professional="${i}"][data-field="endDate"]`) as HTMLInputElement)?.value
      const activities = (document.querySelector(`[data-ep-professional="${i}"][data-field="activities"]`) as HTMLTextAreaElement)?.value

      if (company !== undefined) entry.company = company
      if (role !== undefined) entry.role = role
      if (startDate !== undefined) entry.startDate = startDate
      if (endDate !== undefined) entry.endDate = endDate
      if (activities !== undefined) entry.activities = activities
    })
  }

  // ── Validation ──
  function validateAndHighlight(): boolean {
    let isValid = true

    // Personal fields
    const requiredPersonalFields = [
      { id: 'ep-firstName', value: values.firstName },
      { id: 'ep-lastName', value: values.lastName },
      { id: 'ep-email', value: values.email },
    ]

    requiredPersonalFields.forEach(({ id, value }) => {
      const input = document.getElementById(id) as HTMLInputElement | null
      const wrapper = input?.closest('.edit-profile-input')
      if (!value.trim()) {
        wrapper?.classList.add('is-invalid')
        isValid = false
      } else {
        wrapper?.classList.remove('is-invalid')
      }
    })

    return isValid
  }

  function clearValidation() {
    root.querySelectorAll('.edit-profile-input.is-invalid').forEach((el) => el.classList.remove('is-invalid'))
  }

  // ── Update header after save ──
  function updateHeaderUserInfo() {
    const fullName = `${values.firstName} ${values.lastName}`.trim()
    const headerStrong = document.querySelector('.header-user-info strong')
    const headerSmall = document.querySelector('.header-user-info small')
    const headerAvatar = document.querySelector('.header-user-avatar')

    if (headerStrong) headerStrong.textContent = fullName
    if (headerSmall) headerSmall.textContent = values.email
    if (headerAvatar) headerAvatar.textContent = getInitials()
  }

  // ── Render ──
  function render() {
    if (isLoading) return

    root.innerHTML = `
      <div class="edit-profile-page">
        <div class="edit-profile-shell">
          <h1 class="edit-profile-title">${t('editProfilePage.title')}</h1>

          <div class="edit-profile-form">
            ${renderPersonalCard()}
            ${renderAcademicCard()}
            ${renderProfessionalCard()}
          </div>

          <div class="edit-profile-actions">
            <button type="button" class="edit-profile-delete-btn" id="ep-delete-btn">${t('editProfilePage.deleteAccount')}</button>
            <div class="edit-profile-actions-right">
              <button type="button" class="edit-profile-cancel-btn" id="ep-cancel-btn">${t('editProfilePage.cancelEdits')}</button>
              <button type="button" class="edit-profile-save-btn" id="ep-save-btn">${t('editProfilePage.saveChanges')}</button>
            </div>
          </div>
        </div>
      </div>

      ${isDeleteModalOpen ? renderDeleteModal() : ''}
      ${isAvatarModalOpen ? renderAvatarModal() : ''}
    `
    bindEvents()
  }

  function renderPersonalCard(): string {
    const isActive = activeSection === 'personal'
    return `
      <div class="edit-profile-card ${isActive ? 'is-expanded' : ''}">
        <button type="button" class="edit-profile-card-header ${isActive ? 'is-active' : ''}" data-section="personal">
          <span class="edit-profile-card-icon">${chevronSvg}</span>
          ${personSvg}
          <span>${t('editProfilePage.personalInfo')}</span>
        </button>
        <div class="edit-profile-card-content ${isActive ? 'is-open' : ''}">
          <div class="edit-profile-avatar-section">
            <div class="edit-profile-avatar">
              ${avatarMediaId
                ? `<img src="${apiBaseUrl}/media/${avatarMediaId}/stream?token=${getAccessToken() ?? ''}" alt="Avatar" class="edit-profile-avatar-img">`
                : `<span>${getInitials()}</span>`
              }
            </div>
            <button type="button" class="edit-profile-change-photo" id="ep-change-photo">${t('editProfilePage.changePhoto')}</button>
          </div>

          <div class="edit-profile-grid">
            <div class="edit-profile-input">
              <label>${t('editProfilePage.firstName')} <span class="required-red">${t('editProfilePage.required')}</span></label>
              <input type="text" id="ep-firstName" value="${escapeHtml(values.firstName)}" placeholder="${t('editProfilePage.firstName')}">
            </div>
            <div class="edit-profile-input">
              <label>${t('editProfilePage.lastName')} <span class="required-red">${t('editProfilePage.required')}</span></label>
              <input type="text" id="ep-lastName" value="${escapeHtml(values.lastName)}" placeholder="${t('editProfilePage.lastName')}">
            </div>
          </div>

          <div class="edit-profile-grid">
            <div class="edit-profile-input">
              <label>${t('editProfilePage.email')} <span class="required-red">${t('editProfilePage.required')}</span></label>
              <input type="email" id="ep-email" value="${escapeHtml(values.email)}" placeholder="useremail@gmail.com">
            </div>
            <div class="edit-profile-input">
              <label>${t('editProfilePage.phone')} <span class="required-red">${t('editProfilePage.required')}</span></label>
              <input type="tel" id="ep-phone" value="${escapeHtml(values.phone)}" placeholder="${t('editProfilePage.phone')}">
            </div>
          </div>

          <div class="edit-profile-grid">
            <div class="edit-profile-input">
              <label>Senha <span class="required-red">*</span></label>
              <input type="password" value="******" disabled>
            </div>
            <div style="display: flex; align-items: flex-end;">
              <button type="button" class="edit-profile-change-photo" id="ep-change-password">${t('passwordReset.changePassword')}</button>
            </div>
          </div>

          <div class="edit-profile-bio">
            <span class="edit-profile-bio-label">${t('editProfilePage.biography')}</span>
            <textarea id="ep-bio" maxlength="${maxBioLength}" placeholder="${t('editProfilePage.bioPlaceholder')}">${escapeHtml(values.bio)}</textarea>
            <span class="edit-profile-bio-counter" id="ep-bio-counter">${values.bio.length} / ${maxBioLength} ${t('editProfilePage.characters')}</span>
          </div>
        </div>
      </div>
    `
  }

  function renderAcademicCard(): string {
    const isActive = activeSection === 'academic'
    return `
      <div class="edit-profile-card ${isActive ? 'is-expanded' : ''}">
        <button type="button" class="edit-profile-card-header ${isActive ? 'is-active' : ''}" data-section="academic">
          <span class="edit-profile-card-icon">${chevronSvg}</span>
          <span>${t('editProfilePage.academicExperiences')}</span>
        </button>
        <div class="edit-profile-card-content ${isActive ? 'is-open' : ''}">
          ${academicEntries.map((entry, index) => renderAcademicEntry(entry, index)).join('')}
          <div class="edit-profile-separator"></div>
          <button type="button" class="edit-profile-add-btn" data-academic-add>
            ${plusSvg}
            <span>${t('editProfilePage.addEducation')}</span>
          </button>
        </div>
      </div>
    `
  }

  function renderAcademicEntry(entry: AcademicEntry, index: number): string {
    return `
      <div class="edit-profile-entry-block">
        <span class="edit-profile-entry-title">${t('editProfilePage.academicEntry')} ${index + 1}</span>
        <div class="edit-profile-grid">
          <div class="edit-profile-input">
            <label>${t('editProfilePage.education')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <select data-ep-academic="${index}" data-field="educationLevel">
              <option value="">${t('editProfilePage.select')}</option>
              <option value="${t('editProfilePage.levelHigher')}" ${entry.educationLevel === t('editProfilePage.levelHigher') ? 'selected' : ''}>${t('editProfilePage.levelHigher')}</option>
              <option value="${t('editProfilePage.levelPostgraduate')}" ${entry.educationLevel === t('editProfilePage.levelPostgraduate') ? 'selected' : ''}>${t('editProfilePage.levelPostgraduate')}</option>
              <option value="${t('editProfilePage.levelTechnical')}" ${entry.educationLevel === t('editProfilePage.levelTechnical') ? 'selected' : ''}>${t('editProfilePage.levelTechnical')}</option>
            </select>
          </div>
          <div class="edit-profile-input">
            <label>${t('editProfilePage.status')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <select data-ep-academic="${index}" data-field="status">
              <option value="">${t('editProfilePage.select')}</option>
              <option value="${t('editProfilePage.statusInProgress')}" ${entry.status === t('editProfilePage.statusInProgress') ? 'selected' : ''}>${t('editProfilePage.statusInProgress')}</option>
              <option value="${t('editProfilePage.statusCompleted')}" ${entry.status === t('editProfilePage.statusCompleted') ? 'selected' : ''}>${t('editProfilePage.statusCompleted')}</option>
            </select>
          </div>
        </div>
        <div class="edit-profile-grid">
          <div class="edit-profile-input">
            <label>${t('editProfilePage.course')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <input type="text" data-ep-academic="${index}" data-field="course" placeholder="${t('editProfilePage.course')}" value="${escapeHtml(entry.course)}">
          </div>
          <div class="edit-profile-input">
            <label>${t('editProfilePage.institution')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <input type="text" data-ep-academic="${index}" data-field="institution" placeholder="${t('editProfilePage.institution')}" value="${escapeHtml(entry.institution)}">
          </div>
        </div>
        <div class="edit-profile-grid">
          <div class="edit-profile-input">
            <label>${t('editProfilePage.start')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <div class="edit-profile-date-control">
              <input id="ep-acad-start-${index}" class="edit-profile-date-input" data-month-picker="true" data-ep-academic="${index}" data-field="startDate" type="text" placeholder="${t('editProfilePage.monthYear')}" value="${escapeHtml(entry.startDate)}">
              <button type="button" class="edit-profile-date-btn" data-date-open-for="ep-acad-start-${index}" aria-label="${t('editProfilePage.openCalendar')}"></button>
            </div>
          </div>
          <div class="edit-profile-input">
            <label>${t('editProfilePage.end')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <div class="edit-profile-date-control">
              <input id="ep-acad-end-${index}" class="edit-profile-date-input" data-month-picker="true" data-ep-academic="${index}" data-field="endDate" type="text" placeholder="${t('editProfilePage.monthYear')}" value="${escapeHtml(entry.endDate)}">
              <button type="button" class="edit-profile-date-btn" data-date-open-for="ep-acad-end-${index}" aria-label="${t('editProfilePage.openCalendar')}"></button>
            </div>
          </div>
        </div>
        ${academicEntries.length > 1 ? `
          <button type="button" class="edit-profile-remove-btn" data-academic-remove="${index}">
            ${deleteSvg}
            <span>${t('editProfilePage.removeEducation')}</span>
          </button>
        ` : ''}
      </div>
    `
  }

  function renderProfessionalCard(): string {
    const isActive = activeSection === 'professional'
    return `
      <div class="edit-profile-card ${isActive ? 'is-expanded' : ''}">
        <button type="button" class="edit-profile-card-header ${isActive ? 'is-active' : ''}" data-section="professional">
          <span class="edit-profile-card-icon">${chevronSvg}</span>
          <span>${t('editProfilePage.professionalExperiences')}</span>
        </button>
        <div class="edit-profile-card-content ${isActive ? 'is-open' : ''}">
          ${professionalEntries.map((entry, index) => renderProfessionalEntry(entry, index)).join('')}
          <div class="edit-profile-separator"></div>
          <button type="button" class="edit-profile-add-btn" data-professional-add>
            ${plusSvg}
            <span>${t('editProfilePage.addExperience')}</span>
          </button>
        </div>
      </div>
    `
  }

  function renderProfessionalEntry(entry: ProfessionalEntry, index: number): string {
    return `
      <div class="edit-profile-entry-block">
        <span class="edit-profile-entry-title">${t('editProfilePage.professionalEntry')} ${index + 1}</span>
        <div class="edit-profile-grid">
          <div class="edit-profile-input">
            <label>${t('editProfilePage.company')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <input type="text" data-ep-professional="${index}" data-field="company" placeholder="${t('editProfilePage.company')}" value="${escapeHtml(entry.company)}">
          </div>
          <div class="edit-profile-input">
            <label>${t('editProfilePage.role')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <input type="text" data-ep-professional="${index}" data-field="role" placeholder="${t('editProfilePage.role')}" value="${escapeHtml(entry.role)}">
          </div>
        </div>
        <div class="edit-profile-grid">
          <div class="edit-profile-input">
            <label>${t('editProfilePage.start')} <span class="required-red">${t('editProfilePage.required')}</span></label>
            <div class="edit-profile-date-control">
              <input id="ep-prof-start-${index}" class="edit-profile-date-input" data-month-picker="true" data-ep-professional="${index}" data-field="startDate" type="text" placeholder="${t('editProfilePage.monthYear')}" value="${escapeHtml(entry.startDate)}">
              <button type="button" class="edit-profile-date-btn" data-date-open-for="ep-prof-start-${index}" aria-label="${t('editProfilePage.openCalendar')}"></button>
            </div>
          </div>
          <div class="edit-profile-input">
            <label>${t('editProfilePage.end')} ${entry.isCurrentJob ? '' : `<span class="required-red">${t('editProfilePage.required')}</span>`}</label>
            <div class="edit-profile-date-control ${entry.isCurrentJob ? 'is-disabled' : ''}">
              <input id="ep-prof-end-${index}" class="edit-profile-date-input" data-month-picker="true" data-ep-professional="${index}" data-field="endDate" type="text" placeholder="${t('editProfilePage.monthYear')}" value="${escapeHtml(entry.endDate)}" ${entry.isCurrentJob ? 'disabled' : ''}>
              <button type="button" class="edit-profile-date-btn" data-date-open-for="ep-prof-end-${index}" aria-label="${t('editProfilePage.openCalendar')}" ${entry.isCurrentJob ? 'disabled' : ''}></button>
            </div>
            <label class="edit-profile-checkbox">
              <input type="checkbox" data-ep-professional="${index}" data-field="isCurrentJob" ${entry.isCurrentJob ? 'checked' : ''}>
              <span>${t('editProfilePage.currentJob')}</span>
            </label>
          </div>
        </div>
        <div class="edit-profile-bio">
          <span class="edit-profile-bio-label">${t('editProfilePage.activitiesLabel')}</span>
          <textarea data-ep-professional="${index}" data-field="activities" maxlength="${maxActivitiesLength}" placeholder="${t('editProfilePage.activitiesPlaceholder')}">${escapeHtml(entry.activities)}</textarea>
          <span class="edit-profile-bio-counter" data-activities-counter="${index}">${entry.activities.length} / ${maxActivitiesLength} ${t('editProfilePage.characters')}</span>
        </div>
        ${professionalEntries.length > 1 ? `
          <button type="button" class="edit-profile-remove-btn" data-professional-remove="${index}">
            ${deleteSvg}
            <span>${t('editProfilePage.removeExperience')}</span>
          </button>
        ` : ''}
      </div>
    `
  }

  function renderDeleteModal(): string {
    return `
      <div class="edit-profile-modal-overlay" id="ep-delete-overlay">
        <div class="edit-profile-modal">
          <div class="edit-profile-modal-header">
            <h3>${t('editProfilePage.deleteModal.title')}</h3>
            <button type="button" class="edit-profile-modal-close" id="ep-delete-close">${closeSvg}</button>
          </div>
          <p class="edit-profile-modal-message">${t('editProfilePage.deleteModal.message')}</p>
          <div class="edit-profile-modal-actions">
            <button type="button" class="edit-profile-cancel-btn" id="ep-delete-cancel">${t('editProfilePage.deleteModal.cancel')}</button>
            <button type="button" class="edit-profile-modal-danger-btn" id="ep-delete-confirm">${t('editProfilePage.deleteModal.confirm')}</button>
          </div>
        </div>
      </div>
    `
  }

  // Avatar modal state
  let avatarModalMode: 'library' | 'upload' = 'library'
  let avatarLibraryItems: { id: string; title: string; thumbnailUrl: string }[] = []
  let avatarSelectedMediaId: string | null = null
  let avatarSelectedFile: File | null = null
  const avatarPreviewUrls = new Set<string>()

  async function loadAvatarLibrary() {
    const currentUser = getCurrentUser()
    const response = currentUser?.role === 'ADMIN'
      ? await mediaApi.listAdminMedia({ page: 1, limit: 80, kind: 'image' })
      : await mediaApi.listMyMedia({ page: 1, limit: 80, kind: 'image' })

    avatarPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    avatarPreviewUrls.clear()

    avatarLibraryItems = await Promise.all(
      response.items.map(async (item) => {
        const id = item.id ?? item._id ?? item.gridFsId
        const blob = await mediaApi.streamMedia(id)
        const objectUrl = URL.createObjectURL(blob)
        avatarPreviewUrls.add(objectUrl)
        return { id, title: item.title || item.filename, thumbnailUrl: objectUrl }
      })
    )
  }

  function renderAvatarModal(): string {
    const hasSelection = avatarModalMode === 'library' ? Boolean(avatarSelectedMediaId) : Boolean(avatarSelectedFile)
    return `
      <div class="sections-lesson-modal-overlay" id="ep-avatar-overlay" role="dialog" aria-modal="true">
        <div class="sections-lesson-modal-card new-course-media-bank-card">
          <header class="sections-lesson-modal-header">
            <h2>${t('editProfilePage.changePhoto')}</h2>
            <button type="button" id="ep-avatar-close" class="sections-lesson-modal-close" aria-label="Fechar">✕</button>
          </header>

          <div class="new-course-media-bank-tabs">
            <button type="button" id="ep-avatar-tab-library" class="new-course-media-bank-tab ${avatarModalMode === 'library' ? 'is-active' : ''}">Biblioteca</button>
            <button type="button" id="ep-avatar-tab-upload" class="new-course-media-bank-tab ${avatarModalMode === 'upload' ? 'is-active' : ''}">Upload</button>
          </div>

          <div class="sections-lesson-modal-body">
            ${avatarModalMode === 'library' ? `
              <div class="new-course-media-bank-library">
                <div class="new-course-media-bank-grid">
                  ${avatarLibraryItems.length === 0
                    ? '<p class="new-course-media-empty">Nenhuma imagem encontrada na biblioteca.</p>'
                    : avatarLibraryItems.map((item) => `
                        <button type="button" class="new-course-media-item ${avatarSelectedMediaId === item.id ? 'is-selected' : ''}" data-avatar-media-id="${item.id}">
                          <img src="${item.thumbnailUrl}" alt="${escapeHtml(item.title)}">
                          <span>${escapeHtml(item.title)}</span>
                        </button>
                      `).join('')
                  }
                </div>
              </div>
            ` : `
              <div class="new-course-media-bank-upload">
                <label class="new-course-field">
                  <span>Imagem</span>
                  <input id="ep-avatar-file" type="file" accept="image/jpeg,image/png,image/webp">
                </label>
                <label class="new-course-field">
                  <span>Título</span>
                  <input id="ep-avatar-title" type="text" maxlength="50" placeholder="Título da imagem">
                </label>
                <label class="new-course-field">
                  <span>Texto alternativo</span>
                  <input id="ep-avatar-alt" type="text" maxlength="125" placeholder="Descrição breve da imagem">
                </label>
                <label class="new-course-field">
                  <span>Descrição</span>
                  <textarea id="ep-avatar-desc" maxlength="200" placeholder="Descrição da imagem"></textarea>
                </label>
              </div>
            `}
          </div>

          <footer class="sections-lesson-modal-actions new-course-media-bank-actions">
            <button type="button" id="ep-avatar-cancel" class="new-course-cancel-btn">${t('editProfilePage.deleteModal.cancel')}</button>
            <button type="button" id="ep-avatar-confirm" class="new-course-primary-btn" ${!hasSelection ? 'disabled' : ''}>
              ${avatarModalMode === 'upload' ? 'Enviar e usar' : 'Confirmar'}
            </button>
          </footer>
        </div>
      </div>
    `
  }

  // ── Events ──
  function bindEvents() {
    // Section toggles
    root.querySelectorAll<HTMLButtonElement>('.edit-profile-card-header').forEach((btn) => {
      btn.addEventListener('click', () => {
        syncFormValues()
        const section = btn.dataset.section as SectionKey
        activeSection = activeSection === section ? null : section
        render()
      })
    })

    // Bio counter
    const bioTextarea = document.getElementById('ep-bio') as HTMLTextAreaElement | null
    const bioCounter = document.getElementById('ep-bio-counter')
    if (bioTextarea && bioCounter) {
      bioTextarea.addEventListener('input', () => {
        values.bio = bioTextarea.value
        bioCounter.textContent = `${bioTextarea.value.length} / ${maxBioLength} ${t('editProfilePage.characters')}`
      })
    }

    // Activities counters
    root.querySelectorAll<HTMLTextAreaElement>('[data-ep-professional][data-field="activities"]').forEach((textarea) => {
      textarea.addEventListener('input', () => {
        const idx = textarea.dataset.epProfessional
        const counter = root.querySelector(`[data-activities-counter="${idx}"]`)
        if (counter) counter.textContent = `${textarea.value.length} / ${maxActivitiesLength} ${t('editProfilePage.characters')}`
      })
    })

    // Clear validation on input
    root.addEventListener('input', () => clearValidation())

    // Current job checkbox
    root.querySelectorAll<HTMLInputElement>('[data-ep-professional][data-field="isCurrentJob"]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        syncFormValues()
        const index = Number(checkbox.dataset.epProfessional)
        if (!Number.isNaN(index) && professionalEntries[index]) {
          professionalEntries[index].isCurrentJob = checkbox.checked
          if (checkbox.checked) professionalEntries[index].endDate = ''
        }
        render()
      })
    })

    // Academic add/remove
    root.querySelectorAll<HTMLButtonElement>('[data-academic-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        syncFormValues()
        academicEntries.push(createAcademicEntry())
        render()
      })
    })
    root.querySelectorAll<HTMLButtonElement>('[data-academic-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.academicRemove)
        if (Number.isNaN(index) || academicEntries.length <= 1) return
        syncFormValues()
        academicEntries.splice(index, 1)
        render()
      })
    })

    // Professional add/remove
    root.querySelectorAll<HTMLButtonElement>('[data-professional-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        syncFormValues()
        professionalEntries.push(createProfessionalEntry())
        render()
      })
    })
    root.querySelectorAll<HTMLButtonElement>('[data-professional-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.professionalRemove)
        if (Number.isNaN(index) || professionalEntries.length <= 1) return
        syncFormValues()
        professionalEntries.splice(index, 1)
        render()
      })
    })

    // Cancel
    document.getElementById('ep-cancel-btn')?.addEventListener('click', () => {
      navigateHome()
    })

    // Save
    document.getElementById('ep-save-btn')?.addEventListener('click', async () => {
      syncFormValues()

      if (!validateAndHighlight()) {
        toast(t('editProfilePage.feedback.requiredFields'), 'error')
        return
      }

      const saveBtn = document.getElementById('ep-save-btn') as HTMLButtonElement | null
      if (saveBtn) saveBtn.disabled = true

      toast(t('editProfilePage.feedback.saving'), 'loading')

      try {
        await authApi.updateMyProfile({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          motivations: values.bio.trim() || undefined,
          academicBackground: buildAcademicSummary() || undefined,
          professionalExperience: buildProfessionalSummary() || undefined,
        })

        setCurrentUser({
          id: user.id,
          role: user.role,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          avatarMediaId,
        })

        updateHeaderUserInfo()
        toast(t('editProfilePage.feedback.success'), 'success')

        setTimeout(() => {
          navigateHome()
        }, 1000)
      } catch {
        toast(t('editProfilePage.feedback.error'), 'error')
        if (saveBtn) saveBtn.disabled = false
      }
    })

    // Delete account modal
    document.getElementById('ep-delete-btn')?.addEventListener('click', () => {
      syncFormValues()
      isDeleteModalOpen = true
      render()
    })

    // Delete modal events
    document.getElementById('ep-delete-close')?.addEventListener('click', () => {
      isDeleteModalOpen = false
      render()
    })
    document.getElementById('ep-delete-cancel')?.addEventListener('click', () => {
      isDeleteModalOpen = false
      render()
    })
    document.getElementById('ep-delete-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        isDeleteModalOpen = false
        render()
      }
    })
    document.getElementById('ep-delete-confirm')?.addEventListener('click', async () => {
      const confirmBtn = document.getElementById('ep-delete-confirm') as HTMLButtonElement | null
      if (confirmBtn) confirmBtn.disabled = true

      toast(t('editProfilePage.feedback.deleting'), 'loading')

      try {
        await authApi.deleteMyAccount()
        toast(t('editProfilePage.feedback.deleteSuccess'), 'success')
        clearAccessToken()
        setTimeout(() => {
          window.location.assign('/')
        }, 1000)
      } catch {
        toast(t('editProfilePage.feedback.deleteError'), 'error')
        if (confirmBtn) confirmBtn.disabled = false
      }
    })

    // Change password
    document.getElementById('ep-change-password')?.addEventListener('click', async () => {
      toast(t('passwordReset.feedback.sendingCode'), 'loading')
      try {
        await authApi.requestMyPasswordResetCode()
        toast(t('passwordReset.feedback.codeSent'), 'success')
        const pwResetContainer = document.createElement('div')
        document.body.appendChild(pwResetContainer)
        PasswordResetFlow(pwResetContainer, {
          context: 'profile',
          email: values.email,
          onClose: () => { pwResetContainer.remove() },
          onSuccess: () => { toast(t('passwordReset.feedback.resetSuccess'), 'success') },
        })
      } catch {
        toast(t('passwordReset.feedback.resendError'), 'error')
      }
    })

    // Photo button — open avatar modal
    document.getElementById('ep-change-photo')?.addEventListener('click', async () => {
      syncFormValues()
      avatarModalMode = 'library'
      avatarSelectedMediaId = null
      avatarSelectedFile = null
      isAvatarModalOpen = true
      try {
        await loadAvatarLibrary()
      } catch {
        // Library load failed, still show modal
      }
      render()
    })

    // Avatar modal events
    bindAvatarModalEvents()

    // Date pickers
    initDatePickers()
  }

  function bindAvatarModalEvents() {
    if (!isAvatarModalOpen) return

    const closeAvatarModal = () => {
      avatarPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
      avatarPreviewUrls.clear()
      isAvatarModalOpen = false
      render()
    }

    document.getElementById('ep-avatar-close')?.addEventListener('click', closeAvatarModal)
    document.getElementById('ep-avatar-cancel')?.addEventListener('click', closeAvatarModal)
    document.getElementById('ep-avatar-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeAvatarModal()
    })

    // Tab switching
    document.getElementById('ep-avatar-tab-library')?.addEventListener('click', async () => {
      avatarModalMode = 'library'
      try { await loadAvatarLibrary() } catch { /* ignore */ }
      render()
    })
    document.getElementById('ep-avatar-tab-upload')?.addEventListener('click', () => {
      avatarModalMode = 'upload'
      render()
    })

    // Library item selection
    root.querySelectorAll<HTMLButtonElement>('[data-avatar-media-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        avatarSelectedMediaId = btn.dataset.avatarMediaId ?? null
        render()
      })
    })

    // Upload file selection
    const fileInput = document.getElementById('ep-avatar-file') as HTMLInputElement | null
    fileInput?.addEventListener('change', () => {
      avatarSelectedFile = fileInput.files?.[0] ?? null
      // Enable confirm button
      const confirmBtn = document.getElementById('ep-avatar-confirm') as HTMLButtonElement | null
      if (confirmBtn && avatarSelectedFile) confirmBtn.disabled = false
    })

    // Confirm
    document.getElementById('ep-avatar-confirm')?.addEventListener('click', async () => {
      const confirmBtn = document.getElementById('ep-avatar-confirm') as HTMLButtonElement | null
      if (confirmBtn) confirmBtn.disabled = true

      toast(t('editProfilePage.feedback.saving'), 'loading')

      try {
        let mediaId: string

        if (avatarModalMode === 'upload') {
          if (!avatarSelectedFile) return

          const titleEl = document.getElementById('ep-avatar-title') as HTMLInputElement | null
          const altEl = document.getElementById('ep-avatar-alt') as HTMLInputElement | null
          const descEl = document.getElementById('ep-avatar-desc') as HTMLTextAreaElement | null

          const title = titleEl?.value.trim() ?? ''
          const altText = altEl?.value.trim() ?? ''
          const description = descEl?.value.trim() ?? ''

          if (!title || !altText || !description) {
            toast('Preencha todos os campos.', 'error')
            if (confirmBtn) confirmBtn.disabled = false
            return
          }

          const uploaded = await mediaApi.uploadImage({ file: avatarSelectedFile })
          mediaId = uploaded.id ?? uploaded._id ?? uploaded.gridFsId

          await mediaApi.createImageMetadata(mediaId, { title, altText, description })
        } else {
          if (!avatarSelectedMediaId) return
          mediaId = avatarSelectedMediaId
        }

        await authApi.updateMyAvatar(mediaId)
        avatarMediaId = mediaId

        setCurrentUser({ ...user, avatarMediaId: mediaId })

        // Update header avatar
        const headerAvatar = document.querySelector('.header-user-avatar')
        if (headerAvatar) {
          headerAvatar.innerHTML = `<img src="${apiBaseUrl}/media/${mediaId}/stream?token=${getAccessToken() ?? ''}" alt="Avatar" class="header-avatar-img">`
        }

        toast(t('editProfilePage.feedback.success'), 'success')
        closeAvatarModal()
      } catch {
        toast(t('editProfilePage.feedback.error'), 'error')
        if (confirmBtn) confirmBtn.disabled = false
      }
    })
  }

  function initDatePickers() {
    const monthPickerInputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-month-picker="true"]'))
    monthPickerInputs.forEach((inputElement) => {
      if (inputElement.disabled) return

      const fieldName = inputElement.dataset.field
      const isStartField = fieldName === 'startDate'
      const isEndField = fieldName === 'endDate'

      let minDate: Date | undefined
      if (isEndField) {
        const acadIdx = inputElement.dataset.epAcademic
        const profIdx = inputElement.dataset.epProfessional
        let startValue: string | null = null

        if (acadIdx !== undefined) {
          startValue = academicEntries[Number(acadIdx)]?.startDate ?? null
        } else if (profIdx !== undefined) {
          startValue = professionalEntries[Number(profIdx)]?.startDate ?? null
        }

        if (startValue) {
          const startDate = parseMonthYear(startValue)
          if (startDate) minDate = toNextMonth(startDate)
        }
      }

      const now = new Date()
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const pickerInstance = flatpickr(inputElement, {
        locale: getLanguage() === 'pt-BR' ? Portuguese : undefined,
        disableMobile: true,
        dateFormat: 'm/Y',
        allowInput: true,
        clickOpens: true,
        defaultDate: inputElement.value || undefined,
        maxDate: isStartField ? currentMonth : undefined,
        minDate,
        plugins: [
          monthSelectPlugin({
            shorthand: true,
            dateFormat: 'm/Y',
            altFormat: 'F Y',
          }),
        ],
        onChange: () => {
          inputElement.dispatchEvent(new Event('input', { bubbles: true }))
        },
      })

      const openerButton = root.querySelector(`[data-date-open-for="${inputElement.id}"]`) as HTMLButtonElement | null
      openerButton?.addEventListener('click', () => {
        if (inputElement.disabled) return
        pickerInstance.open()
      })
    })
  }

  render()
}
