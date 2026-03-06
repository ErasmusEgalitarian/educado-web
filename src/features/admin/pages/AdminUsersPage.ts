import { adminUsersApi, type AdminUserDetails, type AdminUserListItem, type AdminUserStatus } from '@/features/admin/api/admin-users.api'
import { getCurrentUser } from '@/shared/api/auth-session'
import { ApiError } from '@/shared/api/http'
import { routes } from '@/app/routes'
import { t } from '@/shared/i18n'
import { toast } from '@/shared/ui/toast'
import '@/features/admin/styles/admin-users.css'

type SortType = 'recent' | 'oldest'
type StatusFilter = 'ALL' | AdminUserStatus

const REVIEW_RESULT_STORAGE_KEY = 'admin-users.review-result'

const statusPriority: Record<AdminUserStatus, number> = {
  DRAFT_PROFILE: 0,
  PENDING_REVIEW: 1,
  APPROVED: 2,
  REJECTED: 3,
}

interface ParsedAcademicItem {
  subtitle: string
  title: string
  formation: string
  institution: string
  start: string
  end: string
  badge?: string
}

interface ParsedProfessionalItem {
  subtitle: string
  title: string
  role: string
  company: string
  start: string
  end: string
  description: string
  badge?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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

function parseAcademicDetails(rawValue: string | null): ParsedAcademicItem[] {
  const parsed = parseMaybeJson(rawValue)
  const sourceArray = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { items?: unknown[] }).items)
      ? ((parsed as { items: unknown[] }).items)
      : null

  if (sourceArray && sourceArray.length > 0) {
    return sourceArray.map((entry, index) => {
      const item = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>
      return {
        subtitle: String(item.subtitle ?? t('review.academic.cardTitle', { index: index + 1 })),
        title: String(item.title ?? item.course ?? item.degree ?? item.program ?? '—'),
        formation: String(item.formation ?? item.level ?? item.type ?? '—'),
        institution: String(item.institution ?? item.school ?? item.university ?? '—'),
        start: String(item.start ?? item.startDate ?? '—'),
        end: String(item.end ?? item.endDate ?? '—'),
        badge: typeof item.status === 'string' ? item.status : undefined,
      }
    })
  }

  if (!rawValue) return []

  return rawValue
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const [subtitlePart, ...parts] = entry.split('|').map((value) => value.trim())
      const subtitleSeparator = subtitlePart.indexOf(':')

      if (parts.length < 4) {
        return {
          subtitle: t('review.academic.cardTitle', { index: index + 1 }),
          title: entry,
          formation: '—',
          institution: '—',
          start: '—',
          end: '—',
        }
      }

      const subtitle = subtitleSeparator >= 0 ? subtitlePart.slice(0, subtitleSeparator).trim() : subtitlePart
      const formation = subtitleSeparator >= 0 ? subtitlePart.slice(subtitleSeparator + 1).trim() : parts[0]
      const status = subtitleSeparator >= 0 ? parts[0] : parts[1]
      const title = subtitleSeparator >= 0 ? parts[1] : parts[2]
      const institution = subtitleSeparator >= 0 ? parts[2] : parts[3]
      const period = subtitleSeparator >= 0 ? parts[3] : parts[4]
      const { start, end } = parsePeriodRange(String(period ?? ''))

      return {
        subtitle: subtitle || t('review.academic.cardTitle', { index: index + 1 }),
        title: title || '—',
        formation: formation || '—',
        institution: institution || '—',
        start,
        end,
        badge: status || undefined,
      }
    })
}

