import { authApi } from '@/features/auth/api/auth.api'
import { ApiError } from '@/shared/api/http'
import { getLanguage, subscribeLanguage, t } from '@/shared/i18n'
import { toast } from '@/shared/ui/toast'
import flatpickr from 'flatpickr'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import { Portuguese } from 'flatpickr/dist/l10n/pt'
import 'flatpickr/dist/flatpickr.min.css'
import 'flatpickr/dist/plugins/monthSelect/style.css'

type ProfileSectionKey = 'motivations' | 'academicBackground' | 'professionalExperience'

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

interface AuthProfileStepOptions {
  registrationUserId?: string | null
  onBackToRegister: () => void
  onProfileSubmittedForReview?: () => void
}

export function AuthProfileStep(container: HTMLElement, options: AuthProfileStepOptions) {
  let activeSection: ProfileSectionKey = 'motivations'
  let isConfirmationModalOpen = false
  let isSubmitting = false
  const values = {
    motivations: '',
    academicEntries: [createAcademicEntry()],
    professionalEntries: [createProfessionalEntry()],
  }

  let sectionErrors: Partial<Record<ProfileSectionKey, string>> = {}

  const escapeHtml = (raw: string) =>
    raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

  const escapeAttr = (raw: string) => escapeHtml(raw)

  function createAcademicEntry(): AcademicEntry {
    return {
      educationLevel: '',
      status: '',
      course: '',
      institution: '',
      startDate: '',
      endDate: '',
    }
  }

  function createProfessionalEntry(): ProfessionalEntry {
    return {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      activities: '',
    }
  }

  const maxLength = 400
  const minLengthByField: Record<ProfileSectionKey, number> = {
    motivations: 30,
    academicBackground: 20,
    professionalExperience: 20,
  }

  const buildAcademicSummary = () =>
    values.academicEntries
      .map(
        (entry, index) =>
          `${t('auth.profile.sections.academicBackground.entryTitle')} ${index + 1}: ${entry.educationLevel} | ${entry.status} | ${entry.course} | ${entry.institution} | ${entry.startDate} - ${entry.endDate}`
      )
      .join('\n')

  const buildProfessionalSummary = () =>
    values.professionalEntries
      .map((entry, index) => {
        const endDate = entry.isCurrentJob ? t('auth.profile.sections.professionalExperience.currentJob') : entry.endDate
        return `${t('auth.profile.sections.professionalExperience.entryTitle')} ${index + 1}: ${entry.company} | ${entry.role} | ${entry.startDate} - ${endDate} | ${entry.activities}`
      })
      .join('\n')

  const isMotivationsComplete = () => values.motivations.trim().length >= minLengthByField.motivations

  const isStartDateValid = (startValue: string) => {
    const startDate = parseMonthYear(startValue)
    if (!startDate) return false

    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return startDate <= currentMonth
  }

  const isEndAfterStart = (startValue: string, endValue: string) => {
    const startDate = parseMonthYear(startValue)
    const endDate = parseMonthYear(endValue)
    if (!startDate || !endDate) return false
    return endDate > startDate
  }

  const isAcademicEntryComplete = (entry: AcademicEntry) =>
    Boolean(
      entry.educationLevel &&
        entry.status &&
        entry.course.trim() &&
        entry.institution.trim() &&
        isStartDateValid(entry.startDate) &&
        isEndAfterStart(entry.startDate, entry.endDate)
    )

  const isAcademicComplete = () => {
    if (values.academicEntries.length === 0) return false
    const allEntriesComplete = values.academicEntries.every(isAcademicEntryComplete)
    return allEntriesComplete && buildAcademicSummary().length >= minLengthByField.academicBackground
  }

  const isProfessionalEntryComplete = (entry: ProfessionalEntry) => {
    const hasEndDate = entry.isCurrentJob || Boolean(entry.endDate.trim())
    const endRuleValid = entry.isCurrentJob ? true : isEndAfterStart(entry.startDate, entry.endDate)
    return Boolean(
      entry.company.trim() &&
        entry.role.trim() &&
        isStartDateValid(entry.startDate) &&
        hasEndDate &&
        endRuleValid &&
        entry.activities.trim().length >= 20
    )
  }

  const isProfessionalComplete = () => {
    if (values.professionalEntries.length === 0) return false
    const allEntriesComplete = values.professionalEntries.every(isProfessionalEntryComplete)
    return allEntriesComplete && buildProfessionalSummary().length >= minLengthByField.professionalExperience
  }

  const isAllComplete = () => isMotivationsComplete() && isAcademicComplete() && isProfessionalComplete()

  const parseMonthYear = (value: string): Date | null => {
    const match = /^(\d{2})\/(\d{4})$/.exec(value.trim())
    if (!match) return null

    const month = Number(match[1])
    const year = Number(match[2])
    if (month < 1 || month > 12) return null

    return new Date(year, month - 1, 1)
  }

  const toNextMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 1)

  const getRelatedStartValue = (inputElement: HTMLInputElement): string | null => {
    const academicIndex = inputElement.dataset.academicIndex
    if (academicIndex !== undefined) {
      const index = Number(academicIndex)
      if (Number.isNaN(index)) return null
      return values.academicEntries[index]?.startDate ?? null
    }

    const professionalIndex = inputElement.dataset.professionalIndex
    if (professionalIndex !== undefined) {
      const index = Number(professionalIndex)
      if (Number.isNaN(index)) return null
      return values.professionalEntries[index]?.startDate ?? null
    }

    return null
  }

  const getRelatedEndInput = (inputElement: HTMLInputElement): HTMLInputElement | null => {
    const academicIndex = inputElement.dataset.academicIndex
    if (academicIndex !== undefined) {
      return container.querySelector(`#academic-end-${academicIndex}`) as HTMLInputElement | null
    }

    const professionalIndex = inputElement.dataset.professionalIndex
    if (professionalIndex !== undefined) {
      return container.querySelector(`#professional-end-${professionalIndex}`) as HTMLInputElement | null
    }

    return null
  }

  const updateCounters = () => {
    const motivationCounter = container.querySelector('[data-profile-counter="motivations"]') as HTMLElement | null
    if (motivationCounter) {
      motivationCounter.textContent = `${values.motivations.length} / ${maxLength} ${t('auth.profile.characters')}`
    }

    values.professionalEntries.forEach((entry, index) => {
      const counterElement = container.querySelector(`[data-profile-counter="professionalExperience-${index}"]`) as HTMLElement | null
      if (!counterElement) return
      counterElement.textContent = `${entry.activities.length} / ${maxLength} ${t('auth.profile.characters')}`
    })
  }

  const setFieldError = (field: ProfileSectionKey, message: string) => {
    const hintElement = container.querySelector(`[data-profile-error="${field}"]`) as HTMLElement | null
    if (!hintElement) return
    hintElement.textContent = message
    hintElement.classList.toggle('is-visible', Boolean(message))
  }

  const setInputInvalid = (selector: string, isInvalid: boolean) => {
    const inputElement = container.querySelector(selector) as HTMLElement | null
    const wrapper = inputElement?.closest('.auth-profile-input') as HTMLElement | null
    wrapper?.classList.toggle('is-invalid', isInvalid)
  }

  const setTextareaInvalid = (selector: string, isInvalid: boolean) => {
    const inputElement = container.querySelector(selector) as HTMLElement | null
    const wrapper = inputElement?.closest('.auth-profile-field') as HTMLElement | null
    wrapper?.classList.toggle('is-invalid', isInvalid)
  }

  const clearAllInvalidHighlights = () => {
    container.querySelectorAll('.auth-profile-input.is-invalid').forEach((el) => el.classList.remove('is-invalid'))
    container.querySelectorAll('.auth-profile-field.is-invalid').forEach((el) => el.classList.remove('is-invalid'))
  }

  const applyFieldValidationHighlights = () => {
    clearAllInvalidHighlights()

    setTextareaInvalid('[data-profile-input="motivations"]', values.motivations.trim().length < minLengthByField.motivations)

    values.academicEntries.forEach((entry, index) => {
      const base = `[data-academic-index="${index}"]`
      setInputInvalid(`${base}[data-academic-field="educationLevel"]`, !entry.educationLevel)
      setInputInvalid(`${base}[data-academic-field="status"]`, !entry.status)
      setInputInvalid(`${base}[data-academic-field="course"]`, !entry.course.trim())
      setInputInvalid(`${base}[data-academic-field="institution"]`, !entry.institution.trim())
      setInputInvalid(`${base}[data-academic-field="startDate"]`, !isStartDateValid(entry.startDate))
      setInputInvalid(`${base}[data-academic-field="endDate"]`, !isEndAfterStart(entry.startDate, entry.endDate))
    })

    values.professionalEntries.forEach((entry, index) => {
      const base = `[data-professional-index="${index}"]`
      setInputInvalid(`${base}[data-professional-field="company"]`, !entry.company.trim())
      setInputInvalid(`${base}[data-professional-field="role"]`, !entry.role.trim())
      setInputInvalid(`${base}[data-professional-field="startDate"]`, !isStartDateValid(entry.startDate))

      const invalidEnd = entry.isCurrentJob ? false : !isEndAfterStart(entry.startDate, entry.endDate)
      setInputInvalid(`${base}[data-professional-field="endDate"]`, invalidEnd)
      setTextareaInvalid(`${base}[data-professional-field="activities"]`, entry.activities.trim().length < 20)
    })
  }

  const firstAcademicError = (): string | null => {
    for (const entry of values.academicEntries) {
      if (!entry.educationLevel) return t('auth.profile.errors.requiredField', { field: t('auth.profile.sections.academicBackground.levelLabel') })
      if (!entry.status) return t('auth.profile.errors.requiredField', { field: t('auth.profile.sections.academicBackground.statusLabel') })
      if (!entry.course.trim()) return t('auth.profile.errors.requiredField', { field: t('auth.profile.sections.academicBackground.courseLabel') })
      if (!entry.institution.trim()) return t('auth.profile.errors.requiredField', { field: t('auth.profile.sections.academicBackground.institutionLabel') })
      if (!isStartDateValid(entry.startDate)) return t('auth.profile.errors.startNotFuture', { field: t('auth.profile.sections.academicBackground.startLabel') })
      if (!isEndAfterStart(entry.startDate, entry.endDate)) return t('auth.profile.errors.endAfterStart', { field: t('auth.profile.sections.academicBackground.endLabel') })
    }
    return null
  }

  const firstProfessionalError = (): string | null => {
    for (const entry of values.professionalEntries) {
      if (!entry.company.trim()) return t('auth.profile.errors.requiredField', { field: t('auth.profile.sections.professionalExperience.companyLabel') })
      if (!entry.role.trim()) return t('auth.profile.errors.requiredField', { field: t('auth.profile.sections.professionalExperience.roleLabel') })
      if (!isStartDateValid(entry.startDate)) return t('auth.profile.errors.startNotFuture', { field: t('auth.profile.sections.professionalExperience.startLabel') })

      if (!entry.isCurrentJob && !isEndAfterStart(entry.startDate, entry.endDate)) {
        return t('auth.profile.errors.endAfterStart', { field: t('auth.profile.sections.professionalExperience.endLabel') })
      }

      if (entry.activities.trim().length < 20) {
        return t('auth.profile.errors.minChars', {
          field: t('auth.profile.sections.professionalExperience.activitiesLabel'),
          min: 20,
        })
      }
    }
    return null
  }

  const validate = () => {
    sectionErrors = {}

    if (!isMotivationsComplete()) {
      sectionErrors.motivations = t('auth.profile.errors.minChars', {
        field: t('auth.profile.sections.motivations.title'),
        min: minLengthByField.motivations,
      })
    }

    if (!isAcademicComplete()) {
      sectionErrors.academicBackground =
        firstAcademicError() ??
        t('auth.profile.errors.completeSection', {
          field: t('auth.profile.sections.academicBackground.title'),
        })
    }

    if (!isProfessionalComplete()) {
      sectionErrors.professionalExperience =
        firstProfessionalError() ??
        t('auth.profile.errors.completeSection', {
          field: t('auth.profile.sections.professionalExperience.title'),
        })
    }

    ;(['motivations', 'academicBackground', 'professionalExperience'] as ProfileSectionKey[]).forEach((field) => {
      setFieldError(field, sectionErrors[field] ?? '')
    })

    applyFieldValidationHighlights()

    return Object.keys(sectionErrors).length === 0
  }

  const updateSubmitState = () => {
    const submitButton = container.querySelector('#profile-submit-btn') as HTMLButtonElement | null
    if (!submitButton) return

    submitButton.disabled = isSubmitting || !isAllComplete()
  }

  const bindSection = (field: ProfileSectionKey) => {
    const trigger = container.querySelector(`[data-profile-trigger="${field}"]`) as HTMLButtonElement | null
    const content = container.querySelector(`[data-profile-content="${field}"]`) as HTMLElement | null

    if (!trigger || !content) return

    const isActive = activeSection === field
    trigger.classList.toggle('is-active', isActive)
    content.classList.toggle('is-open', isActive)

    trigger.addEventListener('click', () => {
      activeSection = field
      render()
    })
  }

  const bindEvents = () => {
    ;(['motivations', 'academicBackground', 'professionalExperience'] as ProfileSectionKey[]).forEach((field) => bindSection(field))

    container.querySelectorAll('[data-academic-add]').forEach((button) => {
      button.addEventListener('click', () => {
        values.academicEntries.push(createAcademicEntry())
        render()
      })
    })

    container.querySelectorAll('[data-academic-remove-index]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number((button as HTMLElement).getAttribute('data-academic-remove-index'))
        if (Number.isNaN(index)) return
        if (values.academicEntries.length <= 1) return
        values.academicEntries.splice(index, 1)
        render()
      })
    })

    container.querySelectorAll('[data-professional-add]').forEach((button) => {
      button.addEventListener('click', () => {
        values.professionalEntries.push(createProfessionalEntry())
        render()
      })
    })

    container.querySelectorAll('[data-professional-remove-index]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number((button as HTMLElement).getAttribute('data-professional-remove-index'))
        if (Number.isNaN(index)) return
        if (values.professionalEntries.length <= 1) return
        values.professionalEntries.splice(index, 1)
        render()
      })
    })

    container.addEventListener('input', (event) => {
      const target = event.target as HTMLElement

      const motivationsInput = target.closest('[data-profile-input="motivations"]') as HTMLTextAreaElement | null
      if (motivationsInput) {
        values.motivations = motivationsInput.value
        sectionErrors.motivations = ''
      }

      const academicInput = target.closest('[data-academic-index][data-academic-field]') as HTMLElement | null
      if (academicInput) {
        const index = Number(academicInput.getAttribute('data-academic-index'))
        const field = academicInput.getAttribute('data-academic-field') as keyof AcademicEntry | null
        if (!Number.isNaN(index) && field && values.academicEntries[index]) {
          values.academicEntries[index][field] = (academicInput as HTMLInputElement | HTMLSelectElement).value
          sectionErrors.academicBackground = ''
        }
      }

      const professionalInput = target.closest('[data-professional-index][data-professional-field]') as HTMLElement | null
      if (professionalInput) {
        const index = Number(professionalInput.getAttribute('data-professional-index'))
        const field = professionalInput.getAttribute('data-professional-field') as keyof ProfessionalEntry | null
        if (!Number.isNaN(index) && field && values.professionalEntries[index]) {
          if (field === 'isCurrentJob') {
            values.professionalEntries[index][field] = (professionalInput as HTMLInputElement).checked as never
            if ((professionalInput as HTMLInputElement).checked) {
              values.professionalEntries[index].endDate = ''
            }
            sectionErrors.professionalExperience = ''
            render()
            return
          } else {
            values.professionalEntries[index][field] = (professionalInput as HTMLInputElement | HTMLTextAreaElement).value as never
          }
          sectionErrors.professionalExperience = ''
        }
      }

      applyFieldValidationHighlights()
      updateCounters()
      updateSubmitState()
    })

    const backButton = container.querySelector('#profile-back-btn')
    backButton?.addEventListener('click', () => options.onBackToRegister())

    const formElement = container.querySelector('#profile-form') as HTMLFormElement | null
    formElement?.addEventListener('submit', (event) => {
      event.preventDefault()

      if (!validate()) return

      isConfirmationModalOpen = true
      render()
    })

    const confirmationCancelButton = container.querySelector('#profile-confirm-cancel')
    confirmationCancelButton?.addEventListener('click', () => {
      isConfirmationModalOpen = false
      render()
    })

    const confirmationCloseButton = container.querySelector('#profile-confirm-close')
    confirmationCloseButton?.addEventListener('click', () => {
      isConfirmationModalOpen = false
      render()
    })

    const confirmationContinueButton = container.querySelector('#profile-confirm-continue') as HTMLButtonElement | null
    confirmationContinueButton?.addEventListener('click', async () => {
      if (isSubmitting) return

      isSubmitting = true
      updateSubmitState()

      toast(t('auth.profile.feedback.submitting'), 'loading')

      try {
        const payload = {
          motivations: values.motivations.trim(),
          academicBackground: buildAcademicSummary(),
          professionalExperience: buildProfessionalSummary(),
        }

        const response = options.registrationUserId
          ? await authApi.upsertProfileByUserId(options.registrationUserId, payload)
          : await authApi.upsertMyProfile(payload)

        isConfirmationModalOpen = false

        if (response.registrationStatus === 'PENDING_REVIEW') {
          options.onProfileSubmittedForReview?.()
          return
        }

        toast(t('auth.profile.feedback.success'), 'success')
      } catch (error) {
        if (error instanceof ApiError && error.code === 'UNAUTHORIZED') {
          toast(t('auth.profile.errors.unauthorized'), 'error')
        } else if (error instanceof ApiError && error.code === 'INVALID_STATUS_TRANSITION') {
          toast(t('auth.profile.errors.invalidTransition'), 'error')
        } else {
          toast(t('auth.profile.errors.generic'), 'error')
        }
      } finally {
        isSubmitting = false
        updateSubmitState()
      }
    })

    const monthPickerInputs = Array.from(container.querySelectorAll<HTMLInputElement>('[data-month-picker="true"]'))
    monthPickerInputs.forEach((inputElement) => {
      if (inputElement.disabled) return

      const fieldName = inputElement.dataset.academicField ?? inputElement.dataset.professionalField
      const isStartField = fieldName === 'startDate'
      const isEndField = fieldName === 'endDate'

      const startReference = isEndField ? parseMonthYear(getRelatedStartValue(inputElement) ?? '') : null
      const minDate = startReference ? toNextMonth(startReference) : undefined

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
          if (isStartField) {
            const endInput = getRelatedEndInput(inputElement)
            if (endInput) {
              const startDate = parseMonthYear(inputElement.value)
              const endPicker = (endInput as HTMLInputElement & { _flatpickr?: { set: (key: string, value: Date | undefined) => void } })._flatpickr

              if (startDate) {
                const endMinDate = toNextMonth(startDate)
                endPicker?.set('minDate', endMinDate)

                const currentEndDate = parseMonthYear(endInput.value)
                if (currentEndDate && currentEndDate <= startDate) {
                  endInput.value = ''
                  endInput.dispatchEvent(new Event('input', { bubbles: true }))
                }
              } else {
                endPicker?.set('minDate', undefined)
              }
            }
          }

          inputElement.dispatchEvent(new Event('input', { bubbles: true }))
        },
      })

      const openerButton = container.querySelector(`[data-date-open-for="${inputElement.id}"]`) as HTMLButtonElement | null
      openerButton?.addEventListener('click', () => {
        if (inputElement.disabled) return
        pickerInstance.open()
      })
    })

    updateCounters()
    applyFieldValidationHighlights()
    updateSubmitState()
  }

  const render = () => {
    const motivationComplete = isMotivationsComplete()
    const academicComplete = isAcademicComplete()
    const professionalComplete = isProfessionalComplete()

    container.innerHTML = `
      <section class="auth-profile-step">
        <div class="auth-profile-shell">
          <div class="auth-profile-heading">
            <h2>${t('auth.profile.title')}</h2>
            <p>${t('auth.profile.description')}</p>
          </div>

          <form id="profile-form" class="auth-profile-form" novalidate>
            <article class="auth-profile-card ${activeSection === 'motivations' ? 'is-expanded' : ''} ${motivationComplete ? 'is-complete' : ''}">
              <button type="button" class="auth-profile-card-header ${activeSection === 'motivations' ? 'is-active' : ''}" data-profile-trigger="motivations">
                <span class="auth-profile-card-icon">⌄</span>
                <span>${t('auth.profile.sections.motivations.title')}</span>
                <span class="auth-profile-card-status">${motivationComplete ? '✓' : ''}</span>
              </button>
              <div class="auth-profile-card-content ${activeSection === 'motivations' ? 'is-open' : ''}" data-profile-content="motivations">
                <p class="auth-profile-card-description">${t('auth.profile.sections.motivations.description')}</p>
                <div class="auth-profile-field" data-profile-field="motivations">
                  <textarea
                    data-profile-input="motivations"
                    maxlength="${maxLength}"
                    placeholder="${t('auth.profile.sections.motivations.placeholder')}"
                  >${escapeHtml(values.motivations)}</textarea>
                  <div class="auth-profile-counter" data-profile-counter="motivations"></div>
                </div>
              </div>
              <small class="auth-profile-error" data-profile-error="motivations"></small>
            </article>

            <article class="auth-profile-card ${activeSection === 'academicBackground' ? 'is-expanded' : ''} ${academicComplete ? 'is-complete' : ''}">
              <button type="button" class="auth-profile-card-header ${activeSection === 'academicBackground' ? 'is-active' : ''}" data-profile-trigger="academicBackground">
                <span class="auth-profile-card-icon">⌄</span>
                <span>${t('auth.profile.sections.academicBackground.title')}</span>
                <span class="auth-profile-card-status">${academicComplete ? '✓' : ''}</span>
              </button>
              <div class="auth-profile-card-content ${activeSection === 'academicBackground' ? 'is-open' : ''}" data-profile-content="academicBackground">
                ${values.academicEntries
                  .map(
                    (entry, index) => `
                      <div class="auth-profile-entity-block">
                        <b class="auth-profile-entity-title">${t('auth.profile.sections.academicBackground.entryTitle')} ${index + 1}</b>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.academicBackground.levelLabel')} <strong>*</strong></span>
                            <select data-academic-index="${index}" data-academic-field="educationLevel">
                              <option value="">${t('auth.profile.common.selectPlaceholder')}</option>
                              <option value="${t('auth.profile.sections.academicBackground.levelOptions.higher')}" ${entry.educationLevel === t('auth.profile.sections.academicBackground.levelOptions.higher') ? 'selected' : ''}>${t('auth.profile.sections.academicBackground.levelOptions.higher')}</option>
                              <option value="${t('auth.profile.sections.academicBackground.levelOptions.postgraduate')}" ${entry.educationLevel === t('auth.profile.sections.academicBackground.levelOptions.postgraduate') ? 'selected' : ''}>${t('auth.profile.sections.academicBackground.levelOptions.postgraduate')}</option>
                              <option value="${t('auth.profile.sections.academicBackground.levelOptions.technical')}" ${entry.educationLevel === t('auth.profile.sections.academicBackground.levelOptions.technical') ? 'selected' : ''}>${t('auth.profile.sections.academicBackground.levelOptions.technical')}</option>
                            </select>
                          </label>

                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.academicBackground.statusLabel')} <strong>*</strong></span>
                            <select data-academic-index="${index}" data-academic-field="status">
                              <option value="">${t('auth.profile.common.selectPlaceholder')}</option>
                              <option value="${t('auth.profile.sections.academicBackground.statusOptions.inProgress')}" ${entry.status === t('auth.profile.sections.academicBackground.statusOptions.inProgress') ? 'selected' : ''}>${t('auth.profile.sections.academicBackground.statusOptions.inProgress')}</option>
                              <option value="${t('auth.profile.sections.academicBackground.statusOptions.completed')}" ${entry.status === t('auth.profile.sections.academicBackground.statusOptions.completed') ? 'selected' : ''}>${t('auth.profile.sections.academicBackground.statusOptions.completed')}</option>
                            </select>
                          </label>
                        </div>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.academicBackground.courseLabel')} <strong>*</strong></span>
                            <input data-academic-index="${index}" data-academic-field="course" type="text" placeholder="${t('auth.profile.sections.academicBackground.coursePlaceholder')}" value="${escapeAttr(entry.course)}">
                          </label>

                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.academicBackground.institutionLabel')} <strong>*</strong></span>
                            <input data-academic-index="${index}" data-academic-field="institution" type="text" placeholder="${t('auth.profile.sections.academicBackground.institutionPlaceholder')}" value="${escapeAttr(entry.institution)}">
                          </label>
                        </div>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.academicBackground.startLabel')} <strong>*</strong></span>
                            <div class="auth-profile-date-control">
                              <input id="academic-start-${index}" class="auth-profile-date-input" data-month-picker="true" data-academic-index="${index}" data-academic-field="startDate" type="text" placeholder="${t('auth.profile.common.monthYearPlaceholder')}" value="${escapeAttr(entry.startDate)}">
                              <button type="button" class="auth-profile-date-btn" data-date-open-for="academic-start-${index}" aria-label="${t('auth.profile.common.openCalendar')}"></button>
                            </div>
                          </label>

                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.academicBackground.endLabel')} <strong>*</strong></span>
                            <div class="auth-profile-date-control">
                              <input id="academic-end-${index}" class="auth-profile-date-input" data-month-picker="true" data-academic-index="${index}" data-academic-field="endDate" type="text" placeholder="${t('auth.profile.common.monthYearPlaceholder')}" value="${escapeAttr(entry.endDate)}">
                              <button type="button" class="auth-profile-date-btn" data-date-open-for="academic-end-${index}" aria-label="${t('auth.profile.common.openCalendar')}"></button>
                            </div>
                          </label>
                        </div>

                        ${values.academicEntries.length > 1 ? `<button type="button" class="auth-profile-link-danger" data-academic-remove-index="${index}">${t('auth.profile.common.removeItem')}</button>` : ''}
                      </div>
                    `
                  )
                  .join('')}

                <button type="button" class="auth-profile-add-btn" data-academic-add>${t('auth.profile.sections.academicBackground.addAnother')}</button>
              </div>
              <small class="auth-profile-error" data-profile-error="academicBackground"></small>
            </article>

            <article class="auth-profile-card ${activeSection === 'professionalExperience' ? 'is-expanded' : ''} ${professionalComplete ? 'is-complete' : ''}">
              <button type="button" class="auth-profile-card-header ${activeSection === 'professionalExperience' ? 'is-active' : ''}" data-profile-trigger="professionalExperience">
                <span class="auth-profile-card-icon">⌄</span>
                <span>${t('auth.profile.sections.professionalExperience.title')}</span>
                <span class="auth-profile-card-status">${professionalComplete ? '✓' : ''}</span>
              </button>
              <div class="auth-profile-card-content ${activeSection === 'professionalExperience' ? 'is-open' : ''}" data-profile-content="professionalExperience">
                ${values.professionalEntries
                  .map(
                    (entry, index) => `
                      <div class="auth-profile-entity-block">
                        <b class="auth-profile-entity-title">${t('auth.profile.sections.professionalExperience.entryTitle')} ${index + 1}</b>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.professionalExperience.companyLabel')} <strong>*</strong></span>
                            <input data-professional-index="${index}" data-professional-field="company" type="text" placeholder="${t('auth.profile.sections.professionalExperience.companyPlaceholder')}" value="${escapeAttr(entry.company)}">
                          </label>

                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.professionalExperience.roleLabel')} <strong>*</strong></span>
                            <input data-professional-index="${index}" data-professional-field="role" type="text" placeholder="${t('auth.profile.sections.professionalExperience.rolePlaceholder')}" value="${escapeAttr(entry.role)}">
                          </label>
                        </div>

                        <div class="auth-profile-grid-two">
                          <label class="auth-profile-input">
                            <span>${t('auth.profile.sections.professionalExperience.startLabel')} <strong>*</strong></span>
                            <div class="auth-profile-date-control">
                              <input id="professional-start-${index}" class="auth-profile-date-input" data-month-picker="true" data-professional-index="${index}" data-professional-field="startDate" type="text" placeholder="${t('auth.profile.common.monthYearPlaceholder')}" value="${escapeAttr(entry.startDate)}">
                              <button type="button" class="auth-profile-date-btn" data-date-open-for="professional-start-${index}" aria-label="${t('auth.profile.common.openCalendar')}"></button>
                            </div>
                          </label>

                          <div class="auth-profile-input">
                            <label>
                              <span>${t('auth.profile.sections.professionalExperience.endLabel')} ${entry.isCurrentJob ? '' : '<strong>*</strong>'}</span>
                              <div class="auth-profile-date-control ${entry.isCurrentJob ? 'is-disabled' : ''}">
                                <input id="professional-end-${index}" class="auth-profile-date-input" data-month-picker="true" data-professional-index="${index}" data-professional-field="endDate" type="text" placeholder="${t('auth.profile.common.monthYearPlaceholder')}" value="${escapeAttr(entry.endDate)}" ${entry.isCurrentJob ? 'disabled' : ''}>
                                <button type="button" class="auth-profile-date-btn" data-date-open-for="professional-end-${index}" aria-label="${t('auth.profile.common.openCalendar')}" ${entry.isCurrentJob ? 'disabled' : ''}></button>
                              </div>
                            </label>
                            <label class="auth-profile-checkbox">
                              <input data-professional-index="${index}" data-professional-field="isCurrentJob" type="checkbox" ${entry.isCurrentJob ? 'checked' : ''}>
                              <span>${t('auth.profile.sections.professionalExperience.currentJob')}</span>
                            </label>
                          </div>
                        </div>

                        <label class="auth-profile-input">
                          <span>${t('auth.profile.sections.professionalExperience.activitiesLabel')} <strong>*</strong></span>
                          <div class="auth-profile-field">
                            <textarea
                              data-professional-index="${index}"
                              data-professional-field="activities"
                              maxlength="${maxLength}"
                              placeholder="${t('auth.profile.sections.professionalExperience.activitiesPlaceholder')}"
                            >${escapeHtml(entry.activities)}</textarea>
                            <div class="auth-profile-counter" data-profile-counter="professionalExperience-${index}"></div>
                          </div>
                        </label>

                        ${values.professionalEntries.length > 1 ? `<button type="button" class="auth-profile-link-danger" data-professional-remove-index="${index}">${t('auth.profile.common.removeItem')}</button>` : ''}
                      </div>
                    `
                  )
                  .join('')}

                <button type="button" class="auth-profile-add-btn" data-professional-add>${t('auth.profile.sections.professionalExperience.addAnother')}</button>
              </div>
              <small class="auth-profile-error" data-profile-error="professionalExperience"></small>
            </article>

            <div class="auth-profile-actions">
              <button id="profile-back-btn" class="auth-profile-back" type="button">${t('auth.profile.backToRegister')}</button>
              <button id="profile-submit-btn" class="btn-primary auth-profile-submit" type="submit">${t('auth.profile.submit')}</button>
            </div>
          </form>
        </div>

        ${isConfirmationModalOpen ? `
          <div class="auth-modal-overlay">
            <div class="auth-modal-card auth-modal-card-confirm">
              <div class="auth-modal-header">
                <h3>${t('auth.profile.confirmation.title')}</h3>
                <button id="profile-confirm-close" class="auth-modal-close" type="button" aria-label="${t('auth.profile.confirmation.close')}">✕</button>
              </div>
              <p class="auth-modal-message">${t('auth.profile.confirmation.message')}</p>
              <div class="auth-modal-actions">
                <button id="profile-confirm-cancel" class="auth-modal-cancel" type="button">${t('auth.profile.confirmation.cancel')}</button>
                <button id="profile-confirm-continue" class="btn-primary auth-modal-continue" type="button">${t('auth.profile.confirmation.continue')}</button>
              </div>
            </div>
          </div>
        ` : ''}

      </section>
    `

    bindEvents()
  }

  render()
  subscribeLanguage(() => render())
}
