import {
  institutionsApi,
  type Institution,
  type InstitutionPayload,
  type InstitutionUpdatePayload,
} from '@/features/admin/api/institutions.api'
import { routes } from '@/app/routes'
import { ApiError } from '@/shared/api/http'
import { t } from '@/shared/i18n'
import { toast } from '@/shared/ui/toast'
import '@/features/admin/styles/admin-institutions.css'

type SortType = 'recent' | 'oldest'
type DateFieldType = 'createdAt' | 'updatedAt'
type ModalMode = 'create' | 'edit'

interface InstitutionFormState {
  name: string
  domain: string
  secondaryDomain: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizeDomain(value: string) {
  return value.trim().replace(/^@+/, '').toLowerCase()
}

function isValidDomain(value: string) {
  return /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
}

function mapFieldError(field: string, code: string) {
  if (field === 'name') {
    if (code === 'REQUIRED') return t('admin.institutions.errors.nameRequired')
    if (code === 'ALREADY_EXISTS') return t('admin.institutions.errors.nameAlreadyExists')
  }

  if (field === 'domain') {
    if (code === 'REQUIRED') return t('admin.institutions.errors.domainRequired')
    if (code === 'INVALID_FORMAT') return t('admin.institutions.errors.domainInvalidFormat')
    if (code === 'ALREADY_EXISTS') return t('admin.institutions.errors.domainAlreadyExists')
  }

  if (field === 'secondaryDomain') {
    if (code === 'INVALID_FORMAT') return t('admin.institutions.errors.secondaryDomainInvalidFormat')
    if (code === 'ALREADY_EXISTS') return t('admin.institutions.errors.secondaryDomainAlreadyExists')
    if (code === 'MUST_DIFFER_FROM_DOMAIN') return t('admin.institutions.errors.secondaryDomainMustDiffer')
  }

  return t('admin.institutions.errors.generic')
}

function getInstitutionsErrorMessage(error: unknown, action: 'list' | 'details' | 'create' | 'update' | 'delete') {
  if (!(error instanceof ApiError)) return t('admin.institutions.errors.generic')

  if (error.status === 401 || error.code === 'UNAUTHORIZED') return t('admin.institutions.errors.unauthorized')
  if (error.status === 403 || error.code === 'FORBIDDEN') return t('admin.institutions.errors.forbidden')

  if ((action === 'details' || action === 'update' || action === 'delete') && (error.status === 404 || error.code === 'INSTITUTION_NOT_FOUND')) {
    return t('admin.institutions.errors.notFound')
  }

  if ((action === 'create' || action === 'update') && error.status === 422 && error.code === 'VALIDATION_ERROR') {
    const fieldErrors = error.fieldErrors ?? {}
    const [field, code] = Object.entries(fieldErrors)[0] ?? []
    if (field && code) return mapFieldError(field, code)
    return t('admin.institutions.errors.validation')
  }

  return t('admin.institutions.errors.generic')
}

function openInstitutionModal(options: {
  mode: ModalMode
  initialValue?: Institution
  onSubmit: (payload: InstitutionPayload | InstitutionUpdatePayload) => Promise<void>
}) {
  const { mode, initialValue, onSubmit } = options
  const form: InstitutionFormState = {
    name: initialValue?.name ?? '',
    domain: normalizeDomain(initialValue?.domain ?? ''),
    secondaryDomain: normalizeDomain(initialValue?.secondaryDomain ?? ''),
  }

  const overlay = document.createElement('div')
  overlay.className = 'admin-institutions-modal-overlay'
  overlay.innerHTML = `
    <div class="admin-institutions-modal" role="dialog" aria-modal="true" aria-labelledby="admin-institutions-modal-title">
      <header class="admin-institutions-modal-header">
        <h2 id="admin-institutions-modal-title">${mode === 'create' ? t('admin.institutions.modal.createTitle') : t('admin.institutions.modal.editTitle')}</h2>
        <button type="button" class="admin-institutions-modal-close" aria-label="${t('admin.institutions.modal.close')}">✕</button>
      </header>

      <form class="admin-institutions-modal-form">
        <label>
          <span>${t('admin.institutions.fields.name')}</span>
          <input name="name" value="${escapeHtml(form.name)}" placeholder="${t('admin.institutions.fields.namePlaceholder')}" required>
        </label>

        <label>
          <span>${t('admin.institutions.fields.domain')}</span>
          <input name="domain" value="${escapeHtml(form.domain)}" placeholder="${t('admin.institutions.fields.domainPlaceholder')}" required>
        </label>

        <label>
          <span>${t('admin.institutions.fields.secondaryDomain')}</span>
          <input name="secondaryDomain" value="${escapeHtml(form.secondaryDomain)}" placeholder="${t('admin.institutions.fields.secondaryDomainPlaceholder')}">
        </label>

        <p class="admin-institutions-modal-error" aria-live="polite"></p>

        <footer class="admin-institutions-modal-footer">
          <button type="button" class="admin-institutions-btn-secondary" data-action="cancel">${t('admin.institutions.modal.cancel')}</button>
          <button type="submit" class="admin-institutions-btn-primary">${mode === 'create' ? t('admin.institutions.modal.create') : t('admin.institutions.modal.save')}</button>
        </footer>
      </form>
    </div>
  `

  document.body.appendChild(overlay)

  const close = () => overlay.remove()

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close()
  })

  const closeButton = overlay.querySelector('.admin-institutions-modal-close') as HTMLButtonElement | null
  closeButton?.addEventListener('click', close)

  const cancelButton = overlay.querySelector('[data-action="cancel"]') as HTMLButtonElement | null
  cancelButton?.addEventListener('click', close)

  const formElement = overlay.querySelector('.admin-institutions-modal-form') as HTMLFormElement | null
  const errorElement = overlay.querySelector('.admin-institutions-modal-error') as HTMLElement | null

  formElement?.addEventListener('submit', async (event) => {
    event.preventDefault()

    const nameInput = formElement.elements.namedItem('name') as HTMLInputElement | null
    const domainInput = formElement.elements.namedItem('domain') as HTMLInputElement | null
    const secondaryDomainInput = formElement.elements.namedItem('secondaryDomain') as HTMLInputElement | null

    const name = nameInput?.value.trim() ?? ''
    const domain = normalizeDomain(domainInput?.value ?? '')
    const secondaryDomainRaw = normalizeDomain(secondaryDomainInput?.value ?? '')

    if (!name) {
      if (errorElement) errorElement.textContent = t('admin.institutions.errors.nameRequired')
      return
    }

    if (!domain) {
      if (errorElement) errorElement.textContent = t('admin.institutions.errors.domainRequired')
      return
    }

    if (!isValidDomain(domain)) {
      if (errorElement) errorElement.textContent = t('admin.institutions.errors.domainInvalidFormat')
      return
    }

    if (secondaryDomainRaw && !isValidDomain(secondaryDomainRaw)) {
      if (errorElement) errorElement.textContent = t('admin.institutions.errors.secondaryDomainInvalidFormat')
      return
    }

    if (secondaryDomainRaw && secondaryDomainRaw === domain) {
      if (errorElement) errorElement.textContent = t('admin.institutions.errors.secondaryDomainMustDiffer')
      return
    }

    const submitButton = formElement.querySelector('button[type="submit"]') as HTMLButtonElement | null
    if (submitButton) submitButton.disabled = true
    if (errorElement) errorElement.textContent = ''

    try {
      if (mode === 'create') {
        const payload: InstitutionPayload = {
          name,
          domain,
          ...(secondaryDomainRaw ? { secondaryDomain: secondaryDomainRaw } : {}),
        }
        await onSubmit(payload)
      } else {
        const payload: InstitutionUpdatePayload = {
          name,
          domain,
          ...(secondaryDomainRaw
            ? { secondaryDomain: secondaryDomainRaw }
            : {}),
        }
        await onSubmit(payload)
      }
      close()
    } catch (error) {
      if (errorElement) errorElement.textContent = error instanceof Error ? error.message : t('admin.institutions.errors.generic')
      if (submitButton) submitButton.disabled = false
    }
  })
}

