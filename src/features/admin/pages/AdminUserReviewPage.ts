import { adminUsersApi, type AdminUserDetails, type AdminUserStatus } from '@/features/admin/api/admin-users.api'
import { ApiError } from '@/shared/api/http'
import { t } from '@/shared/i18n'
import { toast } from '@/shared/ui/toast'
import { routes } from '@/app/routes'
import '@/features/admin/styles/admin-user-review.css'

type ReviewSection = 'motivations' | 'academic' | 'professional'
type ReviewDecisionModal = 'approve' | 'reject' | null

const REVIEW_SECTION_STORAGE_KEY = 'admin-user-review.open-section'
const REVIEW_RESULT_STORAGE_KEY = 'admin-users.review-result'

function parseStoredSection(value: string | null): ReviewSection | null | undefined {
  if (value === 'motivations' || value === 'academic' || value === 'professional') return value
  if (value === 'none') return null
  return undefined
}

interface AcademicCardItem {
  title: string
  course: string
  formation: string
  institution: string
  start: string
  end: string
  badge?: string
}

interface ProfessionalCardItem {
  subtitle: string
  title: string
  role: string
  company: string
  start: string
  end: string
  description: string
  badge?: string
}

function getStatusLabel(status: string) {
  const normalized = status as AdminUserStatus
  if (normalized === 'APPROVED') return t('admin.users.status.approved')
  if (normalized === 'REJECTED') return t('admin.users.status.rejected')
  if (normalized === 'DRAFT_PROFILE') return t('admin.users.status.draft')
  return t('admin.users.status.pending')
}

function getReviewErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return t('review.errors.generic')

  if (error.status === 401 || error.code === 'UNAUTHORIZED') return t('review.errors.unauthorized')
  if (error.status === 403 || error.code === 'FORBIDDEN') return t('review.errors.forbidden')
  if (error.status === 404 || error.code === 'USER_NOT_FOUND') return t('review.errors.userNotFound')
  return t('review.errors.generic')
}

function getReviewTransitionErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return t('review.errors.generic')

  if (error.status === 401 || error.code === 'UNAUTHORIZED') return t('review.errors.unauthorized')
  if (error.status === 403 || error.code === 'FORBIDDEN') return t('review.errors.forbidden')
  if (error.status === 404 || error.code === 'USER_NOT_FOUND') return t('review.errors.userNotFound')
  if (error.status === 409 || error.code === 'INVALID_STATUS_TRANSITION') return t('review.errors.invalidStatusTransition')

  if (error.status === 422 || error.code === 'VALIDATION_ERROR') {
    if (error.fieldErrors?.reason === 'REQUIRED') return t('review.errors.reasonRequired')
  }

  if (error.status === 500 || error.code === 'INTERNAL_SERVER_ERROR') return t('review.errors.internal')
  return t('review.errors.generic')
}