function parseProfessionalDetails(rawValue: string | null): ParsedProfessionalItem[] {
  const parsed = parseMaybeJson(rawValue)
  const sourceArray = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { items?: unknown[] }).items)
      ? ((parsed as { items: unknown[] }).items)
      : null

  if (sourceArray && sourceArray.length > 0) {
    return sourceArray.map((entry, index) => {
      const item = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>
      const rawEnd = item.end ?? item.endDate ?? item.current
      const normalizedRawEnd = rawEnd == null ? '' : String(rawEnd).trim()
      const hasOpenEnd =
        !normalizedRawEnd ||
        normalizedRawEnd === '—' ||
        normalizedRawEnd.toLowerCase() === 'current' ||
        normalizedRawEnd.toLowerCase() === 'atual'
      const end = hasOpenEnd ? '--/--' : normalizedRawEnd
      return {
        subtitle: String(item.subtitle ?? t('review.professional.cardTitle', { index: index + 1 })),
        title: String(item.title ?? item.name ?? item.position ?? item.role ?? '—'),
        role: String(item.role ?? item.position ?? item.title ?? item.name ?? '—'),
        company: String(item.company ?? item.institution ?? item.role ?? item.position ?? '—'),
        start: String(item.start ?? item.startDate ?? '—'),
        end,
        description: String(item.description ?? item.activities ?? '—'),
        badge: typeof item.status === 'string' ? item.status : hasOpenEnd ? t('review.professional.currentJob') : undefined,
      }
    })
  }

  if (!rawValue) return []

  return rawValue
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => {
      const [subtitlePart, ...parts] = entry.split('|').map((value) => value.trim())
      const subtitleSeparator = subtitlePart.indexOf(':')

      if (parts.length < 3) {
        return {
          subtitle: t('review.professional.cardTitle', { index: index + 1 }),
          title: entry,
          role: '—',
          company: '—',
          start: '—',
          end: '—',
          description: '—',
        }
      }

      const subtitle = subtitleSeparator >= 0 ? subtitlePart.slice(0, subtitleSeparator).trim() : t('review.professional.cardTitle', { index: index + 1 })
      const companyFromTitle = subtitleSeparator >= 0 ? subtitlePart.slice(subtitleSeparator + 1).trim() : parts[0]
      const role = subtitleSeparator >= 0 ? parts[0] : (parts[1] ?? parts[0])
      const title = role
      const period = subtitleSeparator >= 0 ? parts[1] : parts[2]
      const description = subtitleSeparator >= 0 ? parts[2] : parts.slice(3).join(' | ')
      const company = companyFromTitle || role
      const { start, end, hasOpenEnd } = parsePeriodRange(String(period ?? ''))

      return {
        subtitle: subtitle || t('review.professional.cardTitle', { index: index + 1 }),
        title: title || '—',
        role: role || '—',
        company: company || '—',
        start,
        end: hasOpenEnd ? '--/--' : end,
        description: description || '—',
        badge: hasOpenEnd ? t('review.professional.currentJob') : undefined,
      }
    })
}

function getStatusLabel(status: AdminUserStatus) {
  if (status === 'APPROVED') return t('admin.users.status.approved')
  if (status === 'REJECTED') return t('admin.users.status.rejected')
  if (status === 'DRAFT_PROFILE') return t('admin.users.status.draft')
  return t('admin.users.status.pending')
}

function getStatusClass(status: AdminUserStatus) {
  if (status === 'APPROVED') return 'admin-users-status-approved'
  if (status === 'REJECTED') return 'admin-users-status-rejected'
  if (status === 'DRAFT_PROFILE') return 'admin-users-status-draft'
  return 'admin-users-status-pending'
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString()
}

function getUsersErrorMessage(error: unknown, action: 'list' | 'details' | 'toggleRole' | 'delete') {
  if (!(error instanceof ApiError)) return t('admin.users.errors.generic')

  if (error.status === 401 || error.code === 'UNAUTHORIZED') return t('admin.users.errors.unauthorized')
  if (error.status === 403 || error.code === 'FORBIDDEN') return t('admin.users.errors.forbidden')

  if (action === 'details' && (error.status === 404 || error.code === 'USER_NOT_FOUND')) return t('admin.users.errors.userNotFound')

  if (action === 'toggleRole' && error.code === 'SELF_ROLE_CHANGE_NOT_ALLOWED') {
    return t('admin.users.errors.selfRoleChangeNotAllowed')
  }

  if (action === 'delete' && error.code === 'SELF_DELETE_NOT_ALLOWED') {
    return t('admin.users.errors.selfDeleteNotAllowed')
  }

  if ((action === 'toggleRole' || action === 'delete') && (error.status === 404 || error.code === 'USER_NOT_FOUND')) {
    return t('admin.users.errors.userNotFound')
  }

  if (error.status === 500 || error.code === 'INTERNAL_SERVER_ERROR') return t('admin.users.errors.internal')

  return t('admin.users.errors.generic')
}