export function renderAdminInstitutionsPage(container: HTMLElement) {
  let institutions: Institution[] = []
  let sort: SortType = 'recent'
  let dateField: DateFieldType = 'updatedAt'
  const togglingInstitutionIds = new Set<string>()

  const renderBase = () => {
    container.innerHTML = `
      <section class="admin-institutions-page">
        <div class="admin-institutions-card">
          <div class="admin-institutions-top-tabs">
            <button type="button" class="admin-institutions-top-tab" data-nav="users">${t('admin.users.topTabs.users')}</button>
            <button type="button" class="admin-institutions-top-tab is-active">${t('admin.users.topTabs.institutions')}</button>
          </div>

          <div class="admin-institutions-filters-row">
            <label class="admin-institutions-filter" for="admin-institutions-sort">
              <select id="admin-institutions-sort" class="admin-institutions-filter-input">
                <option value="recent">${t('admin.institutions.filters.sortRecent')}</option>
                <option value="oldest">${t('admin.institutions.filters.sortOldest')}</option>
              </select>
            </label>

            <label class="admin-institutions-filter" for="admin-institutions-date-field">
              <select id="admin-institutions-date-field" class="admin-institutions-filter-input">
                <option value="updatedAt">${t('admin.institutions.filters.lastIncluded')}</option>
                <option value="createdAt">${t('admin.institutions.filters.createdAt')}</option>
              </select>
            </label>

            <button type="button" class="admin-institutions-btn-primary" id="admin-institutions-add-btn">${t('admin.institutions.actions.add')}</button>
          </div>

          <div class="admin-institutions-table-wrap">
            <table class="admin-institutions-table">
              <thead>
                <tr>
                  <th>${t('admin.institutions.columns.active')}</th>
                  <th>${t('admin.institutions.columns.name')}</th>
                  <th>${t('admin.institutions.columns.domain')}</th>
                  <th>${t('admin.institutions.columns.secondaryDomain')}</th>
                  <th>${t('admin.institutions.columns.actions')}</th>
                </tr>
              </thead>
              <tbody id="admin-institutions-tbody"></tbody>
            </table>
          </div>
        </div>
      </section>
    `

    const usersTab = container.querySelector('[data-nav="users"]') as HTMLButtonElement | null
    usersTab?.addEventListener('click', () => {
      window.location.assign(routes.adminUsers)
    })

    const sortSelect = container.querySelector('#admin-institutions-sort') as HTMLSelectElement | null
    sortSelect?.addEventListener('change', () => {
      sort = sortSelect.value === 'oldest' ? 'oldest' : 'recent'
      renderRows()
    })

    const dateFieldSelect = container.querySelector('#admin-institutions-date-field') as HTMLSelectElement | null
    dateFieldSelect?.addEventListener('change', () => {
      dateField = dateFieldSelect.value === 'createdAt' ? 'createdAt' : 'updatedAt'
      renderRows()
    })

    const addButton = container.querySelector('#admin-institutions-add-btn') as HTMLButtonElement | null
    addButton?.addEventListener('click', () => {
      openInstitutionModal({
        mode: 'create',
        onSubmit: async (payload) => {
          try {
            await institutionsApi.create(payload as InstitutionPayload)
            toast(t('admin.institutions.feedback.created'), 'success')
            await loadInstitutions()
          } catch (error) {
            throw new Error(getInstitutionsErrorMessage(error, 'create'))
          }
        },
      })
    })
  }

  const getVisibleInstitutions = () => {
    const visibleInstitutions = [...institutions]
    visibleInstitutions.sort((a, b) => {
      const aTime = new Date(dateField === 'createdAt' ? a.createdAt : a.updatedAt).getTime()
      const bTime = new Date(dateField === 'createdAt' ? b.createdAt : b.updatedAt).getTime()
      return sort === 'oldest' ? aTime - bTime : bTime - aTime
    })
    return visibleInstitutions
  }

  const handleEditInstitution = async (institutionId: string) => {
    try {
      const institution = await institutionsApi.getById(institutionId)
      openInstitutionModal({
        mode: 'edit',
        initialValue: institution,
        onSubmit: async (payload) => {
          try {
            await institutionsApi.update(institution.id, payload as InstitutionUpdatePayload)
            toast(t('admin.institutions.feedback.updated'), 'success')
            await loadInstitutions()
          } catch (error) {
            throw new Error(getInstitutionsErrorMessage(error, 'update'))
          }
        },
      })
    } catch (error) {
      toast(getInstitutionsErrorMessage(error, 'details'), 'error')
    }
  }

  const handleDeleteInstitution = async (institutionId: string) => {
    if (!window.confirm(t('admin.institutions.confirmDelete'))) return

    try {
      await institutionsApi.remove(institutionId)
      toast(t('admin.institutions.feedback.deleted'), 'success')
      await loadInstitutions()
    } catch (error) {
      toast(getInstitutionsErrorMessage(error, 'delete'), 'error')
    }
  }

  const handleToggleInstitution = async (institution: Institution) => {
    if (togglingInstitutionIds.has(institution.id)) return

    togglingInstitutionIds.add(institution.id)
    renderRows()

    try {
      await institutionsApi.update(institution.id, {
        isActive: !institution.isActive,
      })

      institutions = institutions.map((item) =>
        item.id === institution.id
          ? {
              ...item,
              isActive: !item.isActive,
            }
          : item
      )
      renderRows()
      toast(t('admin.institutions.feedback.updated'), 'success')
    } catch (error) {
      toast(getInstitutionsErrorMessage(error, 'update'), 'error')
    } finally {
      togglingInstitutionIds.delete(institution.id)
      renderRows()
    }
  }

  const renderRows = () => {
    const tbody = container.querySelector('#admin-institutions-tbody') as HTMLElement | null
    if (!tbody) return

    const visibleInstitutions = getVisibleInstitutions()
    if (visibleInstitutions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="admin-institutions-empty">${t('admin.institutions.empty')}</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = visibleInstitutions
      .map((institution) => `
        <tr>
          <td>
            <button
              type="button"
              class="admin-institutions-toggle ${institution.isActive ? 'is-active' : ''}"
              data-action="toggle-active"
              data-institution-id="${institution.id}"
              role="switch"
              aria-checked="${institution.isActive ? 'true' : 'false'}"
              aria-label="${t('admin.institutions.columns.active')}"
              ${togglingInstitutionIds.has(institution.id) ? 'disabled' : ''}
            >
              <span class="admin-institutions-toggle-thumb"></span>
            </button>
          </td>
          <td>${escapeHtml(institution.name)}</td>
          <td>${escapeHtml(institution.domain)}</td>
          <td>${escapeHtml(institution.secondaryDomain || '—')}</td>
          <td>
            <div class="admin-institutions-actions-cell">
              <button
                type="button"
                class="admin-institutions-action-icon-btn"
                data-action="edit"
                data-institution-id="${institution.id}"
                aria-label="${t('admin.institutions.actions.edit')}"
                title="${t('admin.institutions.actions.edit')}"
              >
                <img src="/icons/visibility.png" alt="${t('admin.institutions.actions.edit')}">
              </button>

              <button
                type="button"
                class="admin-institutions-action-icon-btn admin-institutions-delete-icon-btn"
                data-action="delete"
                data-institution-id="${institution.id}"
                aria-label="${t('admin.institutions.actions.delete')}"
                title="${t('admin.institutions.actions.delete')}"
              >
                <img src="/icons/delete.png" alt="${t('admin.institutions.actions.delete')}">
              </button>
            </div>
          </td>
        </tr>
      `)
      .join('')

    tbody.querySelectorAll<HTMLButtonElement>('[data-action="edit"]').forEach((button) => {
      button.addEventListener('click', () => {
        const institutionId = button.dataset.institutionId
        if (!institutionId) return
        void handleEditInstitution(institutionId)
      })
    })

    tbody.querySelectorAll<HTMLButtonElement>('[data-action="toggle-active"]').forEach((button) => {
      button.addEventListener('click', () => {
        const institutionId = button.dataset.institutionId
        if (!institutionId) return
        const institution = institutions.find((item) => item.id === institutionId)
        if (!institution) return
        void handleToggleInstitution(institution)
      })
    })

    tbody.querySelectorAll<HTMLButtonElement>('[data-action="delete"]').forEach((button) => {
      button.addEventListener('click', () => {
        const institutionId = button.dataset.institutionId
        if (!institutionId) return
        void handleDeleteInstitution(institutionId)
      })
    })
  }

  const loadInstitutions = async () => {
    const tbody = container.querySelector('#admin-institutions-tbody') as HTMLElement | null
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="admin-institutions-empty">${t('admin.institutions.loading')}</td>
        </tr>
      `
    }

    try {
      institutions = await institutionsApi.list()
      renderRows()
    } catch (error) {
      institutions = []
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="admin-institutions-empty">${t('admin.institutions.loadError')}</td>
          </tr>
        `
      }
      toast(getInstitutionsErrorMessage(error, 'list'), 'error')
    }
  }

  renderBase()
  void loadInstitutions()
}