function parseMaybeJson(value: string | null): unknown {
  if (!value) return null

  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

function parsePeriodRange(periodRaw: string): { start: string; end: string; hasOpenEnd: boolean } {
  const normalized = periodRaw.trim()
  if (!normalized) return { start: '—', end: '—', hasOpenEnd: true }

  const [startRaw, endRaw] = normalized.split('-').map((value) => value.trim())
  const start = startRaw || '—'
  const end = endRaw || '—'

  return {
    start,
    end,
    hasOpenEnd: !endRaw,
  }
}

function parseAcademicCardsFromText(rawValue: string): AcademicCardItem[] {
  const entries = rawValue
    .split(/\n+/)
    .map((value) => value.trim())
    .filter(Boolean)

  const mapped = entries.reduce<AcademicCardItem[]>((accumulator, entry, index) => {
      const [subtitlePart, ...parts] = entry.split('|').map((value) => value.trim())
      if (parts.length < 4) return accumulator

      const subtitleSeparator = subtitlePart.indexOf(':')
      const subtitle = subtitleSeparator >= 0 ? subtitlePart.slice(0, subtitleSeparator).trim() : subtitlePart
      const formation = subtitleSeparator >= 0 ? subtitlePart.slice(subtitleSeparator + 1).trim() : parts[0]
      const status = subtitleSeparator >= 0 ? parts[0] : parts[1]
      const course = subtitleSeparator >= 0 ? parts[1] : parts[2]
      const institution = subtitleSeparator >= 0 ? parts[2] : parts[3]
      const period = subtitleSeparator >= 0 ? parts[3] : parts[4]

      const [startRaw, endRaw] = String(period ?? '').split('-').map((value) => value.trim())

      accumulator.push({
        title: subtitle || t('review.academic.cardTitle', { index: index + 1 }),
        course: course || '—',
        formation: formation || '—',
        institution: institution || '—',
        start: startRaw || '—',
        end: endRaw || '—',
        badge: status || undefined,
      })

      return accumulator
    }, [])

  return mapped
}

function parseAcademicCards(rawValue: string | null): AcademicCardItem[] {
  const parsed = parseMaybeJson(rawValue)
  const sourceArray = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { items?: unknown[] }).items)
      ? ((parsed as { items: unknown[] }).items)
      : null

  if (!sourceArray || sourceArray.length === 0) {
    if (!rawValue) return []

    const parsedTextCards = parseAcademicCardsFromText(rawValue)
    if (parsedTextCards.length > 0) return parsedTextCards

    return [
      {
        title: t('review.academic.cardTitle', { index: 1 }),
        course: rawValue,
        formation: '—',
        institution: '—',
        start: '—',
        end: '—',
      },
    ]
  }

  return sourceArray.map((entry, index) => {
    const item = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>

    return {
      title: String(item.title ?? item.name ?? t('review.academic.cardTitle', { index: index + 1 })),
      course: String(item.course ?? item.degree ?? item.program ?? '—'),
      formation: String(item.formation ?? item.level ?? item.type ?? '—'),
      institution: String(item.institution ?? item.school ?? item.university ?? '—'),
      start: String(item.start ?? item.startDate ?? '—'),
      end: String(item.end ?? item.endDate ?? '—'),
      badge: typeof item.status === 'string' ? item.status : undefined,
    }
  })
}

function parseProfessionalCardsFromText(rawValue: string): ProfessionalCardItem[] {
  const entries = rawValue
    .split(/\n+/)
    .map((value) => value.trim())
    .filter(Boolean)

  const mapped = entries.reduce<ProfessionalCardItem[]>((accumulator, entry, index) => {
    const [subtitlePart, ...parts] = entry.split('|').map((value) => value.trim())
    if (parts.length < 2) return accumulator

    const subtitleSeparator = subtitlePart.indexOf(':')
    const subtitle = subtitleSeparator >= 0 ? subtitlePart.slice(0, subtitleSeparator).trim() : t('review.professional.cardTitle', { index: index + 1 })
    const companyFromTitle = subtitleSeparator >= 0 ? subtitlePart.slice(subtitleSeparator + 1).trim() : parts[0]
    const role = subtitleSeparator >= 0 ? parts[0] : (parts[1] ?? parts[0])
    const cardTitle = role
    const period = subtitleSeparator >= 0 ? parts[1] : parts[2]
    const description = subtitleSeparator >= 0 ? parts[2] : parts.slice(3).join(' | ')
    const company = companyFromTitle || role
    const { start, end, hasOpenEnd } = parsePeriodRange(String(period ?? ''))

    accumulator.push({
      subtitle: subtitle || t('review.professional.cardTitle', { index: index + 1 }),
      title: cardTitle || '—',
      role: role || '—',
      company: company || '—',
      start,
      end: hasOpenEnd ? '--/--' : end,
      description: description || '—',
      badge: hasOpenEnd ? t('review.professional.currentJob') : undefined,
    })

    return accumulator
  }, [])

  return mapped
}