export function renderAdminUsersPage(container: HTMLElement) {
  let users: AdminUserListItem[] = []
  let sort: SortType = 'recent'
  let statusFilter: StatusFilter = 'ALL'
  const currentUserId = getCurrentUser()?.id

  const renderBase = () => {
    container.innerHTML = `
      <section class="admin-users-page">
        <div class="admin-users-card">
          <div class="admin-users-top-tabs">
            <button type="button" class="admin-users-top-tab is-active">${t('admin.users.topTabs.users')}</button>
            <button type="button" class="admin-users-top-tab" data-nav="institutions">${t('admin.users.topTabs.institutions')}</button>
          </div>

          <div class="admin-users-filters-row">
            <label class="admin-users-filter" for="admin-users-sort">
              <select id="admin-users-sort" class="admin-users-filter-input">
                <option value="recent">${t('admin.users.filters.sortRecent')}</option>
                <option value="oldest">${t('admin.users.filters.sortOldest')}</option>
              </select>
            </label>

            <label class="admin-users-filter" for="admin-users-status">
              <select id="admin-users-status" class="admin-users-filter-input">
                <option value="ALL">${t('admin.users.filters.allStatuses')}</option>
                <option value="DRAFT_PROFILE">${t('admin.users.status.draft')}</option>
                <option value="PENDING_REVIEW">${t('admin.users.status.pending')}</option>
                <option value="APPROVED">${t('admin.users.status.approved')}</option>
                <option value="REJECTED">${t('admin.users.status.rejected')}</option>
              </select>
            </label>
          </div>

          <div class="admin-users-table-wrap">
            <table class="admin-users-table">
              <thead>
                <tr>
                  <th>${t('admin.users.columns.isAdmin')}</th>
                  <th>${t('admin.users.columns.name')}</th>
                  <th>${t('admin.users.columns.email')}</th>
                  <th>${t('admin.users.columns.status')}</th>
                  <th>${t('admin.users.columns.submittedAt')}</th>
                  <th>${t('admin.users.columns.approvedAt')}</th>
                  <th>${t('admin.users.columns.actions')}</th>
                </tr>
              </thead>
              <tbody id="admin-users-tbody"></tbody>
            </table>
          </div>
        </div>
      </section>
    `

    const sortSelect = container.querySelector('#admin-users-sort') as HTMLSelectElement | null
    sortSelect?.addEventListener('change', () => {
      sort = sortSelect.value === 'oldest' ? 'oldest' : 'recent'
      renderRows()
    })

    const statusSelect = container.querySelector('#admin-users-status') as HTMLSelectElement | null
    statusSelect?.addEventListener('change', () => {
      const nextValue = statusSelect.value as StatusFilter
      statusFilter = nextValue
      renderRows()
    })

    const institutionsTab = container.querySelector('[data-nav="institutions"]') as HTMLButtonElement | null
    institutionsTab?.addEventListener('click', () => {
      window.location.assign(routes.adminInstitutions)
    })
  }

  const getVisibleUsers = () => {
    const filtered = statusFilter === 'ALL' ? [...users] : users.filter((user) => user.status === statusFilter)

    filtered.sort((a, b) => {
      const aIsCurrent = a.id === currentUserId
      const bIsCurrent = b.id === currentUserId

      if (aIsCurrent !== bIsCurrent) {
        return aIsCurrent ? -1 : 1
      }

      const aTime = new Date(a.registrationSubmittedAt ?? a.registrationApprovedAt ?? 0).getTime()
      const bTime = new Date(b.registrationSubmittedAt ?? b.registrationApprovedAt ?? 0).getTime()

      if (aTime !== bTime) {
        return sort === 'oldest' ? aTime - bTime : bTime - aTime
      }

      return statusPriority[a.status] - statusPriority[b.status]
    })

    return filtered
  }

  const renderRows = () => {
    const tbody = container.querySelector('#admin-users-tbody') as HTMLElement | null
    if (!tbody) return

    const visibleUsers = getVisibleUsers()

    if (visibleUsers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="admin-users-empty">${t('admin.users.empty')}</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = visibleUsers
      .map((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.trim()
        const canToggleRole = user.status === 'APPROVED' && user.id !== currentUserId
        const canReview = user.status === 'PENDING_REVIEW'
        const reviewIconByStatus: Record<AdminUserStatus, string> = {
          PENDING_REVIEW: '/icons/review.png',
          DRAFT_PROFILE: '/icons/review_unvailable.png',
          APPROVED: '/icons/review_approved.png',
          REJECTED: '/icons/review_rejected.png',
        }
        const reviewIcon = reviewIconByStatus[user.status]
        const reviewTooltip = canReview ? t('admin.users.actions.review') : t('admin.users.actions.reviewUnavailable')
        const isAdmin = user.role === 'ADMIN'
        const isCurrentUser = user.id === currentUserId

        return `
          <tr class="${isCurrentUser ? 'admin-users-row-self' : ''}">
            <td>
              <label class="admin-users-switch ${canToggleRole ? '' : 'is-disabled'}" aria-label="is_admin">
                <input
                  type="checkbox"
                  class="admin-users-role-toggle"
                  data-action="toggle-role"
                  data-user-id="${user.id}"
                  ${isAdmin ? 'checked' : ''}
                  ${canToggleRole ? '' : 'disabled'}
                >
                <span class="admin-users-switch-slider"></span>
              </label>
            </td>
            <td>
              <div class="admin-users-name-cell">
                <span class="admin-users-name-text">${fullName || '—'}</span>
                ${isCurrentUser ? `<span class="admin-users-self-badge">${t('admin.users.currentUser')}</span>` : ''}
              </div>
            </td>
            <td>${user.email}</td>
            <td>
              <span class="admin-users-status ${getStatusClass(user.status)}">${getStatusLabel(user.status)}</span>
            </td>
            <td>${formatDate(user.registrationSubmittedAt)}</td>
            <td>${formatDate(user.registrationApprovedAt)}</td>
            <td>
              <div class="admin-users-icon-actions">
                <span class="admin-users-icon-tooltip" data-tooltip="${t('admin.users.actions.details')}">
                  <button
                    type="button"
                    class="admin-users-action-icon-btn"
                    data-action="details"
                    data-user-id="${user.id}"
                    aria-label="${t('admin.users.actions.details')}"
                  >
                    <img src="/icons/visibility.png" alt="${t('admin.users.actions.details')}">
                  </button>
                </span>

                <span class="admin-users-icon-tooltip" data-tooltip="${reviewTooltip}">
                  <button
                    type="button"
                    class="admin-users-action-icon-btn ${canReview ? '' : 'is-disabled'}"
                    data-action="review"
                    data-user-id="${user.id}"
                    aria-label="${reviewTooltip}"
                    ${canReview ? '' : 'disabled'}
                  >
                    <img src="${reviewIcon}" alt="${reviewTooltip}">
                  </button>
                </span>

                <span class="admin-users-icon-tooltip" data-tooltip="${t('admin.users.actions.delete')}">
                  <button
                    type="button"
                    class="admin-users-action-icon-btn admin-users-delete-icon-btn"
                    data-action="delete"
                    data-user-id="${user.id}"
                    aria-label="${t('admin.users.actions.delete')}"
                  >
                    <img src="/icons/delete.png" alt="${t('admin.users.actions.delete')}">
                  </button>
                </span>
              </div>
            </td>
          </tr>
        `
      })
      .join('')

    tbody.querySelectorAll<HTMLInputElement>('[data-action="toggle-role"]').forEach((input) => {
      input.addEventListener('change', () => {
        const userId = input.dataset.userId
        if (!userId) return
        void handleToggleRole(userId)
      })
    })

    tbody.querySelectorAll<HTMLButtonElement>('[data-action="details"]').forEach((button) => {
      button.addEventListener('click', () => {
        const userId = button.dataset.userId
        if (!userId) return
        void handleOpenDetails(userId)
      })
    })

    tbody.querySelectorAll<HTMLButtonElement>('[data-action="delete"]').forEach((button) => {
      button.addEventListener('click', () => {
        const userId = button.dataset.userId
        if (!userId) return
        void handleDeleteUser(userId)
      })
    })

    tbody.querySelectorAll<HTMLButtonElement>('[data-action="review"]').forEach((button) => {
      button.addEventListener('click', () => {
        const userId = button.dataset.userId
        if (!userId) return
        const url = `${routes.adminUserReview}?userId=${encodeURIComponent(userId)}`
        window.location.assign(url)
      })
    })

  }

  const openDetailsModal = (details: AdminUserDetails) => {
    const academicItems = parseAcademicDetails(details.academicBackground)
    const professionalItems = parseProfessionalDetails(details.professionalExperience)

    const overlay = document.createElement('div')
    overlay.className = 'admin-users-modal-overlay'
    overlay.innerHTML = `
      <div class="admin-users-modal" role="dialog" aria-modal="true" aria-labelledby="admin-users-modal-title">
        <header class="admin-users-modal-header">
          <h2 id="admin-users-modal-title">${t('admin.users.details.title')}</h2>
          <button type="button" class="admin-users-modal-close" aria-label="${t('admin.users.details.close')}">✕</button>
        </header>

        <div class="admin-users-modal-body">
          <p><strong>${t('admin.users.columns.name')}:</strong> ${details.name || '—'}</p>
          <p><strong>${t('admin.users.columns.email')}:</strong> ${details.email || '—'}</p>
          <p><strong>${t('admin.users.columns.status')}:</strong> ${details.status || '—'}</p>

          <div class="admin-users-modal-section">
            <h3>${t('admin.users.details.motivations')}</h3>
            <p>${details.motivations || '—'}</p>
          </div>

          <div class="admin-users-modal-section">
            <h3>${t('admin.users.details.academicBackground')}</h3>
            ${academicItems.length === 0
              ? '<p>—</p>'
              : `<div class="admin-users-modal-cards">${academicItems
                  .map((item) => {
                    const badge = item.badge
                      ? `<span class="admin-users-modal-badge">${escapeHtml(item.badge)}</span>`
                      : ''

                    return `
                      <article class="admin-users-modal-card">
                        <header class="admin-users-modal-card-header">
                          <div>
                            <div class="admin-users-modal-card-caption">${escapeHtml(item.subtitle)}</div>
                            <strong>${escapeHtml(item.title)}</strong>
                          </div>
                          ${badge}
                        </header>

                        <div class="admin-users-modal-card-grid">
                          <div><small>${t('review.labels.formation')}</small><strong>${escapeHtml(item.formation)}</strong></div>
                          <div><small>${t('review.labels.institution')}</small><strong>${escapeHtml(item.institution)}</strong></div>
                          <div><small>${t('review.labels.begin')}</small><strong>${escapeHtml(item.start)}</strong></div>
                          <div><small>${t('review.labels.end')}</small><strong>${escapeHtml(item.end)}</strong></div>
                        </div>
                      </article>
                    `
                  })
                  .join('')}</div>`}
          </div>

          <div class="admin-users-modal-section">
            <h3>${t('admin.users.details.professionalExperience')}</h3>
            ${professionalItems.length === 0
              ? '<p>—</p>'
              : `<div class="admin-users-modal-cards">${professionalItems
                  .map((item) => {
                    const badge = item.badge
                      ? `<span class="admin-users-modal-badge">${escapeHtml(item.badge)}</span>`
                      : ''

                    return `
                      <article class="admin-users-modal-card">
                        <header class="admin-users-modal-card-header">
                          <div>
                            <div class="admin-users-modal-card-caption">${escapeHtml(item.subtitle)}</div>
                            <strong>${escapeHtml(item.title)}</strong>
                          </div>
                          ${badge}
                        </header>

                        <div class="admin-users-modal-card-grid">
                          <div><small>${t('review.labels.role')}</small><strong>${escapeHtml(item.role)}</strong></div>
                          <div><small>${t('review.labels.company')}</small><strong>${escapeHtml(item.company)}</strong></div>
                          <div><small>${t('review.labels.begin')}</small><strong>${escapeHtml(item.start)}</strong></div>
                          <div><small>${t('review.labels.end')}</small><strong>${escapeHtml(item.end)}</strong></div>
                        </div>

                        <div class="admin-users-modal-card-description">
                          <small>${t('review.labels.description')}</small>
                          <p>${escapeHtml(item.description)}</p>
                        </div>
                      </article>
                    `
                  })
                  .join('')}</div>`}
          </div>
        </div>
      </div>
    `

    document.body.appendChild(overlay)

    const close = () => overlay.remove()

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close()
    })

    const closeButton = overlay.querySelector('.admin-users-modal-close') as HTMLButtonElement | null
    closeButton?.addEventListener('click', close)
  }

  const handleOpenDetails = async (userId: string) => {
    try {
      const details = await adminUsersApi.getUserById(userId)
      openDetailsModal(details)
    } catch (error) {
      toast(getUsersErrorMessage(error, 'details'), 'error')
    }
  }

  const handleToggleRole = async (userId: string) => {
    const targetUser = users.find((user) => user.id === userId)
    if (!targetUser) {
      toast(t('admin.users.errors.userNotFound'), 'error')
      return
    }

    if (targetUser.id === currentUserId) {
      toast(t('admin.users.errors.selfRoleChangeNotAllowed'), 'error')
      renderRows()
      return
    }

    if (targetUser.status !== 'APPROVED') {
      toast(t('admin.users.errors.roleChangeRequiresApproval'), 'error')
      renderRows()
      return
    }

    try {
      await adminUsersApi.toggleUserRole(userId)
      toast(t('admin.users.feedback.roleUpdated'), 'success')
      await loadUsers()
    } catch (error) {
      toast(getUsersErrorMessage(error, 'toggleRole'), 'error')
      renderRows()
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm(t('admin.users.confirmDelete'))) return

    try {
      await adminUsersApi.deleteUser(userId)
      toast(t('admin.users.feedback.deleted'), 'success')
      await loadUsers()
    } catch (error) {
      toast(getUsersErrorMessage(error, 'delete'), 'error')
    }
  }

  const loadUsers = async () => {
    const tbody = container.querySelector('#admin-users-tbody') as HTMLElement | null
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="admin-users-empty">${t('admin.users.loading')}</td>
        </tr>
      `
    }

    try {
      users = await adminUsersApi.listUsers()
      renderRows()

      const reviewResult = sessionStorage.getItem(REVIEW_RESULT_STORAGE_KEY)
      if (reviewResult === 'approved') {
        toast(t('admin.users.feedback.registrationApproved'), 'success')
        sessionStorage.removeItem(REVIEW_RESULT_STORAGE_KEY)
      } else if (reviewResult === 'rejected') {
        toast(t('admin.users.feedback.registrationRejected'), 'success')
        sessionStorage.removeItem(REVIEW_RESULT_STORAGE_KEY)
      }
    } catch (error) {
      users = []
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="admin-users-empty">${t('admin.users.loadError')}</td>
          </tr>
        `
      }
      toast(getUsersErrorMessage(error, 'list'), 'error')
    }
  }

  renderBase()
  void loadUsers()
}