function parseProfessionalCards(rawValue: string | null): ProfessionalCardItem[] {
  const parsed = parseMaybeJson(rawValue)
  const sourceArray = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { items?: unknown[] }).items)
      ? ((parsed as { items: unknown[] }).items)
      : null

  if (!sourceArray || sourceArray.length === 0) {
    if (!rawValue) return []

    const parsedTextCards = parseProfessionalCardsFromText(rawValue)
    if (parsedTextCards.length > 0) return parsedTextCards

    return [
      {
        subtitle: t('review.professional.cardTitle', { index: 1 }),
        title: t('review.professional.cardTitle', { index: 1 }),
        role: '—',
        company: '—',
        start: '—',
        end: '—',
        description: rawValue,
      },
    ]
  }

  return sourceArray.map((entry, index) => {
    const item = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>

    const subtitle = String(item.subtitle ?? t('review.professional.cardTitle', { index: index + 1 }))
    const title = String(item.title ?? item.name ?? item.position ?? item.role ?? '—')
    const role = String(item.role ?? item.position ?? item.title ?? item.name ?? '—')
    const company = String(item.company ?? item.institution ?? item.role ?? item.position ?? '—')
    const start = String(item.start ?? item.startDate ?? '—')
    const rawEnd = item.end ?? item.endDate ?? item.current
    const normalizedRawEnd = rawEnd == null ? '' : String(rawEnd).trim()
    const hasOpenEnd =
      !normalizedRawEnd ||
      normalizedRawEnd === '—' ||
      normalizedRawEnd.toLowerCase() === 'current' ||
      normalizedRawEnd.toLowerCase() === 'atual'
    const end = hasOpenEnd ? '--/--' : normalizedRawEnd
    const description = String(item.description ?? item.activities ?? '—')
    const statusBadge = typeof item.status === 'string' ? item.status : undefined
    const fallbackBadge = hasOpenEnd ? t('review.professional.currentJob') : undefined

    return {
      subtitle,
      title,
      role,
      company,
      start,
      end,
      description,
      badge: statusBadge ?? fallbackBadge,
    }
  })
}

function getAcademicBadgeClass(label?: string) {
  const normalized = (label ?? '').toLowerCase()
  if (normalized.includes('andamento') || normalized.includes('progress')) return 'in-progress'
  return 'completed'
}

function getProfessionalBadgeClass(label?: string) {
  const normalized = (label ?? '').toLowerCase()
  if (normalized.includes('atual') || normalized.includes('current')) return 'current-job'
  return 'completed'
}

export function renderAdminUserReviewPage(container: HTMLElement) {
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('userId')

  if (!userId) {
    container.innerHTML = `<section class="admin-user-review-page"><p class="admin-review-error">${t('review.errors.missingUser')}</p></section>`
    return
  }

  let details: AdminUserDetails | null = null
  const sectionStorageKey = `${REVIEW_SECTION_STORAGE_KEY}:${userId}`
  const storedSection = parseStoredSection(localStorage.getItem(sectionStorageKey))
  let expandedSection: ReviewSection | null = storedSection === undefined ? 'motivations' : storedSection
  let motivationsReviewed = false
  let reviewedAcademicCards = new Set<number>()
  let reviewedProfessionalCards = new Set<number>()
  let decisionModal: ReviewDecisionModal = null
  let rejectReason = ''
  let rejectReasonError = ''
  let isSubmittingDecision = false

  const navigateBack = () => {
    window.location.assign(routes.adminUsers)
  }

  const render = () => {
    if (!details) {
      container.innerHTML = `<section class="admin-user-review-page"><p class="admin-review-loading">${t('review.loading')}</p></section>`
      return
    }

    const statusLabel = getStatusLabel(details.status)
    const academicCards = parseAcademicCards(details.academicBackground)
    const professionalCards = parseProfessionalCards(details.professionalExperience)

    reviewedAcademicCards = new Set([...reviewedAcademicCards].filter((index) => index >= 0 && index < academicCards.length))
    reviewedProfessionalCards = new Set([...reviewedProfessionalCards].filter((index) => index >= 0 && index < professionalCards.length))

    const motivationsSectionReviewed = motivationsReviewed
    const academicSectionReviewed = academicCards.length === 0 || reviewedAcademicCards.size === academicCards.length
    const professionalSectionReviewed = professionalCards.length === 0 || reviewedProfessionalCards.size === professionalCards.length
    const allSectionsReviewed = motivationsSectionReviewed && academicSectionReviewed && professionalSectionReviewed

    const motivationsTotal = 1
    const motivationsChecked = motivationsReviewed ? 1 : 0
    const academicTotal = Math.max(academicCards.length, 1)
    const academicChecked = academicCards.length === 0 ? 1 : reviewedAcademicCards.size
    const professionalTotal = Math.max(professionalCards.length, 1)
    const professionalChecked = professionalCards.length === 0 ? 1 : reviewedProfessionalCards.size

    const motivationsProgressLabel = motivationsSectionReviewed
      ? t('review.check.sectionDone')
      : t('review.check.progressFormat', { checked: motivationsChecked, total: motivationsTotal })
    const academicProgressLabel = academicSectionReviewed
      ? t('review.check.sectionDone')
      : t('review.check.progressFormat', { checked: academicChecked, total: academicTotal })
    const professionalProgressLabel = professionalSectionReviewed
      ? t('review.check.sectionDone')
      : t('review.check.progressFormat', { checked: professionalChecked, total: professionalTotal })

    const rejectReasonCounter = `${rejectReason.length} / 100`

    container.innerHTML = `
      <section class="admin-user-review-page">
        <div class="admin-user-review-card">
          <button type="button" class="admin-review-back-top-btn" id="admin-review-back-top-btn">← ${t('review.back')}</button>
          <h1>${t('review.title')}</h1>

          <div class="admin-user-review-meta">
            <div class="admin-user-review-meta-item">
              <span>${t('admin.users.columns.name')}</span>
              <strong>${details.name || '—'}</strong>
            </div>
            <div class="admin-user-review-meta-item">
              <span>${t('admin.users.columns.email')}</span>
              <strong>${details.email || '—'}</strong>
            </div>
            <div class="admin-user-review-meta-item">
              <span>${t('admin.users.columns.status')}</span>
              <strong class="admin-user-review-status">${statusLabel}</strong>
            </div>
          </div>

          <div class="admin-user-review-accordion">
            <section class="admin-review-section ${expandedSection === 'motivations' ? 'is-open' : ''} ${motivationsSectionReviewed ? 'is-reviewed' : ''}">
              <button type="button" class="admin-review-section-header" data-section="motivations" aria-expanded="${expandedSection === 'motivations'}">
                <span class="admin-review-section-header-main">
                  <span class="admin-review-section-header-icon bg-description"><img src="/icons/description.png" alt=""></span>
                  <span>${t('admin.users.details.motivations')}</span>
                </span>
                <span class="admin-review-section-header-right">
                  <span class="admin-review-section-reviewed-badge ${motivationsSectionReviewed ? 'is-done' : 'is-progress'}">${motivationsProgressLabel}</span>
                  <span class="admin-review-section-header-chevron" aria-hidden="true"></span>
                </span>
              </button>
              <div class="admin-review-section-body" ${expandedSection === 'motivations' ? '' : 'hidden'}>
                <div class="admin-review-motivation-row">
                  <div class="admin-review-text-block">${details.motivations || '—'}</div>
                  <div class="admin-review-motivation-check">
                    <label class="admin-review-block-check admin-review-block-check-card">
                      <input
                        type="checkbox"
                        class="admin-review-checkbox"
                        data-section="motivations"
                        ${motivationsReviewed ? 'checked' : ''}
                      >
                      <span>${t('review.check.confirmBlock')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section class="admin-review-section ${expandedSection === 'academic' ? 'is-open' : ''} ${academicSectionReviewed ? 'is-reviewed' : ''}">
              <button type="button" class="admin-review-section-header" data-section="academic" aria-expanded="${expandedSection === 'academic'}">
                <span class="admin-review-section-header-main">
                  <span class="admin-review-section-header-icon bg-formation"><img src="/icons/formation.png" alt=""></span>
                  <span>${t('admin.users.details.academicBackground')}</span>
                </span>
                <span class="admin-review-section-header-right">
                  <span class="admin-review-section-reviewed-badge ${academicSectionReviewed ? 'is-done' : 'is-progress'}">${academicProgressLabel}</span>
                  <span class="admin-review-section-header-chevron" aria-hidden="true"></span>
                </span>
              </button>
              <div class="admin-review-section-body admin-review-cards-wrap" ${expandedSection === 'academic' ? '' : 'hidden'}>
                ${academicCards.length === 0 ? `<div class="admin-review-empty-cards">—</div>` : academicCards.map((card, index) => `
                  <article class="admin-review-info-card">
                    <div class="admin-review-info-card-title">
                      <div class="admin-review-info-texts">
                        <div class="admin-review-info-caption">${card.title}</div>
                        <b>${card.course}</b>
                      </div>
                      <div class="admin-review-info-badge-slot admin-review-info-badge-slot-header">
                        ${card.badge ? `<span class="admin-review-info-badge ${getAcademicBadgeClass(card.badge)}">${card.badge}</span>` : ''}
                      </div>
                      <label class="admin-review-block-check admin-review-block-check-card">
                        <input
                          type="checkbox"
                          class="admin-review-checkbox"
                          data-section="academic"
                          data-index="${index}"
                          ${reviewedAcademicCards.has(index) ? 'checked' : ''}
                        >
                        <span>${t('review.check.confirmBlock')}</span>
                      </label>
                    </div>

                    <div class="admin-review-info-grid">
                      <div class="admin-review-info-col">
                        <div class="admin-review-info-item">
                          <span class="admin-review-info-icon bg-formation"><img src="/icons/formation.png" alt=""></span>
                          <div class="admin-review-info-text">
                            <small>${t('review.labels.formation')}</small>
                            <strong>${card.formation}</strong>
                          </div>
                        </div>

                        <div class="admin-review-info-item">
                          <span class="admin-review-info-icon bg-calendar-begin"><img src="/icons/calendar_begin.png" alt=""></span>
                          <div class="admin-review-info-text">
                            <small>${t('review.labels.begin')}</small>
                            <strong>${card.start}</strong>
                          </div>
                        </div>
                      </div>

                      <div class="admin-review-info-col">
                        <div class="admin-review-info-item">
                          <span class="admin-review-info-icon bg-institution"><img src="/icons/institution.png" alt=""></span>
                          <div class="admin-review-info-text">
                            <small>${t('review.labels.institution')}</small>
                            <strong>${card.institution}</strong>
                          </div>
                        </div>

                        <div class="admin-review-info-item">
                          <span class="admin-review-info-icon bg-calendar-end"><img src="/icons/calendar_end.png" alt=""></span>
                          <div class="admin-review-info-text">
                            <small>${t('review.labels.end')}</small>
                            <strong>${card.end}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                  </article>
                `).join('')}
              </div>
            </section>

            <section class="admin-review-section ${expandedSection === 'professional' ? 'is-open' : ''} ${professionalSectionReviewed ? 'is-reviewed' : ''}">
              <button type="button" class="admin-review-section-header" data-section="professional" aria-expanded="${expandedSection === 'professional'}">
                <span class="admin-review-section-header-main">
                  <span class="admin-review-section-header-icon bg-person"><img src="/icons/person.png" alt=""></span>
                  <span>${t('admin.users.details.professionalExperience')}</span>
                </span>
                <span class="admin-review-section-header-right">
                  <span class="admin-review-section-reviewed-badge ${professionalSectionReviewed ? 'is-done' : 'is-progress'}">${professionalProgressLabel}</span>
                  <span class="admin-review-section-header-chevron" aria-hidden="true"></span>
                </span>
              </button>
              <div class="admin-review-section-body admin-review-cards-wrap" ${expandedSection === 'professional' ? '' : 'hidden'}>
                ${professionalCards.length === 0 ? `<div class="admin-review-empty-cards">—</div>` : professionalCards.map((card, index) => `
                  <article class="admin-review-info-card">
                    <div class="admin-review-info-card-title">
                      <div class="admin-review-info-texts">
                        <div class="admin-review-info-caption">${card.subtitle}</div>
                        <b>${card.title}</b>
                      </div>
                      <div class="admin-review-info-badge-slot admin-review-info-badge-slot-header">
                        ${card.badge ? `<span class="admin-review-info-badge ${getProfessionalBadgeClass(card.badge)}">${card.badge}</span>` : ''}
                      </div>
                      <label class="admin-review-block-check admin-review-block-check-card">
                        <input
                          type="checkbox"
                          class="admin-review-checkbox"
                          data-section="professional"
                          data-index="${index}"
                          ${reviewedProfessionalCards.has(index) ? 'checked' : ''}
                        >
                        <span>${t('review.check.confirmBlock')}</span>
                      </label>
                    </div>

                    <div class="admin-review-info-grid">
                      <div class="admin-review-info-col">
                        <div class="admin-review-info-item">
                          <span class="admin-review-info-icon bg-person"><img src="/icons/person.png" alt=""></span>
                          <div class="admin-review-info-text">
                            <small>${t('review.labels.role')}</small>
                            <strong>${card.role}</strong>
                          </div>
                        </div>

                        <div class="admin-review-info-item">
                          <span class="admin-review-info-icon bg-calendar-begin"><img src="/icons/calendar_begin.png" alt=""></span>
                          <div class="admin-review-info-text">
                            <small>${t('review.labels.begin')}</small>
                            <strong>${card.start}</strong>
                          </div>
                        </div>
                      </div>

                      <div class="admin-review-info-col">
                        <div class="admin-review-info-item">
                          <span class="admin-review-info-icon bg-institution"><img src="/icons/institution.png" alt=""></span>
                          <div class="admin-review-info-text">
                            <small>${t('review.labels.company')}</small>
                            <strong>${card.company}</strong>
                          </div>
                        </div>

                        <div class="admin-review-info-item">
                          <span class="admin-review-info-icon bg-calendar-end"><img src="/icons/calendar_end.png" alt=""></span>
                          <div class="admin-review-info-text">
                            <small>${t('review.labels.end')}</small>
                            <strong>${card.end}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="admin-review-info-description">
                      <span class="admin-review-info-icon bg-description"><img src="/icons/description.png" alt=""></span>
                      <div>
                        <small>${t('review.labels.description')}</small>
                        <p>${card.description}</p>
                      </div>
                    </div>

                  </article>
                `).join('')}
              </div>
            </section>
          </div>

          <div class="admin-user-review-footer">
            <button type="button" class="admin-review-cancel-btn" id="admin-review-cancel-btn">${t('review.cancel')}</button>
            <div class="admin-user-review-actions">
              <button type="button" class="admin-review-reject-btn" id="admin-review-reject-btn">${t('review.reject')}</button>
              <button type="button" class="admin-review-approve-btn ${allSectionsReviewed ? '' : 'is-disabled'}" id="admin-review-approve-btn" ${allSectionsReviewed ? '' : 'disabled'}>${t('review.approve')}</button>
            </div>
          </div>
        </div>

        ${decisionModal ? `
          <div class="admin-review-modal-overlay" id="admin-review-modal-overlay">
            <div class="admin-review-modal" role="dialog" aria-modal="true">
              <div class="admin-review-modal-header">
                <b>${decisionModal === 'approve' ? t('review.modal.approve.title') : t('review.modal.reject.title')}</b>
                <button type="button" class="admin-review-modal-close" id="admin-review-modal-close" aria-label="${t('review.modal.common.close')}">×</button>
              </div>

              <div class="admin-review-modal-content">
                <div>${decisionModal === 'approve' ? t('review.modal.approve.description') : t('review.modal.reject.description')}</div>

                <div class="admin-review-modal-user-box">
                  <div class="admin-review-modal-user-col">
                    <div class="admin-review-modal-label">${t('review.modal.common.name')}</div>
                    <div class="admin-review-modal-value">${details.name || '—'}</div>
                  </div>
                  <div class="admin-review-modal-divider"></div>
                  <div class="admin-review-modal-user-col">
                    <div class="admin-review-modal-label">${t('review.modal.common.email')}</div>
                    <div class="admin-review-modal-value">${details.email || '—'}</div>
                  </div>
                </div>

                ${decisionModal === 'reject' ? `
                  <div class="admin-review-modal-reason-wrap">
                    <label class="admin-review-modal-reason-label" for="admin-review-reject-reason">${t('review.modal.reject.reason')} <span>*</span></label>
                    <textarea id="admin-review-reject-reason" class="admin-review-modal-reason" maxlength="100" placeholder="${t('review.modal.reject.reasonPlaceholder')}">${rejectReason}</textarea>
                    <div class="admin-review-modal-counter" id="admin-review-modal-counter">${rejectReasonCounter}</div>
                    ${rejectReasonError ? `<div class="admin-review-modal-error" id="admin-review-modal-error">${rejectReasonError}</div>` : `<div class="admin-review-modal-error" id="admin-review-modal-error" hidden></div>`}
                  </div>
                ` : ''}

                <div>${t('review.modal.common.irreversible')}</div>
              </div>

              <div class="admin-review-modal-actions">
                <button type="button" class="admin-review-modal-back" id="admin-review-modal-back">${t('review.modal.common.back')}</button>
                <button type="button" class="admin-review-modal-confirm ${decisionModal === 'reject' ? 'is-reject' : 'is-approve'}" id="admin-review-modal-confirm" ${isSubmittingDecision ? 'disabled' : ''}>
                  ${decisionModal === 'approve' ? t('review.modal.approve.confirm') : t('review.modal.reject.confirm')}
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </section>
    `

    container.querySelectorAll<HTMLButtonElement>('.admin-review-section-header').forEach((button) => {
      button.addEventListener('click', () => {
        const section = button.dataset.section as ReviewSection | undefined
        if (!section) return
        expandedSection = expandedSection === section ? null : section
        localStorage.setItem(sectionStorageKey, expandedSection ?? 'none')
        render()
      })
    })

    container.querySelectorAll<HTMLInputElement>('.admin-review-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const section = checkbox.dataset.section as ReviewSection | 'motivations' | undefined
        if (!section) return

        if (section === 'motivations') {
          motivationsReviewed = checkbox.checked
          expandedSection = motivationsReviewed ? 'academic' : 'motivations'
          localStorage.setItem(sectionStorageKey, expandedSection ?? 'none')
          render()
          return
        }

        const index = Number(checkbox.dataset.index)
        if (!Number.isInteger(index) || index < 0) return

        const targetSet = section === 'academic' ? reviewedAcademicCards : reviewedProfessionalCards
        if (checkbox.checked) {
          targetSet.add(index)
        } else {
          targetSet.delete(index)
        }

        if (section === 'academic') {
          const academicCompleted = academicCards.length === 0 || reviewedAcademicCards.size === academicCards.length
          expandedSection = academicCompleted ? 'professional' : 'academic'
        } else {
          const professionalCompleted = professionalCards.length === 0 || reviewedProfessionalCards.size === professionalCards.length
          expandedSection = professionalCompleted ? null : 'professional'
        }

        localStorage.setItem(sectionStorageKey, expandedSection ?? 'none')

        render()
      })
    })

    const cancelButton = container.querySelector('#admin-review-cancel-btn') as HTMLButtonElement | null
    cancelButton?.addEventListener('click', navigateBack)

    const topBackButton = container.querySelector('#admin-review-back-top-btn') as HTMLButtonElement | null
    topBackButton?.addEventListener('click', navigateBack)

    const approveButton = container.querySelector('#admin-review-approve-btn') as HTMLButtonElement | null
    approveButton?.addEventListener('click', () => {
      if (approveButton.disabled) return
      decisionModal = 'approve'
      rejectReasonError = ''
      render()
    })

    const rejectButton = container.querySelector('#admin-review-reject-btn') as HTMLButtonElement | null
    rejectButton?.addEventListener('click', () => {
      decisionModal = 'reject'
      rejectReasonError = ''
      render()
    })

    const closeModal = () => {
      if (isSubmittingDecision) return
      decisionModal = null
      rejectReasonError = ''
      render()
    }

    const modalOverlay = container.querySelector('#admin-review-modal-overlay') as HTMLDivElement | null
    modalOverlay?.addEventListener('click', (event) => {
      if (event.target === modalOverlay) closeModal()
    })

    const modalCloseButton = container.querySelector('#admin-review-modal-close') as HTMLButtonElement | null
    modalCloseButton?.addEventListener('click', closeModal)

    const modalBackButton = container.querySelector('#admin-review-modal-back') as HTMLButtonElement | null
    modalBackButton?.addEventListener('click', closeModal)

    const reasonInput = container.querySelector('#admin-review-reject-reason') as HTMLTextAreaElement | null
    const reasonCounter = container.querySelector('#admin-review-modal-counter') as HTMLDivElement | null
    const reasonError = container.querySelector('#admin-review-modal-error') as HTMLDivElement | null
    reasonInput?.addEventListener('input', () => {
      rejectReason = reasonInput.value

      if (reasonCounter) {
        reasonCounter.textContent = `${rejectReason.length} / 100`
      }

      rejectReasonError = ''
      if (reasonError) {
        reasonError.hidden = true
        reasonError.textContent = ''
      }
    })

    const modalConfirmButton = container.querySelector('#admin-review-modal-confirm') as HTMLButtonElement | null
    modalConfirmButton?.addEventListener('click', async () => {
      if (!decisionModal || isSubmittingDecision) return

      if (decisionModal === 'reject') {
        const trimmedReason = rejectReason.trim()
        if (!trimmedReason) {
          rejectReasonError = t('review.errors.reasonRequired')
          render()
          return
        }
      }

      isSubmittingDecision = true
      render()

      try {
        if (decisionModal === 'approve') {
          toast(t('review.feedback.approving'), 'loading')
          await adminUsersApi.approveRegistration(userId)
          toast(t('review.feedback.approved'), 'success')
          sessionStorage.setItem(REVIEW_RESULT_STORAGE_KEY, 'approved')
        } else {
          toast(t('review.feedback.rejecting'), 'loading')
          await adminUsersApi.rejectRegistration(userId, {
            reason: rejectReason.trim(),
          })
          toast(t('review.feedback.rejected'), 'success')
          sessionStorage.setItem(REVIEW_RESULT_STORAGE_KEY, 'rejected')
        }

        window.location.assign(routes.adminUsers)
      } catch (error) {
        const message = getReviewTransitionErrorMessage(error)
        rejectReasonError = decisionModal === 'reject' ? message : ''
        toast(message, 'error')
        isSubmittingDecision = false
        render()
      }
    })
  }

  const loadDetails = async () => {
    render()

    try {
      details = await adminUsersApi.getUserById(userId)
      render()
    } catch (error) {
      container.innerHTML = `<section class="admin-user-review-page"><p class="admin-review-error">${getReviewErrorMessage(error)}</p></section>`
      toast(getReviewErrorMessage(error), 'error')
    }
  }

  void loadDetails()
}
