import { getAccessToken, getCurrentUser } from '@/shared/api/auth-session'
import { coursesApi } from '@/features/courses/api/courses.api'
import { sectionsApi } from '@/features/courses/api/sections.api'
import { activitiesApi } from '@/features/courses/api/activities.api'
import type { Activity, ActivityType, Course, CreateCourseInput, Section, Tag } from '@/features/courses/model/course.types'
import { tagsApi } from '@/features/courses/api/tags.api'
import { mediaApi, type MediaResponse } from '@/features/media/api/media.api'
import { ApiError } from '@/shared/api/http'
import { toast } from '@/shared/ui/toast'
import { getLanguage, t } from '@/shared/i18n'
import { MediaTabs } from '@/features/media/components/MediaTabs'
import { routes } from '@/app/routes'
import '@/features/courses/styles/courses-home.css'

type HomeUserRole = 'USER' | 'ADMIN'
type CourseSort = 'recent' | 'oldest' | 'name'
const COURSE_HOME_VIEW_STORAGE_KEY = 'educado.courses.homeView'
const COURSE_HOME_DRAFT_STORAGE_KEY = 'educado.courses.draft'
const COURSE_HOME_FORM_DRAFT_STORAGE_KEY = 'educado.courses.formDraft'
const COURSE_HOME_SECTIONS_LOCAL_STORAGE_KEY = 'educado.courses.sectionsLocal'
const MONGO_ID_REGEX = /^[a-f\d]{24}$/i
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type MediaErrorContext = 'course' | 'exercise'

function isValidMediaIdFormat(mediaId: string) {
  return MONGO_ID_REGEX.test(mediaId) || UUID_REGEX.test(mediaId)
}

function getMediaReferenceErrorMessage(error: unknown, context: MediaErrorContext) {
  if (!(error instanceof ApiError)) return null

  const keyPrefix = context === 'course' ? 'courses.newCourse.errors' : 'courses.sections.exerciseModal.errors'
  const code = error.code ?? ''

  if (code === 'VALIDATION_ERROR') {
    return t(`${keyPrefix}.mediaValidation`)
  }

  if (code === 'INVALID_MEDIA_ID') {
    return t(`${keyPrefix}.mediaInvalidId`)
  }

  if (code === 'MEDIA_NOT_FOUND') {
    return t(`${keyPrefix}.mediaNotFound`)
  }

  if (code === 'MEDIA_INACTIVE') {
    return t(`${keyPrefix}.mediaInactive`)
  }

  if (code === 'FORBIDDEN') {
    return t(`${keyPrefix}.mediaForbidden`)
  }

  return null
}

function getMediaBankErrorMessage(error: unknown, operation: 'upload' | 'list') {
  const listFallback = t('courses.home.mediaBank.upload.listError')
  const uploadFallback = t('courses.home.mediaBank.upload.errors.generic')

  if (!(error instanceof ApiError)) {
    return operation === 'upload' ? uploadFallback : listFallback
  }

  if (error.status === 401) {
    return t('courses.home.mediaBank.upload.errors.unauthorized')
  }

  const code = error.code ?? ''

  if (code === 'VALIDATION_ERROR') {
    return t('courses.home.mediaBank.upload.errors.validation')
  }

  if (code === 'INVALID_MEDIA_ID') {
    return t('courses.home.mediaBank.upload.errors.invalidMediaId')
  }

  if (code === 'MEDIA_NOT_FOUND') {
    return t('courses.home.mediaBank.upload.errors.mediaNotFound')
  }

  if (code === 'MEDIA_INACTIVE') {
    return t('courses.home.mediaBank.upload.errors.mediaInactive')
  }

  if (code === 'FORBIDDEN') {
    return t('courses.home.mediaBank.upload.errors.forbidden')
  }

  return operation === 'upload' ? uploadFallback : listFallback
}

function getMediaStreamUrl(mediaId: string) {
  const token = getAccessToken()
  const base = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5001'}/media/${mediaId}/stream`
  return token ? `${base}?token=${token}` : base
}

function clearCourseTabsInHeader() {
  document.querySelectorAll('.tabs-component').forEach((element) => element.remove())
}

export function renderHomePage(container: HTMLElement, role: HomeUserRole) {
  const currentView = sessionStorage.getItem(COURSE_HOME_VIEW_STORAGE_KEY)
  if (currentView === 'create') {
    renderNewCourseScreen(container, role)
    return
  }

  if (currentView === 'sections') {
    const rawDraft = sessionStorage.getItem(COURSE_HOME_DRAFT_STORAGE_KEY)
    const draft = rawDraft ? (JSON.parse(rawDraft) as Course | null) : null
    renderCourseSectionsScreen(container, role, draft)
    return
  }

  if (currentView === 'edit') {
    const editCourseId = sessionStorage.getItem('educado.editCourseId')
    if (editCourseId) {
      renderEditCourseScreen(container, role, editCourseId)
      return
    }
  }

  if (currentView === 'review') {
    const rawDraft = sessionStorage.getItem(COURSE_HOME_DRAFT_STORAGE_KEY)
    const draft = rawDraft ? (JSON.parse(rawDraft) as Course | null) : null
    renderCourseReviewScreen(container, role, draft)
    return
  }

  renderCreatorHomePage(container, role)
}

async function renderEditCourseScreen(container: HTMLElement, role: HomeUserRole, courseId: string) {
  try {
    const course = await coursesApi.getCourse(courseId)
    renderNewCourseScreen(container, role, course)
  } catch {
    toast(t('courses.home.feedback.actionError'), 'error')
    sessionStorage.removeItem('educado.editCourseId')
    sessionStorage.removeItem(COURSE_HOME_VIEW_STORAGE_KEY)
    renderHomePage(container, role)
  }
}

function renderCreatorHomePage(container: HTMLElement, role: HomeUserRole) {
  MediaTabs.renderInHeader('courses', {
    coursesPath: role === 'ADMIN' ? routes.adminHome : routes.home,
    adminPath: role === 'ADMIN' ? routes.adminUsers : undefined,
  })

  const currentUser = getCurrentUser()
  const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'User Name'

  container.innerHTML = `
    <section class="creator-home-page">
      <div class="creator-main-card">
        <div class="creator-main-header">
          <h1>${t('courses.home.title')}</h1>
          <button id="creator-new-course" class="creator-new-course-btn" type="button">
            <span class="creator-new-course-icon">+</span>
            <span>${t('courses.home.newCourse')}</span>
          </button>
        </div>

        <div class="creator-controls-row">
          <div class="creator-view-toggle" aria-label="Alternar visualização">
            <button id="creator-grid-view" class="creator-view-btn is-active" type="button" aria-label="Visualização em grade">☷</button>
            <button id="creator-list-view" class="creator-view-btn" type="button" aria-label="Visualização em lista">☰</button>
          </div>

          <div class="creator-filters">
            <label class="creator-input-wrap" for="creator-course-search">
              <input id="creator-course-search" type="text" placeholder="${t('courses.home.search')}" autocomplete="off">
              <span aria-hidden="true">⌕</span>
            </label>

            <label class="creator-select-wrap" for="creator-course-sort">
              <select id="creator-course-sort">
                <option value="recent">${t('courses.home.sortOptions.newest')}</option>
                <option value="oldest">${t('courses.home.sortOptions.oldest')}</option>
                <option value="name">${t('courses.home.sortOptions.nameAsc')}</option>
              </select>
            </label>
          </div>
        </div>

        <div id="creator-courses-list" class="creator-courses-grid"></div>
      </div>

      <aside class="creator-sidebar">
        <div class="creator-sidebar-section creator-greeting">
          <h2>${t('courses.home.sidebar.greeting', { name: escapeHtml(displayName) })}</h2>
        </div>

        <div class="creator-sidebar-section">
          <div class="creator-sidebar-title-row">
            <h3>${t('courses.home.sidebar.progress')}</h3>
            <select class="creator-period-select" aria-label="Período">
              <option>Esse mês</option>
            </select>
          </div>

          <div class="creator-stat-block">
            <span>${t('courses.home.sidebar.courses')}</span>
            <div><strong id="creator-total-courses">0</strong><small class="positive">▲ 5%</small></div>
          </div>

          <div class="creator-stat-block">
            <span>${t('courses.home.sidebar.students')}</span>
            <div><strong id="creator-total-students">0</strong><small class="negative">▼ 5%</small></div>
          </div>

          <div class="creator-stat-block">
            <span>${t('courses.home.sidebar.certificates')}</span>
            <div><strong id="creator-total-certificates">0</strong><small class="positive">▲ 5%</small></div>
          </div>

          <div class="creator-stat-block">
            <span>${t('courses.home.sidebar.rating')}</span>
            <div class="creator-rating-row"><span id="creator-rating-stars">★★★☆☆</span><strong id="creator-rating-value">3.7</strong></div>
          </div>
        </div>

        <div class="creator-sidebar-divider" aria-hidden="true"></div>

        <div class="creator-sidebar-section creator-activities">
          <h3>${t('courses.home.sidebar.activities')}</h3>
          <div class="creator-activity-item">Parabéns! Seu curso "Nome do curso" atingiu 100 inscritos</div>
          <div class="creator-activity-item">Um aluno do curso "Nome do curso" deixou uma dúvida</div>
        </div>
      </aside>
    </section>
  `

  const newCourseButton = document.getElementById('creator-new-course')
  const gridViewButton = document.getElementById('creator-grid-view') as HTMLButtonElement | null
  const listViewButton = document.getElementById('creator-list-view') as HTMLButtonElement | null
  const searchInput = document.getElementById('creator-course-search') as HTMLInputElement | null
  const sortSelect = document.getElementById('creator-course-sort') as HTMLSelectElement | null
  const coursesList = document.getElementById('creator-courses-list')

  if (!coursesList || !gridViewButton || !listViewButton || !searchInput || !sortSelect) return

  let courses: Course[] = []
  let query = ''
  let sort: CourseSort = 'recent'
  let viewMode: 'grid' | 'list' = 'grid'

  const updateSidebarStats = (items: Course[]) => {
    const totalCourses = items.length
    const totalStudents = totalCourses * 20
    const totalCertificates = Math.floor(totalCourses * 6.75)
    const avgRating = items.length > 0
      ? items.reduce((sum, item) => sum + (item.rating || 3.7), 0) / items.length
      : 3.7

    const totalCoursesEl = document.getElementById('creator-total-courses')
    const totalStudentsEl = document.getElementById('creator-total-students')
    const totalCertificatesEl = document.getElementById('creator-total-certificates')
    const ratingStarsEl = document.getElementById('creator-rating-stars')
    const ratingValueEl = document.getElementById('creator-rating-value')

    if (totalCoursesEl) totalCoursesEl.textContent = `${totalCourses}`
    if (totalStudentsEl) totalStudentsEl.textContent = `${totalStudents}`
    if (totalCertificatesEl) totalCertificatesEl.textContent = `${totalCertificates}`
    if (ratingStarsEl) ratingStarsEl.textContent = getStars(avgRating)
    if (ratingValueEl) ratingValueEl.textContent = avgRating.toFixed(1)
  }

  const getSortedAndFilteredCourses = () => {
    let filtered = [...courses]

    if (query) {
      filtered = filtered.filter((course) => {
        const normalizedQuery = query.toLowerCase()
        return (
          course.title.toLowerCase().includes(normalizedQuery) ||
          course.category.toLowerCase().includes(normalizedQuery) ||
          course.shortDescription.toLowerCase().includes(normalizedQuery)
        )
      })
    }

    switch (sort) {
      case 'oldest':
        filtered.sort((a, b) => (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0))
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'recent':
      default:
        filtered.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0))
        break
    }

    return filtered
  }

  const renderCourses = () => {
    const visibleCourses = getSortedAndFilteredCourses()
    updateSidebarStats(courses)

    coursesList.classList.toggle('is-list', viewMode === 'list')

    if (courses.length === 0) {
      showEmptyState()
      return
    }

    if (visibleCourses.length === 0) {
      coursesList.innerHTML = `<div class="creator-empty-state">${t('courses.home.noCourses')}</div>`
      return
    }

    coursesList.innerHTML = visibleCourses
      .map((course) => {
        const rating = course.rating || 3.7
        const isActive = course.isActive !== false
        return `
          <article class="creator-course-card">
            <header class="creator-course-title-wrap">
              <span class="creator-course-icon" aria-hidden="true">▦</span>
              <h4>${escapeHtml(course.title)}</h4>
              <span class="creator-course-status ${isActive ? 'is-active' : 'is-inactive'}">${isActive ? t('courses.home.statusActive') : t('courses.home.statusInactive')}</span>
            </header>

            <div class="creator-course-line" aria-hidden="true"></div>

            <div class="creator-course-meta">
              <span>✦ ${escapeHtml(course.category || 'Matemática')}</span>
              <span>◷ ${escapeHtml(course.estimatedTime || '8 horas')}</span>
            </div>

            <div class="creator-course-rating">${renderRating(rating)}</div>

            <footer class="creator-course-actions">
              <button class="creator-edit-btn" type="button" data-course-action="edit" data-course-id="${escapeHtml(course.id)}">${t('courses.home.edit')}</button>
              <button class="creator-view-btn-card" type="button" data-course-action="view" data-course-id="${escapeHtml(course.id)}">${t('courses.home.view')}</button>
            </footer>
          </article>
        `
      })
      .join('')

    bindCourseActionButtons()
  }

  const handleViewCourse = async (courseId: string) => {
    try {
      const course = await coursesApi.getCourse(courseId)

      // Fetch sections for this course
      const allSections = await sectionsApi.getSections()
      const courseSections = allSections
        .filter((s: Section) => s.courseId === courseId)
        .sort((a: Section, b: Section) => a.order - b.order)

      // Fetch activities for each section
      const sectionActivities: Record<string, Activity[]> = {}
      for (const section of courseSections) {
        try {
          const activities = await activitiesApi.getActivitiesBySection(section.id)
          sectionActivities[section.id] = activities.sort((a: Activity, b: Activity) => a.order - b.order)
        } catch {
          sectionActivities[section.id] = []
        }
      }

      showCourseViewModal(course, courseSections, sectionActivities)
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const showCourseViewModal = (course: Course, sections: Section[], sectionActivities: Record<string, Activity[]>) => {
    const chevron = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'video_pause': return '\u25B6'
        case 'text_reading': return '\uD83D\uDCC4'
        case 'multiple_choice': return '\u270E'
        case 'true_false': return '\u2713\u2717'
        default: return '\u2022'
      }
    }

    const getActivityTypeName = (type: string) => {
      switch (type) {
        case 'video_pause': return 'V\u00EDdeo'
        case 'text_reading': return 'Leitura'
        case 'multiple_choice': return 'M\u00FAltipla Escolha'
        case 'true_false': return 'Verdadeiro/Falso'
        default: return type
      }
    }

    const getDifficultyLabel = (d: string) => {
      switch (d) {
        case 'beginner': return 'Iniciante'
        case 'intermediate': return 'Intermedi\u00E1rio'
        case 'advanced': return 'Avan\u00E7ado'
        default: return d
      }
    }

    const modalWrapper = document.createElement('div')
    modalWrapper.innerHTML = `
      <div class="sections-lesson-modal-overlay" id="course-view-overlay">
        <div class="sections-lesson-modal-card" style="max-width: 800px; max-height: calc(100vh - 80px); overflow-y: auto;">
          <header class="sections-lesson-modal-header">
            <h2>${escapeHtml(course.title)}</h2>
            <button type="button" id="course-view-close" class="sections-lesson-modal-close" aria-label="Fechar">\u2715</button>
          </header>

          <div class="sections-lesson-modal-body">
            <div class="course-view-info">
              <div class="course-view-meta-row">
                <span class="course-view-meta-item">\u2726 ${escapeHtml(course.category || '')}</span>
                <span class="course-view-meta-item">\u25F7 ${escapeHtml(course.estimatedTime || '')}</span>
                <span class="course-view-meta-item">\uD83D\uDCCA ${getDifficultyLabel(course.difficulty)}</span>
                <span class="course-view-meta-item">${course.isActive ? '\uD83D\uDFE2 Ativo' : '\uD83D\uDD34 Inativo'}</span>
              </div>
              ${course.rating ? `<div class="course-view-rating">${renderRating(course.rating)}</div>` : ''}
              ${course.description ? `<p class="course-view-description">${escapeHtml(course.description)}</p>` : ''}
              ${course.reusableTags && course.reusableTags.length > 0 ? `
                <div class="course-view-tags">
                  ${course.reusableTags.map((tag: Tag) => `<span class="course-view-tag">${escapeHtml(tag.name)}</span>`).join('')}
                </div>
              ` : ''}
            </div>

            <div class="course-view-sections-wrap">
              <h3 class="course-view-sections-title">Se\u00E7\u00F5es (${sections.length})</h3>
              ${sections.length === 0 ? '<p class="course-view-empty">Nenhuma se\u00E7\u00E3o cadastrada.</p>' : ''}
              ${sections.map((section: Section) => {
                const activities = sectionActivities[section.id] || []
                return `
                  <div class="course-view-section-card">
                    <button type="button" class="course-view-section-header" data-view-section-toggle="${section.id}">
                      <span class="course-view-section-chevron">${chevron}</span>
                      <span class="course-view-section-title">${escapeHtml(section.title)}</span>
                      <small class="course-view-section-count">${activities.length} atividade${activities.length !== 1 ? 's' : ''}</small>
                    </button>
                    <div class="course-view-section-content" id="course-view-section-${section.id}" style="display: none;">
                      ${activities.length === 0 ? '<p class="course-view-empty">Nenhuma atividade.</p>' : ''}
                      ${activities.map((activity: Activity) => `
                        <div class="course-view-activity">
                          <span class="course-view-activity-icon">${getActivityIcon(activity.type)}</span>
                          <div class="course-view-activity-info">
                            <strong>${escapeHtml(activity.title || getActivityTypeName(activity.type))}</strong>
                            <small>${getActivityTypeName(activity.type)}</small>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(modalWrapper)

    // Close handlers
    const closeModal = () => modalWrapper.remove()

    modalWrapper.querySelector('#course-view-close')?.addEventListener('click', closeModal)
    modalWrapper.querySelector('#course-view-overlay')?.addEventListener('click', (e: Event) => {
      if (e.target === e.currentTarget) closeModal()
    })

    // Section toggle (accordion)
    modalWrapper.querySelectorAll<HTMLButtonElement>('[data-view-section-toggle]').forEach((btn: HTMLButtonElement) => {
      btn.addEventListener('click', () => {
        const sectionId = btn.dataset.viewSectionToggle
        const content = document.getElementById(`course-view-section-${sectionId}`)
        if (!content) return
        const isOpen = content.style.display !== 'none'
        content.style.display = isOpen ? 'none' : 'flex'
        btn.querySelector('.course-view-section-chevron')?.classList.toggle('is-open', !isOpen)
      })
    })

    // ESC to close
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
        document.removeEventListener('keydown', handleEsc)
      }
    }
    document.addEventListener('keydown', handleEsc)
  }

  const handleEditCourse = async (courseId: string) => {
    sessionStorage.setItem('educado.editCourseId', courseId)
    sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'edit')
    renderEditCourseScreen(container, role, courseId)
  }

  const handleToggleCourseStatus = async (courseId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await coursesApi.deactivateCourse(courseId)
        toast(t('courses.home.feedback.deactivateSuccess'), 'success')
      } else {
        await coursesApi.activateCourse(courseId)
        toast(t('courses.home.feedback.activateSuccess'), 'success')
      }
      await loadCourses()
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm(t('courses.home.confirmDelete'))) return

    try {
      await coursesApi.deleteCourse(courseId)
      toast(t('courses.home.feedback.deleteSuccess'), 'success')
      await loadCourses()
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const bindCourseActionButtons = () => {
    coursesList.querySelectorAll<HTMLButtonElement>('[data-course-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const action = button.dataset.courseAction
        const courseId = button.dataset.courseId
        const courseActive = button.dataset.courseActive === 'true'

        if (!courseId || !action) return

        if (action === 'view') {
          await handleViewCourse(courseId)
          return
        }

        if (action === 'edit') {
          await handleEditCourse(courseId)
          return
        }

        if (action === 'toggle') {
          await handleToggleCourseStatus(courseId, courseActive)
          return
        }

        if (action === 'delete') {
          await handleDeleteCourse(courseId)
        }
      })
    })
  }

  const loadCourses = async () => {
    coursesList.innerHTML = `<div class="creator-empty-state">${t('courses.home.feedback.loading')}</div>`

    try {
      courses = role === 'ADMIN'
        ? await coursesApi.getCourses({ status: 'all' })
        : await coursesApi.getMyCourses({ status: 'all' })
      renderCourses()
    } catch {
      courses = []
      coursesList.innerHTML = `<div class="creator-empty-state">${t('courses.home.feedback.loadError')}</div>`
      toast(t('courses.home.feedback.loadError'), 'error')
      updateSidebarStats(courses)
    }
  }

  newCourseButton?.addEventListener('click', () => {
    sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'create')
    renderNewCourseScreen(container, role)
  })

  gridViewButton.addEventListener('click', () => {
    viewMode = 'grid'
    gridViewButton.classList.add('is-active')
    listViewButton.classList.remove('is-active')
    renderCourses()
  })

  listViewButton.addEventListener('click', () => {
    viewMode = 'list'
    listViewButton.classList.add('is-active')
    gridViewButton.classList.remove('is-active')
    renderCourses()
  })

  searchInput.addEventListener('input', (event) => {
    query = (event.target as HTMLInputElement).value.trim()
    renderCourses()
  })

  sortSelect.addEventListener('change', (event) => {
    sort = (event.target as HTMLSelectElement).value as CourseSort
    renderCourses()
  })

  const showEmptyState = () => {
    const mainCard = document.querySelector('.creator-main-card')
    const sidebar = document.querySelector('.creator-sidebar')

    if (mainCard) {
      mainCard.innerHTML = `
        <div class="creator-empty-container">
          <div class="creator-empty-content">
            <img src="/images/empty-courses.png" alt="" class="creator-empty-image">
            <h2>${t('courses.home.empty.title')}</h2>
            <p>${t('courses.home.empty.description')}</p>
            <button id="creator-new-course-empty" class="creator-new-course-btn" type="button">
              <span class="creator-new-course-icon">+</span>
              <span>${t('courses.home.empty.createButton')}</span>
            </button>
          </div>
        </div>
      `

      const newCourseEmptyButton = document.getElementById('creator-new-course-empty')
      newCourseEmptyButton?.addEventListener('click', () => {
        sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'create')
        renderNewCourseScreen(container, role)
      })
    }

    if (sidebar) {
      sidebar.innerHTML = `
        <div class="creator-sidebar-section creator-greeting">
          <h2>${t('courses.home.sidebar.greeting', { name: escapeHtml(displayName) })}</h2>
        </div>

        <div class="creator-sidebar-divider" aria-hidden="true"></div>

        <div class="creator-sidebar-section">
          <h3>${t('courses.home.sidebar.progress')}</h3>
          <p class="creator-empty-message">${t('courses.home.sidebar.noData')}</p>
        </div>

        <div class="creator-sidebar-divider" aria-hidden="true"></div>

        <div class="creator-sidebar-section creator-activities">
          <h3>${t('courses.home.sidebar.activities')}</h3>
          <p class="creator-empty-message">${t('courses.home.sidebar.noActivities')}</p>
        </div>
      `
    }
  }

  loadCourses()
}

function renderNewCourseScreen(container: HTMLElement, role: HomeUserRole, editCourse?: Course) {
  clearCourseTabsInHeader()
  const isEditMode = Boolean(editCourse)

  if (!isEditMode) {
    sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'create')
  }

  const nt = (path: string, params?: Record<string, string | number>) => t(`courses.newCourse.${path}`, params)

  type NewCourseFormDraft = {
    title: string
    description: string
    difficulty: CreateCourseInput['difficulty']
    category: string
    imageMediaId: string
    selectedTagIds: string[]
  }

  container.innerHTML = `
    <section class="new-course-page">
      <div class="new-course-layout">
        <aside class="new-course-sidebar">
          <div class="new-course-sidebar-header">
            <h2>${isEditMode ? t('courses.editCourse.title') : nt('title')}</h2>
            <div class="new-course-divider"></div>
          </div>

          <div class="new-course-steps">
            <button type="button" class="new-course-step is-active" data-course-step="create">
              <span class="new-course-step-box"></span>
              <span>${nt('generalInfo')}</span>
            </button>
            <button type="button" class="new-course-step" data-course-step="sections">
              <span class="new-course-step-box"></span>
              <span>${nt('sections')}</span>
            </button>
            <button type="button" class="new-course-step" data-course-step="review">
              <span class="new-course-step-box"></span>
              <span>${nt('review')}</span>
            </button>
          </div>

          <div class="new-course-divider"></div>

          <button id="new-course-save-draft" class="new-course-outline-btn" type="button">${nt('saveDraft')}</button>
          ${isEditMode && editCourse ? `
            <div class="new-course-divider"></div>
            <button id="edit-course-deactivate" class="new-course-outline-btn" type="button" style="border-color: #e0912d; color: #e0912d;">
              ${editCourse.isActive !== false ? t('courses.editCourse.deactivate') : t('courses.editCourse.activate')}
            </button>
            <button id="edit-course-delete" class="new-course-outline-btn" type="button" style="border-color: #d62b25; color: #d62b25;">
              ${t('courses.editCourse.deleteCourse')}
            </button>
          ` : ''}
        </aside>

        <div class="new-course-content">
          <div class="new-course-main">
            <h1>${nt('generalInfo')}</h1>

            <form id="new-course-form" class="new-course-form">
              <label class="new-course-field">
                <span>${nt('fields.name')} <em>*</em></span>
                <input id="new-course-title" type="text" placeholder="${nt('fields.namePlaceholder')}" required minlength="3">
              </label>

              <div class="new-course-row">
                <label class="new-course-field">
                  <span>${nt('fields.difficulty')} <em>*</em></span>
                  <select id="new-course-difficulty" required>
                    <option value="beginner">${nt('difficultyOptions.beginner')}</option>
                    <option value="intermediate">${nt('difficultyOptions.intermediate')}</option>
                    <option value="advanced">${nt('difficultyOptions.advanced')}</option>
                  </select>
                </label>

                <label class="new-course-field">
                  <span>${nt('fields.category')} <em>*</em></span>
                  <input id="new-course-category" type="text" placeholder="${nt('fields.categoryPlaceholder')}" required>
                </label>
              </div>

              <label class="new-course-field">
                <span>${nt('fields.description')} <em>*</em></span>
                <textarea id="new-course-description" placeholder="${nt('fields.descriptionPlaceholder')}" rows="5" maxlength="400" required></textarea>
                <small id="new-course-description-count">0 / 400 caracteres</small>
              </label>

              <label class="new-course-field">
                <span>${nt('fields.image')} <em>*</em></span>
                <div class="new-course-upload-box">
                  <p>${nt('fields.imageDrop')}</p>
                  <p>${nt('fields.or')}</p>
                  <button id="new-course-image-trigger" class="new-course-outline-btn" type="button">${nt('fields.imageSend')}</button>
                  <input id="new-course-image" type="url" placeholder="${nt('fields.imagePlaceholder')}" required>
                </div>
                <small>${nt('fields.imageHint')}</small>
              </label>

              <label class="new-course-field">
                <span>${nt('fields.tags')}</span>
                <div class="new-course-tags-input" id="new-course-tags-input">
                  <div id="new-course-tags-chips" class="new-course-tags-chips" hidden></div>
                  <input id="new-course-tags-query" type="text" placeholder="${nt('fields.tagsPlaceholder')}">
                </div>
                <div id="new-course-tags-suggestions" class="new-course-tags-suggestions" hidden></div>
              </label>
            </form>
          </div>

          <div class="new-course-footer">
            <button id="new-course-back" class="new-course-link-btn" type="button">${nt('ctas.back')}</button>
            <div class="new-course-footer-actions">
              <button id="new-course-cancel" class="new-course-cancel-btn" type="button">${nt('ctas.cancel')}</button>
              <button id="new-course-next" class="new-course-primary-btn" type="button">${nt('ctas.next')}</button>
            </div>
          </div>

          <div class="new-course-mobile-draft">
            <button id="new-course-save-draft-mobile" class="new-course-outline-btn" type="button">${nt('saveDraft')}</button>
          </div>
        </div>
      </div>
    </section>
  `

  const descriptionInput = document.getElementById('new-course-description') as HTMLTextAreaElement | null
  const descriptionCount = document.getElementById('new-course-description-count')
  const imageInput = document.getElementById('new-course-image') as HTMLInputElement | null
  const imageTrigger = document.getElementById('new-course-image-trigger')
  const backButton = document.getElementById('new-course-back')
  const cancelButton = document.getElementById('new-course-cancel')
  const draftButton = document.getElementById('new-course-save-draft')
  const draftButtonMobile = document.getElementById('new-course-save-draft-mobile')
  const nextButton = document.getElementById('new-course-next')
  const tagsQueryInput = document.getElementById('new-course-tags-query') as HTMLInputElement | null
  const tagsChipsContainer = document.getElementById('new-course-tags-chips')
  const tagsSuggestions = document.getElementById('new-course-tags-suggestions')
  const titleInput = document.getElementById('new-course-title') as HTMLInputElement | null
  const difficultyInput = document.getElementById('new-course-difficulty') as HTMLSelectElement | null
  const categoryInput = document.getElementById('new-course-category') as HTMLInputElement | null

  let availableTags: Tag[] = []
  let selectedTags: Tag[] = []
  const rawDraftCourse = sessionStorage.getItem(COURSE_HOME_DRAFT_STORAGE_KEY)
  const draftCourse = rawDraftCourse ? (JSON.parse(rawDraftCourse) as Course | null) : null
  const rawFormDraft = sessionStorage.getItem(COURSE_HOME_FORM_DRAFT_STORAGE_KEY)
  const formDraft = rawFormDraft ? (JSON.parse(rawFormDraft) as NewCourseFormDraft | null) : null
  let cancelModalOpen = false

  const goBackToDashboard = () => {
    if (isEditMode) {
      sessionStorage.removeItem('educado.editCourseId')
    }
    sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'list')
    renderCreatorHomePage(container, role)
  }

  const clearCreationLocalDrafts = () => {
    sessionStorage.removeItem(COURSE_HOME_FORM_DRAFT_STORAGE_KEY)
    sessionStorage.removeItem(COURSE_HOME_SECTIONS_LOCAL_STORAGE_KEY)
  }

  const persistFormDraft = () => {
    const draft: NewCourseFormDraft = {
      title: titleInput?.value ?? '',
      description: descriptionInput?.value ?? '',
      difficulty: ((difficultyInput?.value ?? 'beginner') as CreateCourseInput['difficulty']),
      category: categoryInput?.value ?? '',
      imageMediaId: imageInput?.value ?? '',
      selectedTagIds: selectedTags.map((tag) => tag.id),
    }

    sessionStorage.setItem(COURSE_HOME_FORM_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  }

  const closeCancelCourseModal = () => {
    cancelModalOpen = false
    const modal = document.getElementById('new-course-cancel-modal')
    if (modal) modal.remove()
  }

  const deleteCourseWithDependents = async (courseId: string) => {
    const allSections = await sectionsApi.getSections()
    const courseSections = allSections.filter((section) => section.courseId === courseId)

    await Promise.all(
      courseSections.map(async (section) => {
        const activities = await activitiesApi.getActivitiesBySection(section.id)
        await Promise.all(activities.map((activity) => activitiesApi.deleteActivity(activity.id)))
      }),
    )

    await Promise.all(courseSections.map((section) => sectionsApi.deleteSection(section.id)))
    await coursesApi.deleteCourse(courseId)
  }

  const renderCancelCourseModal = () => {
    if (cancelModalOpen) return
    cancelModalOpen = true

    const wrapper = document.createElement('div')
    wrapper.id = 'new-course-cancel-modal'
    const modalTitleText = isEditMode ? t('courses.editCourse.cancelModal.title') : t('courses.sections.deleteModal.title')
    const modalMessageText = isEditMode ? t('courses.editCourse.cancelModal.message') : t('courses.sections.deleteModal.message')
    const modalCancelText = isEditMode ? t('courses.editCourse.cancelModal.cancel') : t('courses.sections.deleteModal.cancel')
    const modalConfirmText = isEditMode ? t('courses.editCourse.cancelModal.confirm') : t('courses.sections.deleteModal.confirm')

    wrapper.innerHTML = `
      <div class="sections-lesson-modal-overlay" id="new-course-cancel-overlay" role="dialog" aria-modal="true" aria-labelledby="new-course-cancel-title">
        <div class="sections-lesson-modal-card sections-delete-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="new-course-cancel-title">${modalTitleText}</h2>
            <button type="button" id="new-course-cancel-close" class="sections-lesson-modal-close" aria-label="${t('courses.sections.modal.close')}">✕</button>
          </header>
          <div class="sections-lesson-modal-body">
            <p class="sections-delete-modal-message">${modalMessageText}</p>
          </div>
          <footer class="sections-lesson-modal-actions">
            <button type="button" id="new-course-cancel-no" class="new-course-cancel-btn">${modalCancelText}</button>
            <button type="button" id="new-course-cancel-yes" class="new-course-primary-btn">${modalConfirmText}</button>
          </footer>
        </div>
      </div>
    `

    document.body.appendChild(wrapper)

    const overlay = document.getElementById('new-course-cancel-overlay')
    const closeButton = document.getElementById('new-course-cancel-close') as HTMLButtonElement | null
    const noButton = document.getElementById('new-course-cancel-no') as HTMLButtonElement | null
    const yesButton = document.getElementById('new-course-cancel-yes') as HTMLButtonElement | null

    overlay?.addEventListener('click', (event) => {
      if (event.target === overlay) closeCancelCourseModal()
    })
    closeButton?.addEventListener('click', closeCancelCourseModal)
    noButton?.addEventListener('click', closeCancelCourseModal)

    yesButton?.addEventListener('click', async () => {
      try {
        const rawCurrentDraft = sessionStorage.getItem(COURSE_HOME_DRAFT_STORAGE_KEY)
        const currentDraft = rawCurrentDraft ? (JSON.parse(rawCurrentDraft) as Course | null) : null

        if (currentDraft?.id && !isEditMode) {
          await deleteCourseWithDependents(currentDraft.id)
        }

        sessionStorage.removeItem(COURSE_HOME_DRAFT_STORAGE_KEY)
        sessionStorage.removeItem('educado.editCourseId')
        clearCreationLocalDrafts()
        closeCancelCourseModal()
        goBackToDashboard()
      } catch {
        toast(t('courses.home.feedback.actionError'), 'error')
      }
    })
  }

  const setFieldError = (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null, message: string) => {
    if (!field) return

    field.classList.add('is-invalid')
    const fieldContainer = field.closest('.new-course-field')
    if (!fieldContainer) return

    let errorElement = fieldContainer.querySelector('.new-course-field-error') as HTMLElement | null
    if (!errorElement) {
      errorElement = document.createElement('small')
      errorElement.className = 'new-course-field-error'
      fieldContainer.appendChild(errorElement)
    }
    errorElement.textContent = message
  }

  const clearFieldError = (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) => {
    if (!field) return
    field.classList.remove('is-invalid')
    const fieldContainer = field.closest('.new-course-field')
    const errorElement = fieldContainer?.querySelector('.new-course-field-error')
    errorElement?.remove()
  }

  const hashPastelColor = (value: string) => {
    let hash = 0
    for (let i = 0; i < value.length; i += 1) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = Math.abs(hash) % 360
    return {
      background: `hsl(${hue} 75% 94%)`,
      border: `hsl(${hue} 45% 78%)`,
      text: `hsl(${hue} 35% 34%)`,
    }
  }

  const isSelectedTag = (tagId: string) => selectedTags.some((tag) => tag.id === tagId)

  const renderSelectedTags = () => {
    if (!tagsChipsContainer) return

    tagsChipsContainer.hidden = selectedTags.length === 0

    tagsChipsContainer.innerHTML = selectedTags
      .map((tag) => {
        const colors = hashPastelColor(tag.slug || tag.name)
        return `
          <span class="new-course-tag-chip" style="background:${colors.background};border-color:${colors.border};color:${colors.text};">
            ${escapeHtml(tag.name)}
            <button type="button" class="new-course-tag-remove" data-tag-id="${escapeHtml(tag.id)}" aria-label="Remover ${escapeHtml(tag.name)}">×</button>
          </span>
        `
      })
      .join('')

    tagsChipsContainer.querySelectorAll<HTMLButtonElement>('.new-course-tag-remove').forEach((button) => {
      button.addEventListener('click', () => {
        const tagId = button.dataset.tagId
        if (!tagId) return
        selectedTags = selectedTags.filter((tag) => tag.id !== tagId)
        renderSelectedTags()
        renderTagSuggestions(tagsQueryInput?.value.trim() ?? '')
        persistFormDraft()
      })
    })
  }

  const renderTagSuggestions = (query: string) => {
    if (!tagsSuggestions) return

    const setSuggestionsVisible = (visible: boolean) => {
      tagsSuggestions.hidden = !visible
      tagsSuggestions.style.display = visible ? 'flex' : 'none'
    }

    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      setSuggestionsVisible(false)
      tagsSuggestions.innerHTML = ''
      return
    }

    const suggestions = availableTags
      .filter((tag) => tag.isActive)
      .filter((tag) => !isSelectedTag(tag.id))
      .filter((tag) => !normalized || tag.name.toLowerCase().includes(normalized) || tag.slug.toLowerCase().includes(normalized))
      .slice(0, 8)

    if (suggestions.length === 0) {
      setSuggestionsVisible(false)
      tagsSuggestions.innerHTML = ''
      return
    }

    tagsSuggestions.innerHTML = suggestions
      .map((tag) => `<button type="button" class="new-course-tag-suggestion" data-tag-id="${escapeHtml(tag.id)}">${escapeHtml(tag.name)}</button>`)
      .join('')
    setSuggestionsVisible(true)

    tagsSuggestions.querySelectorAll<HTMLButtonElement>('.new-course-tag-suggestion').forEach((button) => {
      button.addEventListener('click', () => {
        const tagId = button.dataset.tagId
        if (!tagId) return
        const tag = availableTags.find((item) => item.id === tagId)
        if (!tag) return
        if (selectedTags.length >= 20) {
          toast(nt('errors.tagsLimit'), 'error')
          return
        }
        selectedTags.push(tag)
        renderSelectedTags()
        if (tagsQueryInput) tagsQueryInput.value = ''
        renderTagSuggestions('')
        tagsQueryInput?.focus()
      })
    })
  }

  const createTagFromQuery = async (rawName: string) => {
    if (selectedTags.length >= 20) {
      toast(nt('errors.tagsLimit'), 'error')
      return
    }

    const normalizedName = rawName.trim().toLowerCase()
    if (!normalizedName) return

    const existing = availableTags.find((tag) => tag.name.trim().toLowerCase() === normalizedName)
    if (existing) {
      if (!isSelectedTag(existing.id)) {
        selectedTags.push(existing)
        renderSelectedTags()
        persistFormDraft()
      }
      return
    }

    const createdTag = await tagsApi.createTag({
      name: rawName.trim(),
      description: null,
      isActive: true,
    })

    availableTags = [createdTag, ...availableTags]
    selectedTags.push(createdTag)
    renderSelectedTags()
    persistFormDraft()
  }

  const submitNewCourse = async (mode: 'draft' | 'next' | 'review') => {
    const title = titleInput?.value.trim() ?? ''
    const description = descriptionInput?.value.trim() ?? ''
    const difficulty = (difficultyInput?.value ?? 'beginner') as CreateCourseInput['difficulty']
    const category = categoryInput?.value.trim() ?? ''
    const imageMediaId = imageInput?.value.trim() ?? ''
    const tagIds = selectedTags.map((tag) => tag.id)

    clearFieldError(titleInput)
    clearFieldError(descriptionInput)
    clearFieldError(categoryInput)
    clearFieldError(imageInput)

    let isValid = true

    if (!title) {
      setFieldError(titleInput, nt('errors.titleRequired'))
      isValid = false
    }

    if (title && title.length < 3) {
      setFieldError(titleInput, nt('errors.titleMin'))
      isValid = false
    }

    if (!description) {
      setFieldError(descriptionInput, nt('errors.descriptionRequired'))
      isValid = false
    }

    if (description && description.length < 20) {
      setFieldError(descriptionInput, nt('errors.descriptionMin'))
      isValid = false
    }

    if (!category) {
      setFieldError(categoryInput, nt('errors.categoryRequired'))
      isValid = false
    }

    if (!imageMediaId) {
      setFieldError(imageInput, nt('errors.imageRequired'))
      isValid = false
    } else if (!isValidMediaIdFormat(imageMediaId)) {
      setFieldError(imageInput, nt('errors.imageInvalidFormat'))
      isValid = false
    }

    if (!isValid) {
      toast(nt('errors.requiredFields'), 'error')
      return
    }

    if (isEditMode && editCourse) {
      try {
        const editPayload: CreateCourseInput = {
          title,
          description,
          shortDescription: description.slice(0, 120),
          imageMediaId,
          difficulty,
          estimatedTime: editCourse.estimatedTime || '8 horas',
          passingThreshold: editCourse.passingThreshold ?? 70,
          category,
          tags: [],
          tagIds,
          rating: editCourse.rating ?? null,
        }
        const updatedCourse = await coursesApi.updateCourse(editCourse.id, editPayload)
        sessionStorage.setItem(COURSE_HOME_DRAFT_STORAGE_KEY, JSON.stringify(updatedCourse))
        persistFormDraft()
        toast(t('courses.home.feedback.updateSuccess'), 'success')

        if (mode === 'draft') {
          await coursesApi.deactivateCourse(updatedCourse.id)
          clearCreationLocalDrafts()
          sessionStorage.removeItem('educado.editCourseId')
          toast(t('courses.home.feedback.deactivateSuccess'), 'success')
          goBackToDashboard()
          return
        }

        if (mode === 'next') {
          sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'sections')
          renderCourseSectionsScreen(container, role, updatedCourse)
          return
        }

        if (mode === 'review') {
          sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'review')
          renderCourseReviewScreen(container, role, updatedCourse)
          return
        }
      } catch (error) {
        const mediaErrorMessage = getMediaReferenceErrorMessage(error, 'course')
        if (mediaErrorMessage) {
          setFieldError(imageInput, mediaErrorMessage)
          toast(mediaErrorMessage, 'error')
          return
        }
        toast(t('courses.home.feedback.updateError'), 'error')
      }
      return
    }

    try {
      const payload: CreateCourseInput = {
        title,
        description,
        shortDescription: description.slice(0, 120),
        imageMediaId,
        difficulty,
        estimatedTime: '8 horas',
        passingThreshold: 70,
        category,
        tags: [],
        tagIds,
        rating: null,
      }

      const upsertedCourse = draftCourse?.id
        ? await coursesApi.updateCourse(draftCourse.id, payload)
        : await coursesApi.createCourse(payload)

      sessionStorage.setItem(COURSE_HOME_DRAFT_STORAGE_KEY, JSON.stringify(upsertedCourse))
      persistFormDraft()

      if (mode === 'draft') {
        await coursesApi.deactivateCourse(upsertedCourse.id)
        clearCreationLocalDrafts()
        toast(t('courses.home.feedback.deactivateSuccess'), 'success')
        goBackToDashboard()
        return
      }

      toast(draftCourse?.id ? t('courses.home.feedback.updateSuccess') : t('courses.home.feedback.createSuccess'), 'success')

      if (mode === 'next') {
        sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'sections')
        renderCourseSectionsScreen(container, role, upsertedCourse)
        return
      }

      if (mode === 'review') {
        sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'review')
        renderCourseReviewScreen(container, role, upsertedCourse)
        return
      }
    } catch (error) {
      const mediaErrorMessage = getMediaReferenceErrorMessage(error, 'course')
      if (mediaErrorMessage) {
        setFieldError(imageInput, mediaErrorMessage)
        toast(mediaErrorMessage, 'error')
        return
      }
      toast(t('courses.home.feedback.createError'), 'error')
    }
  }

  if (titleInput) titleInput.value = formDraft?.title ?? draftCourse?.title ?? editCourse?.title ?? ''
  if (descriptionInput) descriptionInput.value = formDraft?.description ?? draftCourse?.description ?? editCourse?.description ?? ''
  if (difficultyInput) difficultyInput.value = formDraft?.difficulty ?? draftCourse?.difficulty ?? editCourse?.difficulty ?? 'beginner'
  if (categoryInput) categoryInput.value = formDraft?.category ?? draftCourse?.category ?? editCourse?.category ?? ''
  if (imageInput) imageInput.value = formDraft?.imageMediaId ?? draftCourse?.imageMediaId ?? editCourse?.imageMediaId ?? ''

  if (descriptionInput && descriptionCount) {
    descriptionCount.textContent = `${descriptionInput.value.length} / 400 caracteres`
  }

  descriptionInput?.addEventListener('input', () => {
    if (!descriptionInput || !descriptionCount) return
    descriptionCount.textContent = `${descriptionInput.value.length} / 400 caracteres`
    persistFormDraft()
  })

  const openMediaBankModal = () => {
    if (!imageInput) return

    type CourseMediaItem = {
      id: string
      title: string
      altText: string
      description: string
      thumbnailUrl: string
    }

    let mode: 'upload' | 'library' = 'library'
    let selectedMediaId: string | null = null
    let mediaItems: CourseMediaItem[] = []
    let selectedFile: File | null = null

    const previewUrls = new Set<string>()
    const modalWrapper = document.createElement('div')
    modalWrapper.id = 'new-course-media-bank-modal'

    const cleanup = () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
      previewUrls.clear()
      modalWrapper.remove()
      document.removeEventListener('keydown', handleEsc)
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cleanup()
    }

    const loadLibrary = async () => {
      const currentUser = getCurrentUser()
      const response =
        currentUser?.role === 'ADMIN' || role === 'ADMIN'
          ? await mediaApi.listAdminMedia({ page: 1, limit: 80, kind: 'image' })
          : await mediaApi.listMyMedia({ page: 1, limit: 80, kind: 'image' })

      previewUrls.forEach((url) => URL.revokeObjectURL(url))
      previewUrls.clear()

      const loadedItems = await Promise.all(
        response.items.map(async (item: MediaResponse) => {
          const id = item.id ?? item._id ?? item.gridFsId
          const blob = await mediaApi.streamMedia(id)
          const objectUrl = URL.createObjectURL(blob)
          previewUrls.add(objectUrl)

          return {
            id,
            title: item.title || item.filename,
            altText: item.altText || '',
            description: item.description || '',
            thumbnailUrl: objectUrl,
          }
        }),
      )

      mediaItems = loadedItems
    }

    const render = () => {
      const selectedMedia = mediaItems.find((item) => item.id === selectedMediaId) ?? null

      modalWrapper.innerHTML = `
        <div class="sections-lesson-modal-overlay" id="new-course-media-bank-overlay" role="dialog" aria-modal="true" aria-labelledby="new-course-media-bank-title">
          <div class="sections-lesson-modal-card new-course-media-bank-card">
            <header class="sections-lesson-modal-header">
              <h2 id="new-course-media-bank-title">${nt('fields.image')}</h2>
              <button type="button" id="new-course-media-bank-close" class="sections-lesson-modal-close" aria-label="${t('courses.sections.modal.close')}">✕</button>
            </header>

            <div class="new-course-media-bank-tabs">
              <button type="button" id="new-course-media-bank-tab-upload" class="new-course-media-bank-tab ${mode === 'upload' ? 'is-active' : ''}">${t('courses.home.mediaBank.internalTabs.upload')}</button>
              <button type="button" id="new-course-media-bank-tab-library" class="new-course-media-bank-tab ${mode === 'library' ? 'is-active' : ''}">${t('courses.home.mediaBank.internalTabs.library')}</button>
            </div>

            <div class="sections-lesson-modal-body">
              ${
                mode === 'upload'
                  ? `
                <div class="new-course-media-bank-upload">
                  <label class="new-course-field">
                    <span>${nt('fields.image')}</span>
                    <input id="new-course-media-upload-file" type="file" accept="image/jpeg,image/png,image/webp">
                  </label>
                  <label class="new-course-field">
                    <span>${t('courses.home.mediaBank.library.fields.title')}</span>
                    <input id="new-course-media-upload-title" type="text" maxlength="50" placeholder="${t('courses.home.mediaBank.library.fields.titlePlaceholder')}">
                  </label>
                  <label class="new-course-field">
                    <span>${t('courses.home.mediaBank.library.fields.altText')}</span>
                    <input id="new-course-media-upload-alt" type="text" maxlength="125" placeholder="${t('courses.home.mediaBank.library.fields.altTextPlaceholder')}">
                  </label>
                  <label class="new-course-field">
                    <span>${t('courses.home.mediaBank.library.fields.description')}</span>
                    <textarea id="new-course-media-upload-description" maxlength="200" placeholder="${t('courses.home.mediaBank.library.fields.descriptionPlaceholder')}"></textarea>
                  </label>
                </div>
              `
                  : `
                <div class="new-course-media-bank-library">
                  <div class="new-course-media-bank-grid">
                    ${
                      mediaItems.length === 0
                        ? `<p class="new-course-media-empty">${t('courses.home.mediaBank.library.selectMediaHint')}</p>`
                        : mediaItems
                            .map(
                              (item) => `
                            <button type="button" class="new-course-media-item ${selectedMediaId === item.id ? 'is-selected' : ''}" data-media-id="${item.id}">
                              <img src="${item.thumbnailUrl}" alt="${escapeHtml(item.altText || item.title)}">
                              <span>${escapeHtml(item.title)}</span>
                            </button>
                          `,
                            )
                            .join('')
                    }
                  </div>
                </div>
              `
              }
            </div>

            <footer class="sections-lesson-modal-actions new-course-media-bank-actions">
              <button type="button" id="new-course-media-bank-cancel" class="new-course-cancel-btn">${nt('ctas.cancel')}</button>
              <button type="button" id="new-course-media-bank-confirm" class="new-course-primary-btn" ${mode === 'library' && !selectedMedia ? 'disabled' : ''}>
                ${mode === 'upload' ? t('courses.home.mediaBank.upload.addMedia') : nt('fields.imageSend')}
              </button>
            </footer>
          </div>
        </div>
      `

      const overlay = modalWrapper.querySelector('#new-course-media-bank-overlay') as HTMLElement | null
      overlay?.addEventListener('click', (event) => {
        if (event.target === overlay) cleanup()
      })

      const closeButton = modalWrapper.querySelector('#new-course-media-bank-close') as HTMLButtonElement | null
      const cancelButton = modalWrapper.querySelector('#new-course-media-bank-cancel') as HTMLButtonElement | null
      closeButton?.addEventListener('click', cleanup)
      cancelButton?.addEventListener('click', cleanup)

      const uploadTab = modalWrapper.querySelector('#new-course-media-bank-tab-upload') as HTMLButtonElement | null
      const libraryTab = modalWrapper.querySelector('#new-course-media-bank-tab-library') as HTMLButtonElement | null
      uploadTab?.addEventListener('click', () => {
        mode = 'upload'
        render()
      })
      libraryTab?.addEventListener('click', async () => {
        mode = 'library'
        try {
          await loadLibrary()
        } catch (error) {
          toast(getMediaBankErrorMessage(error, 'list'), 'error')
        }
        render()
      })

      modalWrapper.querySelectorAll<HTMLButtonElement>('.new-course-media-item').forEach((itemButton) => {
        itemButton.addEventListener('click', () => {
          selectedMediaId = itemButton.dataset.mediaId ?? null
          render()
        })
      })

      const fileInput = modalWrapper.querySelector('#new-course-media-upload-file') as HTMLInputElement | null
      fileInput?.addEventListener('change', () => {
        selectedFile = fileInput.files?.[0] ?? null
      })

      const confirmButton = modalWrapper.querySelector('#new-course-media-bank-confirm') as HTMLButtonElement | null
      confirmButton?.addEventListener('click', async () => {
        if (mode === 'upload') {
          const titleInputEl = modalWrapper.querySelector('#new-course-media-upload-title') as HTMLInputElement | null
          const altInputEl = modalWrapper.querySelector('#new-course-media-upload-alt') as HTMLInputElement | null
          const descInputEl = modalWrapper.querySelector('#new-course-media-upload-description') as HTMLTextAreaElement | null

          const title = titleInputEl?.value.trim() ?? ''
          const altText = altInputEl?.value.trim() ?? ''
          const description = descInputEl?.value.trim() ?? ''

          if (!selectedFile || !title || !altText || !description) {
            toast(t('courses.home.mediaBank.upload.errors.requiredFields'), 'error')
            return
          }

          try {
            const uploadedBinary = await mediaApi.uploadImage({ file: selectedFile })
            const uploadedId = uploadedBinary.id ?? uploadedBinary._id ?? uploadedBinary.gridFsId

            if (!uploadedId) throw new Error('Missing media id')

            const persisted = await mediaApi.createMediaMetadata(uploadedId, 'image', {
              title,
              altText,
              description,
            })

            imageInput.value = persisted.id ?? persisted._id ?? persisted.gridFsId
            clearFieldError(imageInput)
            persistFormDraft()
            cleanup()
            toast(t('courses.home.mediaBank.upload.success'), 'success')
          } catch (error) {
            toast(getMediaBankErrorMessage(error, 'upload'), 'error')
          }
          return
        }

        const selected = mediaItems.find((item) => item.id === selectedMediaId)
        if (!selected) return
        imageInput.value = selected.id
        clearFieldError(imageInput)
        persistFormDraft()
        cleanup()
      })
    }

    document.body.appendChild(modalWrapper)
    document.addEventListener('keydown', handleEsc)

    void (async () => {
      try {
        await loadLibrary()
      } catch (error) {
        toast(getMediaBankErrorMessage(error, 'list'), 'error')
      }
      render()
    })()
  }

  imageTrigger?.addEventListener('click', () => {
    openMediaBankModal()
  })

  titleInput?.addEventListener('input', () => {
    if ((titleInput.value ?? '').trim().length >= 3) clearFieldError(titleInput)
    persistFormDraft()
  })

  titleInput?.addEventListener('blur', () => {
    const value = (titleInput.value ?? '').trim()
    if (!value) {
      setFieldError(titleInput, nt('errors.titleRequired'))
      return
    }
    if (value.length < 3) {
      setFieldError(titleInput, nt('errors.titleMin'))
      return
    }
    clearFieldError(titleInput)
  })

  categoryInput?.addEventListener('input', () => {
    if ((categoryInput.value ?? '').trim().length > 0) clearFieldError(categoryInput)
    persistFormDraft()
  })

  categoryInput?.addEventListener('blur', () => {
    const value = (categoryInput.value ?? '').trim()
    if (!value) {
      setFieldError(categoryInput, nt('errors.categoryRequired'))
      return
    }
    clearFieldError(categoryInput)
  })

  imageInput?.addEventListener('input', () => {
    if ((imageInput.value ?? '').trim().length > 0) clearFieldError(imageInput)
    persistFormDraft()
  })

  difficultyInput?.addEventListener('change', persistFormDraft)

  imageInput?.addEventListener('blur', () => {
    const value = (imageInput.value ?? '').trim()
    if (!value) {
      setFieldError(imageInput, nt('errors.imageRequired'))
      return
    }
    if (!isValidMediaIdFormat(value)) {
      setFieldError(imageInput, nt('errors.imageInvalidFormat'))
      return
    }
    clearFieldError(imageInput)
  })

  descriptionInput?.addEventListener('blur', () => {
    const value = (descriptionInput.value ?? '').trim()
    if (!value) {
      setFieldError(descriptionInput, nt('errors.descriptionRequired'))
      return
    }
    if (value.length < 20) {
      setFieldError(descriptionInput, nt('errors.descriptionMin'))
      return
    }
    clearFieldError(descriptionInput)
  })

  tagsQueryInput?.addEventListener('focus', () => {
    renderTagSuggestions(tagsQueryInput.value.trim())
  })

  tagsQueryInput?.addEventListener('input', () => {
    renderTagSuggestions(tagsQueryInput.value.trim())
  })

  tagsQueryInput?.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()

    const query = tagsQueryInput.value.trim()
    if (!query) return

    try {
      await createTagFromQuery(query)
      tagsQueryInput.value = ''
      renderTagSuggestions('')
      persistFormDraft()
    } catch {
      toast(nt('errors.tagCreate'), 'error')
    }
  })

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('#new-course-tags-input') && !target.closest('#new-course-tags-suggestions')) {
      if (tagsSuggestions) tagsSuggestions.hidden = true
    }
  })

  ;(async () => {
    try {
      availableTags = await tagsApi.getTags()

      const initialTagIds = formDraft?.selectedTagIds?.length
        ? formDraft.selectedTagIds
        : draftCourse?.tags ?? []

      if (initialTagIds.length > 0) {
        selectedTags = availableTags.filter((tag) => initialTagIds.includes(tag.id))
        renderSelectedTags()
      }

      renderTagSuggestions('')
    } catch {
      availableTags = []
    }
  })()

  backButton?.addEventListener('click', () => {
    persistFormDraft()
    goBackToDashboard()
  })
  cancelButton?.addEventListener('click', () => {
    renderCancelCourseModal()
  })
  draftButton?.addEventListener('click', async () => {
    await submitNewCourse('draft')
  })
  draftButtonMobile?.addEventListener('click', async () => {
    await submitNewCourse('draft')
  })
  nextButton?.addEventListener('click', async () => {
    await submitNewCourse('next')
  })

  if (isEditMode && editCourse) {
    document.getElementById('edit-course-deactivate')?.addEventListener('click', async () => {
      try {
        if (editCourse.isActive !== false) {
          await coursesApi.deactivateCourse(editCourse.id)
          toast(t('courses.home.feedback.deactivateSuccess'), 'success')
        } else {
          await coursesApi.activateCourse(editCourse.id)
          toast(t('courses.home.feedback.activateSuccess'), 'success')
        }
        sessionStorage.removeItem('educado.editCourseId')
        sessionStorage.removeItem(COURSE_HOME_VIEW_STORAGE_KEY)
        renderHomePage(container, role)
      } catch {
        toast(t('courses.home.feedback.statusError'), 'error')
      }
    })

    document.getElementById('edit-course-delete')?.addEventListener('click', async () => {
      if (!window.confirm(t('courses.home.feedback.confirmDeleteCourse'))) return
      try {
        await coursesApi.deleteCourse(editCourse.id)
        toast(t('courses.home.feedback.deleteSuccess'), 'success')
        sessionStorage.removeItem('educado.editCourseId')
        sessionStorage.removeItem(COURSE_HOME_VIEW_STORAGE_KEY)
        renderHomePage(container, role)
      } catch {
        toast(t('courses.home.feedback.deleteError'), 'error')
      }
    })
  }

  container.querySelectorAll<HTMLButtonElement>('[data-course-step]').forEach((stepButton) => {
    stepButton.addEventListener('click', () => {
      const target = stepButton.dataset.courseStep

      if (target === 'create') return

      if (target === 'sections') {
        void submitNewCourse('next')
        return
      }

      if (target === 'review') {
        void submitNewCourse('review')
      }
    })
  })
}

function renderCourseSectionsScreen(container: HTMLElement, role: HomeUserRole, draftCourse: Course | null) {
  clearCourseTabsInHeader()
  sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'sections')

  const st = (path: string, params?: Record<string, string | number>) => t(`courses.sections.${path}`, params)

  const isEditMode = Boolean(sessionStorage.getItem('educado.editCourseId'))
  const courseTitle = draftCourse?.title ?? st('defaultSectionTitle')

  container.innerHTML = `
    <section class="new-course-page">
      <div class="new-course-layout sections-layout">
        <aside class="new-course-sidebar">
          <div class="new-course-sidebar-header">
            <h2>${isEditMode ? t('courses.editCourse.title') : t('courses.newCourse.title')}</h2>
            <div class="new-course-divider"></div>
          </div>

          <div class="new-course-steps">
            <button type="button" class="new-course-step is-complete" data-course-step="create">
              <span class="new-course-step-check">✓</span>
              <span>${t('courses.newCourse.generalInfo')}</span>
            </button>
            <button type="button" class="new-course-step is-active" data-course-step="sections">
              <span class="new-course-step-box"></span>
              <span>${t('courses.newCourse.sections')}</span>
            </button>
            <button type="button" class="new-course-step" data-course-step="review">
              <span class="new-course-step-box"></span>
              <span>${t('courses.newCourse.review')}</span>
            </button>
          </div>

          <div class="new-course-divider"></div>

          <button id="sections-save-draft" class="new-course-outline-btn" type="button">${t('courses.newCourse.saveDraft')}</button>
          ${isEditMode && draftCourse ? `
            <div class="new-course-divider"></div>
            <button id="sections-edit-deactivate" class="new-course-outline-btn" type="button" style="border-color: #e0912d; color: #e0912d;">
              ${draftCourse.isActive !== false ? t('courses.editCourse.deactivate') : t('courses.editCourse.activate')}
            </button>
            <button id="sections-edit-delete" class="new-course-outline-btn" type="button" style="border-color: #d62b25; color: #d62b25;">
              ${t('courses.editCourse.deleteCourse')}
            </button>
          ` : ''}
        </aside>

        <div class="new-course-content sections-content">
          <div class="new-course-main">
            <div class="sections-header-row">
              <h1>${st('title')}</h1>
              <div class="sections-workload"><span>${st('workload')}:</span><strong id="sections-workload-value">0 ${st('hours')}</strong></div>
            </div>

            <div class="sections-alert">
              <span class="sections-alert-icon">!</span>
              <div>
                <strong>${st('attentionTitle')}</strong>
                <p>${st('attentionMessage')}</p>
              </div>
            </div>

            <div id="sections-list" class="sections-list"></div>

            <button id="sections-add" class="sections-add-btn" type="button">+ ${st('newSection')}</button>
          </div>

          <div class="new-course-footer">
            <button id="sections-back" class="new-course-link-btn" type="button">${t('courses.newCourse.ctas.back')}</button>
            <div class="new-course-footer-actions">
              <button id="sections-cancel" class="new-course-cancel-btn" type="button">${t('courses.newCourse.ctas.cancel')}</button>
              <button id="sections-next" class="new-course-primary-btn" type="button">${st('nextReview')}</button>
            </div>
          </div>

          <div class="new-course-mobile-draft">
            <button id="sections-save-draft-mobile" class="new-course-outline-btn" type="button">${t('courses.newCourse.saveDraft')}</button>
          </div>
        </div>
      </div>
    </section>
  `

  type ActivityDraft = {
    id: string
    sectionId: string
    title: string
    type: ActivityType
    order: number
  }

  type SectionDraft = {
    id: string
    courseId: string
    name: string
    description: string
    order: number
    lessons: number
    exercises: number
    activities: ActivityDraft[]
    videoMediaId?: string | null
    thumbnailMediaId?: string | null
    mediaPreview?: { kind: 'video' | 'image'; src: string; poster?: string } | null
  }
  type LessonContentType = '' | 'video' | 'styledText'
  type ExerciseContentType = '' | 'multipleChoice' | 'trueFalse'

  let sections: SectionDraft[] = []
  let lessonModalState: {
    isOpen: boolean
    sectionId: string | null
    editingActivityId: string | null
    sectionIndex: number
    name: string
    contentType: LessonContentType
    firstText: string
    videoFileName: string
    videoMediaId: string | null
    hasVideoQuestion: boolean
    videoQuestion: string
    videoAlternatives: string[]
    correctVideoAlternativeIndex: number | null
    nameError: boolean
    contentTypeError: boolean
    firstTextError: boolean
    videoError: boolean
    videoQuestionError: boolean
    videoAlternativesError: boolean
    videoCorrectAlternativeError: boolean
  } = {
    isOpen: false,
    sectionId: null,
    editingActivityId: null,
    sectionIndex: 0,
    name: '',
    contentType: '',
    firstText: '',
    videoFileName: '',
    videoMediaId: null,
    hasVideoQuestion: true,
    videoQuestion: '',
    videoAlternatives: ['', ''],
    correctVideoAlternativeIndex: 0,
    nameError: false,
    contentTypeError: false,
    firstTextError: false,
    videoError: false,
    videoQuestionError: false,
    videoAlternativesError: false,
    videoCorrectAlternativeError: false,
  }

  let exerciseModalState: {
    isOpen: boolean
    sectionId: string | null
    editingActivityId: string | null
    sectionIndex: number
    title: string
    contentType: ExerciseContentType
    question: string
    alternatives: string[]
    correctAlternativeIndex: number | null
    includeImage: boolean
    imageFileName: string
    titleError: boolean
    contentTypeError: boolean
    questionError: boolean
    alternativesError: boolean
    correctAlternativeError: boolean
    imageError: boolean
  } = {
    isOpen: false,
    sectionId: null,
    editingActivityId: null,
    sectionIndex: 0,
    title: '',
    contentType: '',
    question: '',
    alternatives: ['', ''],
    correctAlternativeIndex: 0,
    includeImage: false,
    imageFileName: '',
    titleError: false,
    contentTypeError: false,
    questionError: false,
    alternativesError: false,
    correctAlternativeError: false,
    imageError: false,
  }

  let selectedLessonVideo: File | null = null
  let selectedExerciseImageMediaId: string | null = null
  let deleteSectionModalState: {
    isOpen: boolean
    sectionId: string | null
  } = {
    isOpen: false,
    sectionId: null,
  }

  let cancelCourseModalState: {
    isOpen: boolean
  } = {
    isOpen: false,
  }

  let previewActivityModalState: {
    isOpen: boolean
    sectionIndex: number
    activity: Activity | null
  } = {
    isOpen: false,
    sectionIndex: 0,
    activity: null,
  }
  const draftCourseId = draftCourse?.id ?? ''
  const getSectionsLocalKey = () => `${COURSE_HOME_SECTIONS_LOCAL_STORAGE_KEY}:${draftCourseId || 'local'}`

  const sectionsList = document.getElementById('sections-list')
  const workloadValue = document.getElementById('sections-workload-value')

  const persistSectionsLocalSnapshot = () => {
    const payload = {
      courseId: draftCourseId,
      sections: sections.map((section) => ({
        id: section.id,
        name: section.name,
        description: section.description,
      })),
    }

    sessionStorage.setItem(getSectionsLocalKey(), JSON.stringify(payload))
  }

  const readSectionsLocalSnapshot = () => {
    const raw = sessionStorage.getItem(getSectionsLocalKey())
    if (!raw) return null

    try {
      return JSON.parse(raw) as {
        courseId: string
        sections: Array<{ id: string; name: string; description: string }>
      }
    } catch {
      return null
    }
  }

  const clearSectionsLocalSnapshot = () => {
    sessionStorage.removeItem(getSectionsLocalKey())
  }

  const mergeSectionsLocalSnapshot = () => {
    const local = readSectionsLocalSnapshot()
    if (!local?.sections?.length) return

    sections = sections.map((section) => {
      const localSection = local.sections.find((item) => item.id === section.id)
      if (!localSection) return section

      return {
        ...section,
        name: localSection.name ?? section.name,
        description: localSection.description ?? section.description,
      }
    })
  }

  const countSectionActivities = (activities: ActivityDraft[]) => {
    const lessons = activities.filter((item) => item.type === 'video_pause' || item.type === 'text_reading').length
    const exercises = activities.filter((item) => item.type === 'multiple_choice' || item.type === 'true_false').length
    return { lessons, exercises }
  }

  const mapActivities = (items: Activity[]): ActivityDraft[] => {
    return items
      .map((item) => ({
        id: item.id,
        sectionId: item.sectionId,
        title: item.title ?? st('defaultSectionTitle'),
        type: item.type,
        order: item.order,
      }))
      .sort((a, b) => a.order - b.order)
  }

  const mapSection = (section: { id: string; courseId: string; title: string; order: number }, activities: Activity[]): SectionDraft => {
    const mappedActivities = mapActivities(activities)
    const counts = countSectionActivities(mappedActivities)

    return {
      id: section.id,
      courseId: section.courseId,
      name: section.title,
      description: '',
      order: section.order,
      lessons: counts.lessons,
      exercises: counts.exercises,
      activities: mappedActivities,
    }
  }

  const loadSectionsFromBackend = async () => {
    if (!draftCourseId) {
      sections = [{
        id: crypto.randomUUID(),
        courseId: '',
        name: st('sectionName', { index: 1 }),
        description: '',
        order: 0,
        lessons: 0,
        exercises: 0,
        activities: [],
      }]
      renderSections()
      updateWorkload()
      return
    }

    try {
      const allSections = await sectionsApi.getSections()
      const courseSections = allSections
        .filter((item) => item.courseId === draftCourseId)
        .sort((a, b) => a.order - b.order)

      const resolvedSections = await Promise.all(
        courseSections.map(async (section) => {
          const activities = await activitiesApi.getActivitiesBySection(section.id)
          return mapSection(section, activities)
        }),
      )

      sections = resolvedSections
      mergeSectionsLocalSnapshot()

      if (sections.length === 0) {
        await createSection({ silentError: true })
        return
      }

      renderSections()
      updateWorkload()
    } catch {
      sections = [{
        id: crypto.randomUUID(),
        courseId: draftCourseId,
        name: st('sectionName', { index: 1 }),
        description: '',
        order: 0,
        lessons: 0,
        exercises: 0,
        activities: [],
      }]
      renderSections()
      updateWorkload()
    }
  }

  const createSection = async (options?: { silentError?: boolean }) => {
    if (!draftCourseId) {
      return
    }

    try {
      const createdSection = await sectionsApi.createSection({
        id: crypto.randomUUID(),
        courseId: draftCourseId,
        title: st('sectionName', { index: sections.length + 1 }),
        order: sections.length,
      })

      sections.push({
        id: createdSection.id,
        courseId: createdSection.courseId,
        name: createdSection.title,
        description: '',
        order: createdSection.order,
        lessons: 0,
        exercises: 0,
        activities: [],
      })

      sections.sort((a, b) => a.order - b.order)
      persistSectionsLocalSnapshot()
      renderSections()
      updateWorkload()
    } catch {
      if (!options?.silentError) {
        toast(t('courses.home.feedback.actionError'), 'error')
      }
    }
  }

  const persistSectionName = async (sectionId: string, name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) return

    try {
      const updated = await sectionsApi.updateSection(sectionId, { title: trimmedName })
      const section = sections.find((item) => item.id === sectionId)
      if (section) section.name = updated.title
      persistSectionsLocalSnapshot()
      renderSections()
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const deleteActivity = async (sectionId: string, activityId: string) => {
    try {
      await activitiesApi.deleteActivity(activityId)
      const section = sections.find((item) => item.id === sectionId)
      if (!section) return

      section.activities = section.activities
        .filter((item) => item.id !== activityId)
        .map((item, index) => ({ ...item, order: index }))

      await Promise.all(
        section.activities.map((item) => activitiesApi.updateActivity(item.id, { order: item.order })),
      )

      const counts = countSectionActivities(section.activities)
      section.lessons = counts.lessons
      section.exercises = counts.exercises

      persistSectionsLocalSnapshot()
      renderSections()
      updateWorkload()
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const deleteSection = async (sectionId: string) => {
    const target = sections.find((item) => item.id === sectionId)
    if (!target) return

    if (!target.courseId) {
      sections = sections.filter((item) => item.id !== sectionId)
      if (sections.length === 0) {
        sections = [{
          id: crypto.randomUUID(),
          courseId: '',
          name: st('sectionName', { index: 1 }),
          description: '',
          order: 0,
          lessons: 0,
          exercises: 0,
          activities: [],
        }]
      }
      renderSections()
      updateWorkload()
      return
    }

    try {
      const activities = await activitiesApi.getActivitiesBySection(sectionId)
      await Promise.all(activities.map((item) => activitiesApi.deleteActivity(item.id)))
      await sectionsApi.deleteSection(sectionId)

      sections = sections.filter((item) => item.id !== sectionId)

      await Promise.all(
        sections.map((item, index) => sectionsApi.updateSection(item.id, { order: index })),
      )

      sections = sections.map((item, index) => ({ ...item, order: index }))

      if (sections.length === 0) {
        await createSection({ silentError: true })
        return
      }

      persistSectionsLocalSnapshot()
      renderSections()
      updateWorkload()
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const modalPortalId = 'sections-lesson-modal-portal'
  const getOrCreateModalPortal = () => {
    let portal = document.getElementById(modalPortalId)
    if (!portal) {
      portal = document.createElement('div')
      portal.id = modalPortalId
      document.body.appendChild(portal)
    }
    return portal
  }

  const handleLessonModalKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    if (lessonModalState.isOpen) {
      closeLessonModal()
      return
    }

    if (exerciseModalState.isOpen) {
      closeExerciseModal()
      return
    }

    if (previewActivityModalState.isOpen) {
      closePreviewActivityModal()
      return
    }

    if (deleteSectionModalState.isOpen) {
      closeDeleteSectionModal()
    }
  }

  const clearLessonModalPortal = () => {
    const portal = document.getElementById(modalPortalId)
    if (portal) portal.innerHTML = ''
    document.body.classList.remove('sections-modal-open')
    document.removeEventListener('keydown', handleLessonModalKeydown)
  }

  const closeLessonModal = () => {
    lessonModalState = {
      ...lessonModalState,
      isOpen: false,
      sectionId: null,
      editingActivityId: null,
    }
    selectedLessonVideo = null
    clearLessonModalPortal()
  }

  const closeExerciseModal = () => {
    exerciseModalState = {
      ...exerciseModalState,
      isOpen: false,
      sectionId: null,
      editingActivityId: null,
    }
    selectedExerciseImageMediaId = null
    clearLessonModalPortal()
  }

  const closeDeleteSectionModal = () => {
    deleteSectionModalState = {
      isOpen: false,
      sectionId: null,
    }
    clearLessonModalPortal()
  }

  const closePreviewActivityModal = () => {
    previewActivityModalState = {
      isOpen: false,
      sectionIndex: 0,
      activity: null,
    }
    clearLessonModalPortal()
  }

  const openDeleteSectionModal = (sectionId: string) => {
    deleteSectionModalState = {
      isOpen: true,
      sectionId,
    }
    renderDeleteSectionModal()
  }

  const closeCancelCourseModal = () => {
    cancelCourseModalState = { isOpen: false }
    clearLessonModalPortal()
  }

  const deleteDraftCourseWithDependents = async () => {
    if (!draftCourseId) return

    const allSections = await sectionsApi.getSections()
    const courseSections = allSections.filter((section) => section.courseId === draftCourseId)

    await Promise.all(
      courseSections.map(async (section) => {
        const activities = await activitiesApi.getActivitiesBySection(section.id)
        await Promise.all(activities.map((activity) => activitiesApi.deleteActivity(activity.id)))
      }),
    )

    await Promise.all(courseSections.map((section) => sectionsApi.deleteSection(section.id)))
    await coursesApi.deleteCourse(draftCourseId)
  }

  const openCancelCourseModal = () => {
    cancelCourseModalState = { isOpen: true }
    renderCancelCourseModal()
  }

  const renderCancelCourseModal = () => {
    const modalPortal = getOrCreateModalPortal()

    if (!cancelCourseModalState.isOpen) {
      clearLessonModalPortal()
      return
    }

    document.body.classList.add('sections-modal-open')
    document.removeEventListener('keydown', handleLessonModalKeydown)
    document.addEventListener('keydown', handleLessonModalKeydown)

    const modalTitleText = isEditMode ? t('courses.editCourse.cancelModal.title') : st('cancelCourseModal.title')
    const modalMessageText = isEditMode ? t('courses.editCourse.cancelModal.message') : st('cancelCourseModal.message')
    const modalCancelText = isEditMode ? t('courses.editCourse.cancelModal.cancel') : st('cancelCourseModal.cancel')
    const modalConfirmText = isEditMode ? t('courses.editCourse.cancelModal.confirm') : st('cancelCourseModal.confirm')

    modalPortal.innerHTML = `
      <div class="sections-lesson-modal-overlay" id="sections-cancel-course-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-cancel-course-modal-title">
        <div class="sections-lesson-modal-card sections-delete-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-cancel-course-modal-title">${modalTitleText}</h2>
            <button type="button" id="sections-cancel-course-modal-close" class="sections-lesson-modal-close" aria-label="${st('modal.close')}">✕</button>
          </header>
          <div class="sections-lesson-modal-body">
            <p class="sections-delete-modal-message">${modalMessageText}</p>
          </div>
          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-cancel-course-modal-back" class="new-course-cancel-btn">${modalCancelText}</button>
            <button type="button" id="sections-cancel-course-modal-confirm" class="new-course-primary-btn">${modalConfirmText}</button>
          </footer>
        </div>
      </div>
    `

    const overlay = document.getElementById('sections-cancel-course-modal-overlay')
    const closeButton = document.getElementById('sections-cancel-course-modal-close') as HTMLButtonElement | null
    const backButton = document.getElementById('sections-cancel-course-modal-back') as HTMLButtonElement | null
    const confirmButton = document.getElementById('sections-cancel-course-modal-confirm') as HTMLButtonElement | null

    overlay?.addEventListener('click', (event) => {
      if (event.target === overlay) closeCancelCourseModal()
    })

    closeButton?.addEventListener('click', closeCancelCourseModal)
    backButton?.addEventListener('click', closeCancelCourseModal)

    confirmButton?.addEventListener('click', async () => {
      try {
        if (!isEditMode) {
          await deleteDraftCourseWithDependents()
        }
        sessionStorage.removeItem(COURSE_HOME_DRAFT_STORAGE_KEY)
        sessionStorage.removeItem(COURSE_HOME_FORM_DRAFT_STORAGE_KEY)
        sessionStorage.removeItem('educado.editCourseId')
        clearSectionsLocalSnapshot()
        closeCancelCourseModal()
        toList({ clearDraft: true })
      } catch {
        toast(t('courses.home.feedback.actionError'), 'error')
      }
    })
  }

  const syncSectionNamesToBackend = async () => {
    await Promise.all(
      sections
        .filter((section) => section.id && section.courseId)
        .map((section) => sectionsApi.updateSection(section.id, { title: section.name.trim() || st('defaultSectionTitle') })),
    )
  }

  const saveDraftAndExit = async () => {
    try {
      await syncSectionNamesToBackend()

      if (draftCourseId) {
        await coursesApi.deactivateCourse(draftCourseId)
      }

      clearSectionsLocalSnapshot()
      sessionStorage.removeItem(COURSE_HOME_FORM_DRAFT_STORAGE_KEY)
      sessionStorage.removeItem('educado.editCourseId')
      toast(t('courses.home.feedback.deactivateSuccess'), 'success')
      toList({ clearDraft: true })
    } catch {
      persistSectionsLocalSnapshot()
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const renderDeleteSectionModal = () => {
    const modalPortal = getOrCreateModalPortal()

    if (!deleteSectionModalState.isOpen || !deleteSectionModalState.sectionId) {
      clearLessonModalPortal()
      return
    }

    document.body.classList.add('sections-modal-open')
    document.removeEventListener('keydown', handleLessonModalKeydown)
    document.addEventListener('keydown', handleLessonModalKeydown)

    modalPortal.innerHTML = `
      <div class="sections-lesson-modal-overlay" id="sections-delete-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-delete-modal-title">
        <div class="sections-lesson-modal-card sections-delete-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-delete-modal-title">${st('deleteModal.title')}</h2>
            <button type="button" id="sections-delete-modal-close" class="sections-lesson-modal-close" aria-label="${st('modal.close')}">✕</button>
          </header>

          <div class="sections-lesson-modal-body">
            <p class="sections-delete-modal-message">${st('deleteModal.message')}</p>
          </div>

          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-delete-modal-cancel" class="new-course-cancel-btn">${st('deleteModal.cancel')}</button>
            <button type="button" id="sections-delete-modal-confirm" class="new-course-primary-btn">${st('deleteModal.confirm')}</button>
          </footer>
        </div>
      </div>
    `

    const overlay = document.getElementById('sections-delete-modal-overlay')
    const closeButton = document.getElementById('sections-delete-modal-close') as HTMLButtonElement | null
    const cancelButton = document.getElementById('sections-delete-modal-cancel') as HTMLButtonElement | null
    const confirmButton = document.getElementById('sections-delete-modal-confirm') as HTMLButtonElement | null

    overlay?.addEventListener('click', (event) => {
      if (event.target === overlay) closeDeleteSectionModal()
    })

    closeButton?.addEventListener('click', closeDeleteSectionModal)
    cancelButton?.addEventListener('click', closeDeleteSectionModal)

    confirmButton?.addEventListener('click', async () => {
      const sectionId = deleteSectionModalState.sectionId
      if (!sectionId) {
        closeDeleteSectionModal()
        return
      }

      await deleteSection(sectionId)
      closeDeleteSectionModal()
    })
  }

  const openLessonModal = (sectionId: string) => {
    const sectionIndex = sections.findIndex((item) => item.id === sectionId)
    if (sectionIndex < 0) return

    lessonModalState = {
      isOpen: true,
      sectionId,
      editingActivityId: null,
      sectionIndex,
      name: '',
      contentType: '',
      firstText: '',
      videoFileName: '',
      videoMediaId: null,
      hasVideoQuestion: true,
      videoQuestion: '',
      videoAlternatives: ['', ''],
      correctVideoAlternativeIndex: 0,
      nameError: false,
      contentTypeError: false,
      firstTextError: false,
      videoError: false,
      videoQuestionError: false,
      videoAlternativesError: false,
      videoCorrectAlternativeError: false,
    }
    selectedLessonVideo = null
    renderLessonModal()
  }

  const openExerciseModal = (sectionId: string) => {
    const sectionIndex = sections.findIndex((item) => item.id === sectionId)
    if (sectionIndex < 0) return

    exerciseModalState = {
      isOpen: true,
      sectionId,
      editingActivityId: null,
      sectionIndex,
      title: '',
      contentType: '',
      question: '',
      alternatives: ['', ''],
      correctAlternativeIndex: 0,
      includeImage: false,
      imageFileName: '',
      titleError: false,
      contentTypeError: false,
      questionError: false,
      alternativesError: false,
      correctAlternativeError: false,
      imageError: false,
    }

    selectedExerciseImageMediaId = null

    renderExerciseModal()
  }

  const openEditActivityModal = async (sectionId: string, activityId: string) => {
    const sectionIndex = sections.findIndex((item) => item.id === sectionId)
    if (sectionIndex < 0) return

    try {
      const activity = await activitiesApi.getActivity(activityId)
      const activityQuestion = activity.question ?? ''
      const activityOptions = activity.options ?? []
      const activityTextPages = activity.textPages ?? []
      const numericCorrectAnswer = typeof activity.correctAnswer === 'number'
        ? activity.correctAnswer
        : (activity.correctAnswer === true ? 0 : 1)

      if (activity.type === 'video_pause' || activity.type === 'text_reading') {
        const hasVideoQuestion = activity.type === 'video_pause' && activityQuestion.trim().length > 0
        const videoOptions = hasVideoQuestion
          ? (activityOptions.length >= 2 ? activityOptions : ['', ''])
          : ['', '']

        // Fetch existing video name if the section has a linked video
        const existingVideoMediaId = sections[sectionIndex]?.videoMediaId ?? null
        let existingVideoFileName = ''
        if (existingVideoMediaId && activity.type === 'video_pause') {
          try {
            const videoMeta = await mediaApi.getVideoById(existingVideoMediaId)
            existingVideoFileName = videoMeta.title || videoMeta.filename || existingVideoMediaId
          } catch {
            existingVideoFileName = existingVideoMediaId
          }
        }

        lessonModalState = {
          isOpen: true,
          sectionId,
          editingActivityId: activity.id,
          sectionIndex,
          name: activity.title ?? '',
          contentType: activity.type === 'video_pause' ? 'video' : 'styledText',
          firstText: activity.type === 'text_reading' ? (activityTextPages[0] ?? '') : '',
          videoFileName: existingVideoFileName,
          videoMediaId: existingVideoMediaId,
          hasVideoQuestion,
          videoQuestion: activity.type === 'video_pause' ? activityQuestion : '',
          videoAlternatives: videoOptions,
          correctVideoAlternativeIndex: activity.type === 'video_pause' ? numericCorrectAnswer : 0,
          nameError: false,
          contentTypeError: false,
          firstTextError: false,
          videoError: false,
          videoQuestionError: false,
          videoAlternativesError: false,
          videoCorrectAlternativeError: false,
        }

        selectedLessonVideo = null
        renderLessonModal()
        return
      }

      if (activity.type === 'multiple_choice' || activity.type === 'true_false') {
        const isTrueFalse = activity.type === 'true_false'
        const language = getLanguage()
        const trueLabel = language === 'en-US' ? 'True' : 'Verdadeiro'
        const falseLabel = language === 'en-US' ? 'False' : 'Falso'

        exerciseModalState = {
          isOpen: true,
          sectionId,
          editingActivityId: activity.id,
          sectionIndex,
          title: activity.title ?? '',
          contentType: isTrueFalse ? 'trueFalse' : 'multipleChoice',
          question: activityQuestion,
          alternatives: isTrueFalse ? [trueLabel, falseLabel] : (activityOptions.length >= 2 ? activityOptions : ['', '']),
          correctAlternativeIndex: numericCorrectAnswer,
          includeImage: Boolean(activity.imageMediaId),
          imageFileName: activity.imageMediaId ? t('courses.home.mediaBank.library.selectMediaHint') : '',
          titleError: false,
          contentTypeError: false,
          questionError: false,
          alternativesError: false,
          correctAlternativeError: false,
          imageError: false,
        }

        selectedExerciseImageMediaId = activity.imageMediaId ?? null
        renderExerciseModal()
      }
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const openPreviewActivityModal = async (sectionId: string, activityId: string) => {
    const sectionIndex = sections.findIndex((item) => item.id === sectionId)
    if (sectionIndex < 0) return

    try {
      const activity = await activitiesApi.getActivity(activityId)
      previewActivityModalState = {
        isOpen: true,
        sectionIndex,
        activity,
      }
      renderPreviewActivityModal()
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const renderPreviewActivityModal = () => {
    const modalPortal = getOrCreateModalPortal()

    if (!previewActivityModalState.isOpen || !previewActivityModalState.activity) {
      clearLessonModalPortal()
      return
    }

    document.body.classList.add('sections-modal-open')
    document.removeEventListener('keydown', handleLessonModalKeydown)
    document.addEventListener('keydown', handleLessonModalKeydown)

    const activity = previewActivityModalState.activity
    const r = (path: string, params?: Record<string, string | number>) => t(`courses.sections.readModal.${path}`, params)
    const activityQuestion = activity.question ?? ''
    const activityOptions = activity.options ?? []
    const activityTextPages = activity.textPages ?? []
    const textBody = activityTextPages.join('\n\n').trim()
    const numericCorrectAnswer = typeof activity.correctAnswer === 'number'
      ? activity.correctAnswer
      : (activity.correctAnswer === true ? 0 : 1)
    const typeLabel = activity.type === 'video_pause'
      ? st('modal.contentTypes.video')
      : activity.type === 'text_reading'
        ? st('modal.contentTypes.styledText')
        : activity.type === 'true_false'
          ? t('courses.sections.exerciseModal.contentTypes.trueFalse')
          : t('courses.sections.exerciseModal.contentTypes.multipleChoice')

    const optionsMarkup = activityOptions
      .map((option, index) => `
        <li class="sections-preview-option ${numericCorrectAnswer === index ? 'is-correct' : ''}">
          <span>${escapeHtml(option)}</span>
          ${numericCorrectAnswer === index ? `<strong>${r('correct')}</strong>` : ''}
        </li>
      `)
      .join('')

    modalPortal.innerHTML = `
      <div class="sections-lesson-modal-overlay" id="sections-preview-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-preview-modal-title">
        <div class="sections-lesson-modal-card sections-preview-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-preview-modal-title">${r('title')}</h2>
            <button type="button" id="sections-preview-modal-close" class="sections-lesson-modal-close" aria-label="${st('modal.close')}">✕</button>
          </header>

          <div class="sections-lesson-modal-body">
            <div class="sections-preview-badge">${r('section', { index: previewActivityModalState.sectionIndex + 1 })}</div>
            <div class="sections-preview-grid">
              <div class="sections-preview-row">
                <strong>${r('activityName')}</strong>
                <span>${escapeHtml(activity.title ?? '')}</span>
              </div>
              <div class="sections-preview-row">
                <strong>${r('activityType')}</strong>
                <span>${escapeHtml(typeLabel)}</span>
              </div>
            </div>
            ${textBody ? `<div class="sections-preview-block"><strong>${r('textBody')}</strong><div class="sections-preview-text-body">${escapeHtml(textBody).replace(/\n/g, '<br>')}</div></div>` : ''}
            ${activityQuestion ? `<div class="sections-preview-block"><strong>${r('question')}</strong><div class="sections-preview-text-body">${escapeHtml(activityQuestion)}</div></div>` : ''}
            ${activityOptions.length > 0 ? `<div class="sections-preview-block"><strong>${r('alternatives')}</strong><ul class="sections-preview-options">${optionsMarkup}</ul></div>` : ''}
          </div>

          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-preview-modal-ok" class="new-course-primary-btn">${r('close')}</button>
          </footer>
        </div>
      </div>
    `

    const overlay = document.getElementById('sections-preview-modal-overlay')
    const closeButton = document.getElementById('sections-preview-modal-close') as HTMLButtonElement | null
    const okButton = document.getElementById('sections-preview-modal-ok') as HTMLButtonElement | null

    overlay?.addEventListener('click', (event) => {
      if (event.target === overlay) closePreviewActivityModal()
    })

    closeButton?.addEventListener('click', closePreviewActivityModal)
    okButton?.addEventListener('click', closePreviewActivityModal)
  }

  const validateVideoDuration = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const source = URL.createObjectURL(file)
      const probe = document.createElement('video')
      probe.preload = 'metadata'

      probe.onloadedmetadata = () => {
        const valid = probe.duration <= 180
        URL.revokeObjectURL(source)
        resolve(valid)
      }

      probe.onerror = () => {
        URL.revokeObjectURL(source)
        resolve(false)
      }

      probe.src = source
    })
  }

  const renderLessonModal = () => {
    const modalPortal = getOrCreateModalPortal()
    const previousModalScrollTop = (document.querySelector('.sections-lesson-modal-card') as HTMLElement | null)?.scrollTop ?? 0

    if (!lessonModalState.isOpen || !lessonModalState.sectionId) {
      clearLessonModalPortal()
      return
    }

    document.body.classList.add('sections-modal-open')
    document.removeEventListener('keydown', handleLessonModalKeydown)
    document.addEventListener('keydown', handleLessonModalKeydown)

    const showStyledTextFields = lessonModalState.contentType === 'styledText'
    const showVideoField = lessonModalState.contentType === 'video'
    const showVideoQuestionField = showVideoField && lessonModalState.hasVideoQuestion
    const firstTextCounter = `${lessonModalState.firstText.length}/270 ${st('modal.characters')}`
    const videoQuestionCounter = `${lessonModalState.videoQuestion.length}/70 ${st('modal.characters')}`
    const canAddAlternative = lessonModalState.videoAlternatives.length < 4
    const canRemoveAlternative = lessonModalState.videoAlternatives.length > 2

    const openLessonVideoMediaModal = () => {
      type LessonVideoMediaItem = {
        id: string
        title: string
        altText: string
        description: string
        blob: Blob
        previewUrl: string
      }

      let mode: 'upload' | 'library' = 'library'
      let selectedMediaId: string | null = null
      let selectedFile: File | null = selectedLessonVideo
      let mediaItems: LessonVideoMediaItem[] = []

      const previewUrls = new Set<string>()
      const modalWrapper = document.createElement('div')
      modalWrapper.id = 'new-course-media-bank-modal'

      const cleanup = () => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        previewUrls.clear()
        modalWrapper.remove()
        document.removeEventListener('keydown', handleEsc)
      }

      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') cleanup()
      }

      const setVideoThumbnailFrame = (videoElement: HTMLVideoElement, frameInSeconds = 5) => {
        const applyFrame = () => {
          const duration = Number.isFinite(videoElement.duration) ? videoElement.duration : 0
          if (duration <= 0) {
            videoElement.pause()
            return
          }

          const targetTime = Math.min(frameInSeconds, Math.max(duration - 0.1, 0))

          const pauseAtFrame = () => {
            videoElement.pause()
          }

          videoElement.addEventListener('seeked', pauseAtFrame, { once: true })

          try {
            videoElement.currentTime = targetTime
          } catch {
            videoElement.pause()
          }
        }

        if (videoElement.readyState >= 1) {
          applyFrame()
          return
        }

        videoElement.addEventListener('loadedmetadata', applyFrame, { once: true })
      }

      const loadLibrary = async () => {
        const currentUser = getCurrentUser()
        const response =
          currentUser?.role === 'ADMIN' || role === 'ADMIN'
            ? await mediaApi.listAdminMedia({ page: 1, limit: 80, kind: 'video' })
            : await mediaApi.listMyMedia({ page: 1, limit: 80, kind: 'video' })

        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        previewUrls.clear()

        const loadedItems = await Promise.all(
          response.items.map(async (item: MediaResponse) => {
            const id = item.id ?? item._id ?? item.gridFsId
            const blob = await mediaApi.streamMedia(id)
            const previewUrl = URL.createObjectURL(blob)
            previewUrls.add(previewUrl)

            return {
              id,
              title: item.title || item.filename,
              altText: item.altText || '',
              description: item.description || '',
              blob,
              previewUrl,
            }
          }),
        )

        mediaItems = loadedItems
      }

      const renderMediaModal = () => {
        const selectedMedia = mediaItems.find((item) => item.id === selectedMediaId) ?? null

        modalWrapper.innerHTML = `
          <div class="sections-lesson-modal-overlay" id="new-course-media-bank-overlay" role="dialog" aria-modal="true" aria-labelledby="new-course-media-bank-title">
            <div class="sections-lesson-modal-card new-course-media-bank-card">
              <header class="sections-lesson-modal-header">
                <h2 id="new-course-media-bank-title">${st('modal.fields.videoUpload')}</h2>
                <button type="button" id="new-course-media-bank-close" class="sections-lesson-modal-close" aria-label="${t('courses.sections.modal.close')}">✕</button>
              </header>

              <div class="new-course-media-bank-tabs">
                <button type="button" id="new-course-media-bank-tab-upload" class="new-course-media-bank-tab ${mode === 'upload' ? 'is-active' : ''}">${t('courses.home.mediaBank.internalTabs.upload')}</button>
                <button type="button" id="new-course-media-bank-tab-library" class="new-course-media-bank-tab ${mode === 'library' ? 'is-active' : ''}">${t('courses.home.mediaBank.internalTabs.library')}</button>
              </div>

              <div class="sections-lesson-modal-body">
                ${
                  mode === 'upload'
                    ? `
                  <div class="new-course-media-bank-upload">
                    <label class="new-course-field">
                      <span>${st('modal.fields.videoUpload')}</span>
                      <input id="lesson-media-upload-file" type="file" accept="video/*">
                    </label>
                    <label class="new-course-field">
                      <span>${t('courses.home.mediaBank.library.fields.title')}</span>
                      <input id="lesson-media-upload-title" type="text" maxlength="50" placeholder="${t('courses.home.mediaBank.library.fields.titlePlaceholder')}">
                    </label>
                    <label class="new-course-field">
                      <span>${t('courses.home.mediaBank.library.fields.altText')}</span>
                      <input id="lesson-media-upload-alt" type="text" maxlength="125" placeholder="${t('courses.home.mediaBank.library.fields.altTextPlaceholder')}">
                    </label>
                    <label class="new-course-field">
                      <span>${t('courses.home.mediaBank.library.fields.description')}</span>
                      <textarea id="lesson-media-upload-description" maxlength="200" placeholder="${t('courses.home.mediaBank.library.fields.descriptionPlaceholder')}"></textarea>
                    </label>
                  </div>
                `
                    : `
                  <div class="new-course-media-bank-library">
                    <div class="new-course-media-bank-grid">
                      ${
                        mediaItems.length === 0
                          ? `<p class="new-course-media-empty">${t('courses.home.mediaBank.library.selectMediaHint')}</p>`
                          : mediaItems
                              .map(
                                (item) => `
                              <button type="button" class="new-course-media-item ${selectedMediaId === item.id ? 'is-selected' : ''}" data-media-id="${item.id}">
                                <video src="${item.previewUrl}" preload="metadata" muted playsinline></video>
                                <span>${escapeHtml(item.title)}</span>
                              </button>
                            `,
                              )
                              .join('')
                      }
                    </div>
                  </div>
                `
                }
              </div>

              <footer class="sections-lesson-modal-actions new-course-media-bank-actions">
                <button type="button" id="new-course-media-bank-cancel" class="new-course-cancel-btn">${st('modal.cancel')}</button>
                <button type="button" id="new-course-media-bank-confirm" class="new-course-primary-btn" ${mode === 'library' && !selectedMedia ? 'disabled' : ''}>
                  ${mode === 'upload' ? t('courses.home.mediaBank.upload.addMedia') : st('modal.fields.videoSelect')}
                </button>
              </footer>
            </div>
          </div>
        `

        modalWrapper.querySelectorAll<HTMLVideoElement>('.new-course-media-item video').forEach((videoElement) => {
          setVideoThumbnailFrame(videoElement, 5)
        })

        const overlay = modalWrapper.querySelector('#new-course-media-bank-overlay') as HTMLElement | null
        overlay?.addEventListener('click', (event) => {
          if (event.target === overlay) cleanup()
        })

        const closeButton = modalWrapper.querySelector('#new-course-media-bank-close') as HTMLButtonElement | null
        const cancelButton = modalWrapper.querySelector('#new-course-media-bank-cancel') as HTMLButtonElement | null
        closeButton?.addEventListener('click', cleanup)
        cancelButton?.addEventListener('click', cleanup)

        const uploadTab = modalWrapper.querySelector('#new-course-media-bank-tab-upload') as HTMLButtonElement | null
        const libraryTab = modalWrapper.querySelector('#new-course-media-bank-tab-library') as HTMLButtonElement | null
        uploadTab?.addEventListener('click', () => {
          mode = 'upload'
          renderMediaModal()
        })
        libraryTab?.addEventListener('click', async () => {
          mode = 'library'
          try {
            await loadLibrary()
          } catch (error) {
            toast(getMediaBankErrorMessage(error, 'list'), 'error')
          }
          renderMediaModal()
        })

        modalWrapper.querySelectorAll<HTMLButtonElement>('.new-course-media-item').forEach((itemButton) => {
          itemButton.addEventListener('click', () => {
            selectedMediaId = itemButton.dataset.mediaId ?? null
            renderMediaModal()
          })
        })

        const fileInput = modalWrapper.querySelector('#lesson-media-upload-file') as HTMLInputElement | null
        fileInput?.addEventListener('change', async () => {
          const pickedFile = fileInput.files?.[0] ?? null
          if (!pickedFile) {
            selectedFile = null
            return
          }

          const isValidDuration = await validateVideoDuration(pickedFile)
          if (!isValidDuration) {
            selectedFile = null
            toast(st('modal.videoTooLong'), 'error')
            return
          }

          selectedFile = pickedFile
        })

        const confirmButton = modalWrapper.querySelector('#new-course-media-bank-confirm') as HTMLButtonElement | null
        confirmButton?.addEventListener('click', async () => {
          if (mode === 'upload') {
            const titleInputEl = modalWrapper.querySelector('#lesson-media-upload-title') as HTMLInputElement | null
            const altInputEl = modalWrapper.querySelector('#lesson-media-upload-alt') as HTMLInputElement | null
            const descInputEl = modalWrapper.querySelector('#lesson-media-upload-description') as HTMLTextAreaElement | null

            const title = titleInputEl?.value.trim() ?? ''
            const altText = altInputEl?.value.trim() ?? ''
            const description = descInputEl?.value.trim() ?? ''

            if (!selectedFile || !title || !altText || !description) {
              toast(t('courses.home.mediaBank.upload.errors.requiredFields'), 'error')
              return
            }

            try {
              const uploadedBinary = await mediaApi.uploadVideo({ file: selectedFile })
              const uploadedId = uploadedBinary.id ?? uploadedBinary._id ?? uploadedBinary.gridFsId

              if (!uploadedId) throw new Error('Missing media id')

              await mediaApi.createMediaMetadata(uploadedId, 'video', {
                title,
                altText,
                description,
              })

              selectedLessonVideo = selectedFile
              lessonModalState.videoFileName = selectedFile.name
              lessonModalState.videoMediaId = uploadedId
              lessonModalState.videoError = false
              renderLessonModal()
              cleanup()
              toast(t('courses.home.mediaBank.upload.success'), 'success')
            } catch (error) {
              toast(getMediaBankErrorMessage(error, 'upload'), 'error')
            }

            return
          }

          const selected = mediaItems.find((item) => item.id === selectedMediaId)
          if (!selected) return

          selectedLessonVideo = new File([selected.blob], `${selected.title || 'video'}.mp4`, {
            type: selected.blob.type || 'video/mp4',
          })
          lessonModalState.videoFileName = selected.title || 'video'
          lessonModalState.videoMediaId = selected.id
          lessonModalState.videoError = false
          renderLessonModal()
          cleanup()
        })
      }

      document.body.appendChild(modalWrapper)
      document.addEventListener('keydown', handleEsc)

      void (async () => {
        try {
          await loadLibrary()
        } catch (error) {
          toast(getMediaBankErrorMessage(error, 'list'), 'error')
        }
        renderMediaModal()
      })()
    }

    modalPortal.innerHTML = `
      <div class="sections-lesson-modal-overlay" id="sections-lesson-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-lesson-modal-title">
        <div class="sections-lesson-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-lesson-modal-title">${lessonModalState.editingActivityId ? st('modal.editTitle', { index: lessonModalState.sectionIndex + 1 }) : st('modal.title', { index: lessonModalState.sectionIndex + 1 })}</h2>
            <button type="button" id="sections-lesson-modal-close" class="sections-lesson-modal-close" aria-label="${st('modal.close')}">✕</button>
          </header>

          <div class="sections-lesson-modal-body">
            <label class="new-course-field">
              <span>${st('modal.fields.name')} <em>*</em></span>
              <input type="text" id="lesson-name-input" maxlength="120" value="${escapeHtml(lessonModalState.name)}" placeholder="${st('modal.fields.namePlaceholder')}" class="${lessonModalState.nameError ? 'is-invalid' : ''}">
            </label>

            <div class="sections-lesson-modal-content-type ${lessonModalState.contentTypeError ? 'is-invalid' : ''}">
              <strong>${st('modal.fields.contentType')} <em>*</em></strong>
              <div class="sections-lesson-modal-radios">
                <label class="sections-lesson-modal-radio">
                  <input type="radio" name="lesson-content-type" value="video" ${lessonModalState.contentType === 'video' ? 'checked' : ''}>
                  <span>${st('modal.contentTypes.video')}</span>
                </label>
                <label class="sections-lesson-modal-radio">
                  <input type="radio" name="lesson-content-type" value="styledText" ${lessonModalState.contentType === 'styledText' ? 'checked' : ''}>
                  <span>${st('modal.contentTypes.styledText')}</span>
                </label>
              </div>
            </div>

            ${showVideoField ? `
              <div class="sections-lesson-modal-video ${lessonModalState.videoError ? 'is-invalid' : ''}">
                <strong>${st('modal.fields.videoUpload')} <em>*</em></strong>
                <div class="sections-lesson-modal-video-box">
                  <button type="button" id="lesson-video-bank-trigger" class="sections-lesson-modal-video-btn">${st('modal.fields.videoSelect')}</button>
                  ${lessonModalState.videoFileName ? `<div class="sections-lesson-modal-video-name">🎬 ${escapeHtml(lessonModalState.videoFileName)}</div>` : ''}
                </div>
                <small>${st('modal.fields.videoHint')}</small>
              </div>
            ` : ''}

            ${showVideoField ? `
              <div class="sections-lesson-modal-question-toggle-wrap">
                <label class="sections-modal-switch" for="lesson-video-has-question">
                  <input type="checkbox" id="lesson-video-has-question" ${lessonModalState.hasVideoQuestion ? 'checked' : ''}>
                  <span class="sections-modal-switch-track"></span>
                  <span class="sections-modal-switch-label">${st('modal.fields.finalQuestion')}</span>
                </label>
              </div>
            ` : ''}

            ${showVideoQuestionField ? `
              <div class="sections-lesson-modal-question ${lessonModalState.videoQuestionError ? 'is-invalid' : ''}">
                <label class="new-course-field">
                  <span>${st('modal.fields.videoQuestion')} <em>*</em></span>
                  <textarea id="lesson-video-question" maxlength="70" placeholder="${st('modal.fields.videoQuestionPlaceholder')}" class="${lessonModalState.videoQuestionError ? 'is-invalid' : ''}">${escapeHtml(lessonModalState.videoQuestion)}</textarea>
                  <small>${videoQuestionCounter}</small>
                </label>

                <div class="sections-lesson-modal-alternatives ${lessonModalState.videoAlternativesError ? 'is-invalid' : ''}">
                  <strong>${st('modal.fields.alternatives')} <em>*</em></strong>
                  <div class="sections-lesson-modal-alternatives-list">
                    ${lessonModalState.videoAlternatives
                      .map((alternative, index) => {
                        const letter = String.fromCharCode(65 + index)
                        const isCorrect = lessonModalState.correctVideoAlternativeIndex === index
                        return `
                          <div class="sections-lesson-modal-alternative-block">
                            <label class="sections-lesson-modal-alternative-card">
                              <span class="sections-lesson-modal-alternative-letter">${letter}</span>
                              <input type="text" maxlength="50" data-alternative-index="${index}" placeholder="${st('modal.fields.alternativePlaceholder', { letter })}" value="${escapeHtml(alternative)}">
                            </label>
                            <label class="sections-lesson-modal-correct-toggle">
                              <input type="checkbox" data-correct-alternative-index="${index}" ${isCorrect ? 'checked' : ''}>
                              <span>${st('modal.fields.correctAlternative')}</span>
                            </label>
                          </div>
                        `
                      })
                      .join('')}
                  </div>
                  <div class="sections-lesson-modal-alternatives-actions">
                    <button type="button" id="lesson-add-alternative" class="sections-lesson-modal-alt-btn" ${canAddAlternative ? '' : 'disabled'}>${st('modal.fields.addAlternative')}</button>
                    <button type="button" id="lesson-remove-alternative" class="sections-lesson-modal-alt-btn is-danger" ${canRemoveAlternative ? '' : 'disabled'}>${st('modal.fields.removeAlternative')}</button>
                  </div>
                  <small>${st('modal.fields.alternativesHint')}</small>
                </div>

                ${lessonModalState.videoCorrectAlternativeError ? `<div class="sections-lesson-modal-correct-error">${st('modal.fields.correctAlternativeRequired')}</div>` : ''}
              </div>
            ` : ''}

            ${showStyledTextFields ? `
              <div class="sections-lesson-modal-texts">
                <label class="new-course-field">
                  <span>${st('modal.fields.firstText')} <em>*</em></span>
                  <textarea id="lesson-first-text" maxlength="270" placeholder="${st('modal.fields.firstTextPlaceholder')}" class="${lessonModalState.firstTextError ? 'is-invalid' : ''}">${escapeHtml(lessonModalState.firstText)}</textarea>
                  <small>${firstTextCounter}</small>
                </label>
              </div>
            ` : ''}
          </div>

          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-lesson-modal-cancel" class="new-course-cancel-btn">${st('modal.cancel')}</button>
            <button type="button" id="sections-lesson-modal-submit" class="new-course-primary-btn">${lessonModalState.editingActivityId ? st('modal.editSubmit') : st('modal.submit')}</button>
          </footer>
        </div>
      </div>
    `

    const overlay = document.getElementById('sections-lesson-modal-overlay')
    const closeButton = document.getElementById('sections-lesson-modal-close') as HTMLButtonElement | null
    const cancelButton = document.getElementById('sections-lesson-modal-cancel') as HTMLButtonElement | null
    const submitButton = document.getElementById('sections-lesson-modal-submit') as HTMLButtonElement | null
    const lessonNameInput = document.getElementById('lesson-name-input') as HTMLInputElement | null
    const lessonVideoBankTrigger = document.getElementById('lesson-video-bank-trigger') as HTMLButtonElement | null
    const lessonHasQuestionInput = document.getElementById('lesson-video-has-question') as HTMLInputElement | null
    const lessonVideoQuestionInput = document.getElementById('lesson-video-question') as HTMLTextAreaElement | null
    const lessonAddAlternativeButton = document.getElementById('lesson-add-alternative') as HTMLButtonElement | null
    const lessonRemoveAlternativeButton = document.getElementById('lesson-remove-alternative') as HTMLButtonElement | null
    const firstTextInput = document.getElementById('lesson-first-text') as HTMLTextAreaElement | null
    const modalCard = document.querySelector('.sections-lesson-modal-card') as HTMLElement | null

    if (modalCard) {
      modalCard.scrollTop = previousModalScrollTop
    }

    overlay?.addEventListener('click', (event) => {
      if (event.target === overlay) closeLessonModal()
    })

    closeButton?.addEventListener('click', closeLessonModal)
    cancelButton?.addEventListener('click', closeLessonModal)

    lessonNameInput?.addEventListener('input', () => {
      lessonModalState.name = lessonNameInput.value
      if (lessonModalState.nameError && lessonModalState.name.trim().length > 0) {
        lessonModalState.nameError = false
        renderLessonModal()
      }
    })

    document.querySelectorAll<HTMLInputElement>('input[name="lesson-content-type"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        lessonModalState.contentType = radio.value as LessonContentType
        lessonModalState.contentTypeError = false
        lessonModalState.firstTextError = false
        lessonModalState.videoError = false
        lessonModalState.videoQuestionError = false
        lessonModalState.videoCorrectAlternativeError = false

        if (lessonModalState.contentType !== 'video') {
          lessonModalState.videoFileName = ''
          selectedLessonVideo = null
          lessonModalState.hasVideoQuestion = true
          lessonModalState.videoQuestion = ''
          lessonModalState.videoAlternatives = ['', '']
          lessonModalState.correctVideoAlternativeIndex = 0
        }

        renderLessonModal()
      })
    })

    lessonHasQuestionInput?.addEventListener('change', () => {
      lessonModalState.hasVideoQuestion = lessonHasQuestionInput.checked
      lessonModalState.videoQuestionError = false
      lessonModalState.videoAlternativesError = false
      lessonModalState.videoCorrectAlternativeError = false
      renderLessonModal()
    })

    lessonVideoQuestionInput?.addEventListener('input', () => {
      lessonModalState.videoQuestion = lessonVideoQuestionInput.value
      if (lessonModalState.videoQuestionError && lessonModalState.videoQuestion.trim().length > 0) {
        lessonModalState.videoQuestionError = false
        renderLessonModal()
      }
    })

    document.querySelectorAll<HTMLInputElement>('[data-alternative-index]').forEach((input) => {
      const index = Number(input.dataset.alternativeIndex)
      input.addEventListener('input', () => {
        lessonModalState.videoAlternatives[index] = input.value
        if (lessonModalState.videoAlternativesError) {
          const allFilled = lessonModalState.videoAlternatives.every((alternative) => alternative.trim().length > 0)
          if (allFilled) {
            lessonModalState.videoAlternativesError = false
            renderLessonModal()
          }
        }
      })
    })

    document.querySelectorAll<HTMLInputElement>('[data-correct-alternative-index]').forEach((checkbox) => {
      const index = Number(checkbox.dataset.correctAlternativeIndex)
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          lessonModalState.correctVideoAlternativeIndex = index
        } else if (lessonModalState.correctVideoAlternativeIndex === index) {
          lessonModalState.correctVideoAlternativeIndex = null
        }

        lessonModalState.videoCorrectAlternativeError = false
        renderLessonModal()
      })
    })

    lessonAddAlternativeButton?.addEventListener('click', () => {
      if (lessonModalState.videoAlternatives.length >= 4) return
      lessonModalState.videoAlternatives.push('')
      renderLessonModal()
    })

    lessonRemoveAlternativeButton?.addEventListener('click', () => {
      if (lessonModalState.videoAlternatives.length <= 2) return
      lessonModalState.videoAlternatives.pop()

      if (
        lessonModalState.correctVideoAlternativeIndex !== null
        && lessonModalState.correctVideoAlternativeIndex >= lessonModalState.videoAlternatives.length
      ) {
        lessonModalState.correctVideoAlternativeIndex = lessonModalState.videoAlternatives.length - 1
      }

      renderLessonModal()
    })

    lessonVideoBankTrigger?.addEventListener('click', () => {
      openLessonVideoMediaModal()
    })

    firstTextInput?.addEventListener('input', () => {
      lessonModalState.firstText = firstTextInput.value
      if (lessonModalState.firstTextError && lessonModalState.firstText.trim().length > 0) {
        lessonModalState.firstTextError = false
        renderLessonModal()
      }
    })

    submitButton?.addEventListener('click', async () => {
      const isNameValid = lessonModalState.name.trim().length > 0
      const isContentTypeValid = lessonModalState.contentType.length > 0
      const isEditingVideo = lessonModalState.editingActivityId !== null && lessonModalState.contentType === 'video'
      const isVideoValid = lessonModalState.contentType !== 'video' || Boolean(selectedLessonVideo) || Boolean(lessonModalState.videoMediaId) || isEditingVideo
      const requiresVideoQuestion = lessonModalState.contentType === 'video' && lessonModalState.hasVideoQuestion
      const isVideoQuestionValid = !requiresVideoQuestion || lessonModalState.videoQuestion.trim().length > 0
      const areVideoAlternativesValid = !requiresVideoQuestion
        || lessonModalState.videoAlternatives.every((alternative) => alternative.trim().length > 0)
      const isCorrectVideoAlternativeValid = !requiresVideoQuestion
        || (
          lessonModalState.correctVideoAlternativeIndex !== null
          && lessonModalState.correctVideoAlternativeIndex >= 0
          && lessonModalState.correctVideoAlternativeIndex < lessonModalState.videoAlternatives.length
        )
      const requiresTextBlocks = lessonModalState.contentType === 'styledText'
      const isFirstTextValid = !requiresTextBlocks || lessonModalState.firstText.trim().length > 0

      lessonModalState.nameError = !isNameValid
      lessonModalState.contentTypeError = !isContentTypeValid
      lessonModalState.videoError = !isVideoValid
      lessonModalState.videoQuestionError = !isVideoQuestionValid
      lessonModalState.videoAlternativesError = !areVideoAlternativesValid
      lessonModalState.videoCorrectAlternativeError = !isCorrectVideoAlternativeValid
      lessonModalState.firstTextError = !isFirstTextValid

      if (!isNameValid || !isContentTypeValid || !isVideoValid || !isVideoQuestionValid || !areVideoAlternativesValid || !isCorrectVideoAlternativeValid || !isFirstTextValid) {
        renderLessonModal()
        return
      }

      const section = sections.find((item) => item.id === lessonModalState.sectionId)
      if (!section) {
        closeLessonModal()
        return
      }

      const currentTotal = section.lessons + section.exercises
      if (!lessonModalState.editingActivityId && currentTotal >= 10) {
        toast(st('maxItemsError'), 'error')
        closeLessonModal()
        return
      }

      try {
        const activityType: ActivityType = lessonModalState.contentType === 'video' ? 'video_pause' : 'text_reading'
        const nextOrder = lessonModalState.editingActivityId
          ? (section.activities.find((item) => item.id === lessonModalState.editingActivityId)?.order ?? section.activities.length)
          : section.activities.length
        const isStyledText = lessonModalState.contentType === 'styledText'
        const options = lessonModalState.contentType === 'video' && lessonModalState.hasVideoQuestion
          ? lessonModalState.videoAlternatives.map((alternative) => alternative.trim())
          : []
        const correctAnswer = lessonModalState.contentType === 'video' && lessonModalState.hasVideoQuestion
          ? (lessonModalState.correctVideoAlternativeIndex ?? 0)
          : 0

        if (lessonModalState.editingActivityId) {
          const updated = await activitiesApi.updateActivity(lessonModalState.editingActivityId, {
            title: lessonModalState.name.trim(),
            type: activityType,
            order: nextOrder,
            question: lessonModalState.contentType === 'video' && lessonModalState.hasVideoQuestion
              ? lessonModalState.videoQuestion.trim()
              : '',
            textPages: isStyledText ? [lessonModalState.firstText.trim()] : [],
            options,
            correctAnswer,
          })

          const target = section.activities.find((item) => item.id === updated.id)
          if (target) {
            target.title = updated.title ?? lessonModalState.name.trim()
            target.type = updated.type
            target.order = updated.order
          }
        } else {
          const created = await activitiesApi.createActivity({
            id: crypto.randomUUID(),
            sectionId: section.id,
            title: lessonModalState.name.trim(),
            type: activityType,
            order: nextOrder,
            question: lessonModalState.contentType === 'video' && lessonModalState.hasVideoQuestion
              ? lessonModalState.videoQuestion.trim()
              : '',
            textPages: isStyledText ? [lessonModalState.firstText.trim()] : [],
            options,
            correctAnswer,
          })

          section.activities.push({
            id: created.id,
            sectionId: created.sectionId,
            title: created.title ?? lessonModalState.name.trim(),
            type: created.type,
            order: created.order,
          })
        }

        // Update section's videoMediaId if a video was selected
        if (lessonModalState.videoMediaId && lessonModalState.contentType === 'video') {
          await sectionsApi.updateSection(section.id, {
            videoMediaId: lessonModalState.videoMediaId,
          })
          section.videoMediaId = lessonModalState.videoMediaId
        }

        section.activities.sort((a, b) => a.order - b.order)
        const counts = countSectionActivities(section.activities)
        section.lessons = counts.lessons
        section.exercises = counts.exercises

        persistSectionsLocalSnapshot()
        renderSections()
        updateWorkload()
        toast(lessonModalState.editingActivityId ? st('modal.updateSuccess') : st('modal.success'), 'success')
        closeLessonModal()
      } catch {
        toast(t('courses.home.feedback.actionError'), 'error')
      }
    })
  }

  const renderExerciseModal = () => {
    const modalPortal = getOrCreateModalPortal()
    const previousModalScrollTop = (document.querySelector('.sections-lesson-modal-card') as HTMLElement | null)?.scrollTop ?? 0

    if (!exerciseModalState.isOpen || !exerciseModalState.sectionId) {
      clearLessonModalPortal()
      return
    }

    document.body.classList.add('sections-modal-open')
    document.removeEventListener('keydown', handleLessonModalKeydown)
    document.addEventListener('keydown', handleLessonModalKeydown)

    const et = (path: string, params?: Record<string, string | number>) => t(`courses.sections.exerciseModal.${path}`, params)
    const language = getLanguage()
    const trueOptionRaw = et('fields.trueOption')
    const falseOptionRaw = et('fields.falseOption')
    const trueOptionLabel = trueOptionRaw.startsWith('courses.sections.exerciseModal.')
      ? (language === 'en-US' ? 'True' : 'Verdadeiro')
      : trueOptionRaw
    const falseOptionLabel = falseOptionRaw.startsWith('courses.sections.exerciseModal.')
      ? (language === 'en-US' ? 'False' : 'Falso')
      : falseOptionRaw
    const isMultipleChoice = exerciseModalState.contentType === 'multipleChoice'
    const isTrueFalse = exerciseModalState.contentType === 'trueFalse'
    const hasQuestionBlock = isMultipleChoice || isTrueFalse
    const showExerciseImageField = hasQuestionBlock && exerciseModalState.includeImage
    const questionCounter = `${exerciseModalState.question.length}/70 ${st('modal.characters')}`
    const canAddAlternative = exerciseModalState.alternatives.length < 4
    const canRemoveAlternative = exerciseModalState.alternatives.length > 2

    const openExerciseImageMediaModal = () => {
      type ExerciseImageMediaItem = {
        id: string
        title: string
        altText: string
        description: string
        blob: Blob
        previewUrl: string
      }

      let mode: 'upload' | 'library' = 'library'
      let selectedMediaId: string | null = null
      let selectedFile: File | null = null
      let mediaItems: ExerciseImageMediaItem[] = []

      const previewUrls = new Set<string>()
      const modalWrapper = document.createElement('div')
      modalWrapper.id = 'new-course-media-bank-modal'

      const cleanup = () => {
        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        previewUrls.clear()
        modalWrapper.remove()
        document.removeEventListener('keydown', handleEsc)
      }

      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') cleanup()
      }

      const loadLibrary = async () => {
        const currentUser = getCurrentUser()
        const response =
          currentUser?.role === 'ADMIN' || role === 'ADMIN'
            ? await mediaApi.listAdminMedia({ page: 1, limit: 80, kind: 'image' })
            : await mediaApi.listMyMedia({ page: 1, limit: 80, kind: 'image' })

        previewUrls.forEach((url) => URL.revokeObjectURL(url))
        previewUrls.clear()

        const loadedItems = await Promise.all(
          response.items.map(async (item: MediaResponse) => {
            const id = item.id ?? item._id ?? item.gridFsId
            const blob = await mediaApi.streamMedia(id)
            const previewUrl = URL.createObjectURL(blob)
            previewUrls.add(previewUrl)

            return {
              id,
              title: item.title || item.filename,
              altText: item.altText || '',
              description: item.description || '',
              blob,
              previewUrl,
            }
          }),
        )

        mediaItems = loadedItems
      }

      const renderMediaModal = () => {
        const selectedMedia = mediaItems.find((item) => item.id === selectedMediaId) ?? null

        modalWrapper.innerHTML = `
          <div class="sections-lesson-modal-overlay" id="new-course-media-bank-overlay" role="dialog" aria-modal="true" aria-labelledby="new-course-media-bank-title">
            <div class="sections-lesson-modal-card new-course-media-bank-card">
              <header class="sections-lesson-modal-header">
                <h2 id="new-course-media-bank-title">${et('fields.imageUpload')}</h2>
                <button type="button" id="new-course-media-bank-close" class="sections-lesson-modal-close" aria-label="${t('courses.sections.modal.close')}">✕</button>
              </header>

              <div class="new-course-media-bank-tabs">
                <button type="button" id="new-course-media-bank-tab-upload" class="new-course-media-bank-tab ${mode === 'upload' ? 'is-active' : ''}">${t('courses.home.mediaBank.internalTabs.upload')}</button>
                <button type="button" id="new-course-media-bank-tab-library" class="new-course-media-bank-tab ${mode === 'library' ? 'is-active' : ''}">${t('courses.home.mediaBank.internalTabs.library')}</button>
              </div>

              <div class="sections-lesson-modal-body">
                ${
                  mode === 'upload'
                    ? `
                  <div class="new-course-media-bank-upload">
                    <label class="new-course-field">
                      <span>${et('fields.imageUpload')}</span>
                      <input id="exercise-media-upload-file" type="file" accept="image/jpeg,image/png,image/webp">
                    </label>
                    <label class="new-course-field">
                      <span>${t('courses.home.mediaBank.library.fields.title')}</span>
                      <input id="exercise-media-upload-title" type="text" maxlength="50" placeholder="${t('courses.home.mediaBank.library.fields.titlePlaceholder')}">
                    </label>
                    <label class="new-course-field">
                      <span>${t('courses.home.mediaBank.library.fields.altText')}</span>
                      <input id="exercise-media-upload-alt" type="text" maxlength="125" placeholder="${t('courses.home.mediaBank.library.fields.altTextPlaceholder')}">
                    </label>
                    <label class="new-course-field">
                      <span>${t('courses.home.mediaBank.library.fields.description')}</span>
                      <textarea id="exercise-media-upload-description" maxlength="200" placeholder="${t('courses.home.mediaBank.library.fields.descriptionPlaceholder')}"></textarea>
                    </label>
                  </div>
                `
                    : `
                  <div class="new-course-media-bank-library">
                    <div class="new-course-media-bank-grid">
                      ${
                        mediaItems.length === 0
                          ? `<p class="new-course-media-empty">${t('courses.home.mediaBank.library.selectMediaHint')}</p>`
                          : mediaItems
                              .map(
                                (item) => `
                              <button type="button" class="new-course-media-item ${selectedMediaId === item.id ? 'is-selected' : ''}" data-media-id="${item.id}">
                                <img src="${item.previewUrl}" alt="${escapeHtml(item.altText || item.title)}">
                                <span>${escapeHtml(item.title)}</span>
                              </button>
                            `,
                              )
                              .join('')
                      }
                    </div>
                  </div>
                `
                }
              </div>

              <footer class="sections-lesson-modal-actions new-course-media-bank-actions">
                <button type="button" id="new-course-media-bank-cancel" class="new-course-cancel-btn">${et('cancel')}</button>
                <button type="button" id="new-course-media-bank-confirm" class="new-course-primary-btn" ${mode === 'library' && !selectedMedia ? 'disabled' : ''}>
                  ${mode === 'upload' ? t('courses.home.mediaBank.upload.addMedia') : et('fields.imageSelect')}
                </button>
              </footer>
            </div>
          </div>
        `

        const overlay = modalWrapper.querySelector('#new-course-media-bank-overlay') as HTMLElement | null
        overlay?.addEventListener('click', (event) => {
          if (event.target === overlay) cleanup()
        })

        const closeButton = modalWrapper.querySelector('#new-course-media-bank-close') as HTMLButtonElement | null
        const cancelButton = modalWrapper.querySelector('#new-course-media-bank-cancel') as HTMLButtonElement | null
        closeButton?.addEventListener('click', cleanup)
        cancelButton?.addEventListener('click', cleanup)

        const uploadTab = modalWrapper.querySelector('#new-course-media-bank-tab-upload') as HTMLButtonElement | null
        const libraryTab = modalWrapper.querySelector('#new-course-media-bank-tab-library') as HTMLButtonElement | null
        uploadTab?.addEventListener('click', () => {
          mode = 'upload'
          renderMediaModal()
        })
        libraryTab?.addEventListener('click', async () => {
          mode = 'library'
          try {
            await loadLibrary()
          } catch (error) {
            toast(getMediaBankErrorMessage(error, 'list'), 'error')
          }
          renderMediaModal()
        })

        modalWrapper.querySelectorAll<HTMLButtonElement>('.new-course-media-item').forEach((itemButton) => {
          itemButton.addEventListener('click', () => {
            selectedMediaId = itemButton.dataset.mediaId ?? null
            renderMediaModal()
          })
        })

        const fileInput = modalWrapper.querySelector('#exercise-media-upload-file') as HTMLInputElement | null
        fileInput?.addEventListener('change', () => {
          selectedFile = fileInput.files?.[0] ?? null
        })

        const confirmButton = modalWrapper.querySelector('#new-course-media-bank-confirm') as HTMLButtonElement | null
        confirmButton?.addEventListener('click', async () => {
          if (mode === 'upload') {
            const titleInputEl = modalWrapper.querySelector('#exercise-media-upload-title') as HTMLInputElement | null
            const altInputEl = modalWrapper.querySelector('#exercise-media-upload-alt') as HTMLInputElement | null
            const descInputEl = modalWrapper.querySelector('#exercise-media-upload-description') as HTMLTextAreaElement | null

            const title = titleInputEl?.value.trim() ?? ''
            const altText = altInputEl?.value.trim() ?? ''
            const description = descInputEl?.value.trim() ?? ''

            if (!selectedFile || !title || !altText || !description) {
              toast(t('courses.home.mediaBank.upload.errors.requiredFields'), 'error')
              return
            }

            try {
              const uploadedBinary = await mediaApi.uploadImage({ file: selectedFile })
              const uploadedId = uploadedBinary.id ?? uploadedBinary._id ?? uploadedBinary.gridFsId

              if (!uploadedId) throw new Error('Missing media id')

              await mediaApi.createMediaMetadata(uploadedId, 'image', {
                title,
                altText,
                description,
              })

              selectedExerciseImageMediaId = uploadedId
              exerciseModalState.imageFileName = selectedFile.name
              exerciseModalState.imageError = false
              renderExerciseModal()
              cleanup()
              toast(t('courses.home.mediaBank.upload.success'), 'success')
            } catch (error) {
              toast(getMediaBankErrorMessage(error, 'upload'), 'error')
            }

            return
          }

          const selected = mediaItems.find((item) => item.id === selectedMediaId)
          if (!selected) return

          selectedExerciseImageMediaId = selected.id
          exerciseModalState.imageFileName = selected.title || 'image'
          exerciseModalState.imageError = false
          renderExerciseModal()
          cleanup()
        })
      }

      document.body.appendChild(modalWrapper)
      document.addEventListener('keydown', handleEsc)

      void (async () => {
        try {
          await loadLibrary()
        } catch (error) {
          toast(getMediaBankErrorMessage(error, 'list'), 'error')
        }
        renderMediaModal()
      })()
    }

    modalPortal.innerHTML = `
      <div class="sections-lesson-modal-overlay" id="sections-exercise-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sections-exercise-modal-title">
        <div class="sections-lesson-modal-card sections-exercise-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="sections-exercise-modal-title">${exerciseModalState.editingActivityId ? et('editTitle', { index: exerciseModalState.sectionIndex + 1 }) : et('title', { index: exerciseModalState.sectionIndex + 1 })}</h2>
            <button type="button" id="sections-exercise-modal-close" class="sections-lesson-modal-close" aria-label="${et('close')}">✕</button>
          </header>

          <div class="sections-lesson-modal-body">
            <label class="new-course-field">
              <span>${et('fields.title')} <em>*</em></span>
              <input type="text" id="exercise-title-input" maxlength="120" value="${escapeHtml(exerciseModalState.title)}" placeholder="${et('fields.titlePlaceholder')}" class="${exerciseModalState.titleError ? 'is-invalid' : ''}">
            </label>

            <div class="sections-exercise-types ${exerciseModalState.contentTypeError ? 'is-invalid' : ''}">
              <strong>${et('fields.contentType')} <em>*</em></strong>
              <div class="sections-exercise-types-list">
                <label class="sections-lesson-modal-radio">
                  <input type="radio" name="exercise-content-type" value="multipleChoice" ${exerciseModalState.contentType === 'multipleChoice' ? 'checked' : ''}>
                  <span>${et('contentTypes.multipleChoice')}</span>
                </label>
                <label class="sections-lesson-modal-radio">
                  <input type="radio" name="exercise-content-type" value="trueFalse" ${exerciseModalState.contentType === 'trueFalse' ? 'checked' : ''}>
                  <span>${et('contentTypes.trueFalse')}</span>
                </label>
              </div>
            </div>

            ${hasQuestionBlock ? `
              <div class="sections-lesson-modal-question ${exerciseModalState.questionError ? 'is-invalid' : ''}">
                <label class="new-course-field">
                  <span>${et('fields.question')} <em>*</em></span>
                  <textarea id="exercise-question-input" maxlength="70" placeholder="${et('fields.questionPlaceholder')}" class="${exerciseModalState.questionError ? 'is-invalid' : ''}">${escapeHtml(exerciseModalState.question)}</textarea>
                  <small>${questionCounter}</small>
                </label>

                <div class="sections-lesson-modal-alternatives ${exerciseModalState.alternativesError ? 'is-invalid' : ''}">
                  <strong>${et('fields.alternatives')} <em>*</em></strong>
                  <div class="sections-lesson-modal-alternatives-list">
                    ${isMultipleChoice
                      ? exerciseModalState.alternatives
                        .map((alternative, index) => {
                          const letter = String.fromCharCode(65 + index)
                          const isCorrect = exerciseModalState.correctAlternativeIndex === index
                          return `
                            <div class="sections-lesson-modal-alternative-block">
                              <label class="sections-lesson-modal-alternative-card">
                                <span class="sections-lesson-modal-alternative-letter">${letter}</span>
                                <input type="text" maxlength="50" data-exercise-alternative-index="${index}" placeholder="${et('fields.alternativePlaceholder', { letter })}" value="${escapeHtml(alternative)}">
                              </label>
                              <label class="sections-lesson-modal-correct-toggle">
                                <input type="checkbox" data-exercise-correct-alternative-index="${index}" ${isCorrect ? 'checked' : ''}>
                                <span>${et('fields.correctAlternative')}</span>
                              </label>
                            </div>
                          `
                        })
                        .join('')
                      : `
                        <div class="sections-lesson-modal-alternative-block">
                          <div class="sections-lesson-modal-alternative-card">
                            <span class="sections-lesson-modal-alternative-letter">V</span>
                            <span class="sections-lesson-modal-alternative-static">${trueOptionLabel}</span>
                          </div>
                          <label class="sections-lesson-modal-correct-toggle">
                            <input type="checkbox" data-exercise-correct-alternative-index="0" ${exerciseModalState.correctAlternativeIndex === 0 ? 'checked' : ''}>
                            <span>${et('fields.correctAlternative')}</span>
                          </label>
                        </div>
                        <div class="sections-lesson-modal-alternative-block">
                          <div class="sections-lesson-modal-alternative-card">
                            <span class="sections-lesson-modal-alternative-letter">F</span>
                            <span class="sections-lesson-modal-alternative-static">${falseOptionLabel}</span>
                          </div>
                          <label class="sections-lesson-modal-correct-toggle">
                            <input type="checkbox" data-exercise-correct-alternative-index="1" ${exerciseModalState.correctAlternativeIndex === 1 ? 'checked' : ''}>
                            <span>${et('fields.correctAlternative')}</span>
                          </label>
                        </div>
                      `}
                  </div>
                  ${isMultipleChoice ? `
                    <div class="sections-lesson-modal-alternatives-actions">
                      <button type="button" id="exercise-add-alternative" class="sections-lesson-modal-alt-btn" ${canAddAlternative ? '' : 'disabled'}>${et('fields.addAlternative')}</button>
                      <button type="button" id="exercise-remove-alternative" class="sections-lesson-modal-alt-btn is-danger" ${canRemoveAlternative ? '' : 'disabled'}>${et('fields.removeAlternative')}</button>
                    </div>
                  ` : ''}
                  <small>${isMultipleChoice ? et('fields.alternativesHint') : et('fields.trueFalseHint')}</small>
                </div>

                ${exerciseModalState.correctAlternativeError ? `<div class="sections-lesson-modal-correct-error">${et('fields.correctAlternativeRequired')}</div>` : ''}

                <div class="sections-lesson-modal-question-toggle-wrap">
                  <label class="sections-modal-switch" for="exercise-include-image-toggle">
                    <input type="checkbox" id="exercise-include-image-toggle" ${exerciseModalState.includeImage ? 'checked' : ''}>
                    <span class="sections-modal-switch-track"></span>
                    <span class="sections-modal-switch-label">${et('fields.includeImage')}</span>
                  </label>
                </div>

                ${showExerciseImageField ? `
                  <div class="sections-lesson-modal-video ${exerciseModalState.imageError ? 'is-invalid' : ''}">
                    <strong>${et('fields.imageUpload')} <em>*</em></strong>
                    <div class="sections-lesson-modal-video-box">
                      <button type="button" id="exercise-image-bank-trigger" class="sections-lesson-modal-video-btn">${et('fields.imageSelect')}</button>
                      ${exerciseModalState.imageFileName ? `<div class="sections-lesson-modal-video-name">🖼️ ${escapeHtml(exerciseModalState.imageFileName)}</div>` : ''}
                    </div>
                    <small>${et('fields.imageHint')}</small>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>

          <footer class="sections-lesson-modal-actions">
            <button type="button" id="sections-exercise-modal-cancel" class="new-course-cancel-btn">${et('cancel')}</button>
            <button type="button" id="sections-exercise-modal-submit" class="new-course-primary-btn">${exerciseModalState.editingActivityId ? et('editSubmit') : et('submit')}</button>
          </footer>
        </div>
      </div>
    `

    const overlay = document.getElementById('sections-exercise-modal-overlay')
    const closeButton = document.getElementById('sections-exercise-modal-close') as HTMLButtonElement | null
    const cancelButton = document.getElementById('sections-exercise-modal-cancel') as HTMLButtonElement | null
    const submitButton = document.getElementById('sections-exercise-modal-submit') as HTMLButtonElement | null
    const exerciseTitleInput = document.getElementById('exercise-title-input') as HTMLInputElement | null
    const exerciseQuestionInput = document.getElementById('exercise-question-input') as HTMLTextAreaElement | null
    const exerciseAddAlternativeButton = document.getElementById('exercise-add-alternative') as HTMLButtonElement | null
    const exerciseRemoveAlternativeButton = document.getElementById('exercise-remove-alternative') as HTMLButtonElement | null
    const exerciseIncludeImageToggle = document.getElementById('exercise-include-image-toggle') as HTMLInputElement | null
    const exerciseImageBankTrigger = document.getElementById('exercise-image-bank-trigger') as HTMLButtonElement | null
    const modalCard = document.querySelector('.sections-lesson-modal-card') as HTMLElement | null

    if (modalCard) {
      modalCard.scrollTop = previousModalScrollTop
    }

    overlay?.addEventListener('click', (event) => {
      if (event.target === overlay) closeExerciseModal()
    })

    closeButton?.addEventListener('click', closeExerciseModal)
    cancelButton?.addEventListener('click', closeExerciseModal)

    exerciseTitleInput?.addEventListener('input', () => {
      exerciseModalState.title = exerciseTitleInput.value
      if (exerciseModalState.titleError && exerciseModalState.title.trim().length > 0) {
        exerciseModalState.titleError = false
        renderExerciseModal()
      }
    })

    exerciseQuestionInput?.addEventListener('input', () => {
      exerciseModalState.question = exerciseQuestionInput.value
      if (exerciseModalState.questionError && exerciseModalState.question.trim().length > 0) {
        exerciseModalState.questionError = false
        renderExerciseModal()
      }
    })

    document.querySelectorAll<HTMLInputElement>('input[name="exercise-content-type"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        exerciseModalState.contentType = radio.value as ExerciseContentType
        exerciseModalState.contentTypeError = false
        exerciseModalState.questionError = false
        exerciseModalState.alternativesError = false
        exerciseModalState.correctAlternativeError = false
        exerciseModalState.imageError = false

        if (exerciseModalState.contentType === 'multipleChoice') {
          exerciseModalState.alternatives = ['', '']
          exerciseModalState.correctAlternativeIndex = 0
        }

        if (exerciseModalState.contentType === 'trueFalse') {
          exerciseModalState.alternatives = [trueOptionLabel, falseOptionLabel]
          exerciseModalState.correctAlternativeIndex = 0
        }

        if (exerciseModalState.contentType !== 'multipleChoice' && exerciseModalState.contentType !== 'trueFalse') {
          exerciseModalState.question = ''
          exerciseModalState.alternatives = ['', '']
          exerciseModalState.correctAlternativeIndex = 0
          exerciseModalState.includeImage = false
          exerciseModalState.imageFileName = ''
          selectedExerciseImageMediaId = null
        }

        renderExerciseModal()
      })
    })

    exerciseIncludeImageToggle?.addEventListener('change', () => {
      exerciseModalState.includeImage = exerciseIncludeImageToggle.checked
      exerciseModalState.imageError = false

      if (!exerciseModalState.includeImage) {
        exerciseModalState.imageFileName = ''
        selectedExerciseImageMediaId = null
      }

      renderExerciseModal()
    })

    exerciseImageBankTrigger?.addEventListener('click', () => {
      openExerciseImageMediaModal()
    })

    document.querySelectorAll<HTMLInputElement>('[data-exercise-alternative-index]').forEach((input) => {
      const index = Number(input.dataset.exerciseAlternativeIndex)
      input.addEventListener('input', () => {
        exerciseModalState.alternatives[index] = input.value
        if (exerciseModalState.alternativesError) {
          const allFilled = exerciseModalState.alternatives.every((alternative) => alternative.trim().length > 0)
          if (allFilled) {
            exerciseModalState.alternativesError = false
            renderExerciseModal()
          }
        }
      })
    })

    document.querySelectorAll<HTMLInputElement>('[data-exercise-correct-alternative-index]').forEach((checkbox) => {
      const index = Number(checkbox.dataset.exerciseCorrectAlternativeIndex)
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          exerciseModalState.correctAlternativeIndex = index
        } else if (exerciseModalState.correctAlternativeIndex === index) {
          exerciseModalState.correctAlternativeIndex = null
        }

        exerciseModalState.correctAlternativeError = false
        renderExerciseModal()
      })
    })

    exerciseAddAlternativeButton?.addEventListener('click', () => {
      if (!isMultipleChoice) return
      if (exerciseModalState.alternatives.length >= 4) return
      exerciseModalState.alternatives.push('')
      renderExerciseModal()
    })

    exerciseRemoveAlternativeButton?.addEventListener('click', () => {
      if (!isMultipleChoice) return
      if (exerciseModalState.alternatives.length <= 2) return
      exerciseModalState.alternatives.pop()

      if (
        exerciseModalState.correctAlternativeIndex !== null
        && exerciseModalState.correctAlternativeIndex >= exerciseModalState.alternatives.length
      ) {
        exerciseModalState.correctAlternativeIndex = exerciseModalState.alternatives.length - 1
      }

      renderExerciseModal()
    })

    submitButton?.addEventListener('click', async () => {
      const isTitleValid = exerciseModalState.title.trim().length > 0
      const isTypeValid = exerciseModalState.contentType.length > 0
      const requiresChoiceQuestion = exerciseModalState.contentType === 'multipleChoice' || exerciseModalState.contentType === 'trueFalse'
      const requiresEditableAlternatives = exerciseModalState.contentType === 'multipleChoice'
      const isQuestionValid = !requiresChoiceQuestion || exerciseModalState.question.trim().length > 0
      const areAlternativesValid = !requiresEditableAlternatives || exerciseModalState.alternatives.every((alternative) => alternative.trim().length > 0)
      const isExerciseImageValid = !requiresChoiceQuestion
        || !exerciseModalState.includeImage
        || (Boolean(selectedExerciseImageMediaId) && isValidMediaIdFormat(selectedExerciseImageMediaId ?? ''))
      const isCorrectAlternativeValid = !requiresChoiceQuestion
        || (
          exerciseModalState.correctAlternativeIndex !== null
          && exerciseModalState.correctAlternativeIndex >= 0
          && exerciseModalState.correctAlternativeIndex < (exerciseModalState.contentType === 'trueFalse' ? 2 : exerciseModalState.alternatives.length)
        )

      exerciseModalState.titleError = !isTitleValid
      exerciseModalState.contentTypeError = !isTypeValid
      exerciseModalState.questionError = !isQuestionValid
      exerciseModalState.alternativesError = !areAlternativesValid
      exerciseModalState.correctAlternativeError = !isCorrectAlternativeValid
      exerciseModalState.imageError = !isExerciseImageValid

      if (!isTitleValid || !isTypeValid || !isQuestionValid || !areAlternativesValid || !isCorrectAlternativeValid || !isExerciseImageValid) {
        renderExerciseModal()
        return
      }

      const section = sections.find((item) => item.id === exerciseModalState.sectionId)
      if (!section) {
        closeExerciseModal()
        return
      }

      const currentTotal = section.lessons + section.exercises
      if (!exerciseModalState.editingActivityId && currentTotal >= 10) {
        toast(st('maxItemsError'), 'error')
        closeExerciseModal()
        return
      }

      try {
        const isTrueFalse = exerciseModalState.contentType === 'trueFalse'
        const options = isTrueFalse
          ? [trueOptionLabel, falseOptionLabel]
          : exerciseModalState.alternatives.map((alternative) => alternative.trim())

        const nextOrder = exerciseModalState.editingActivityId
          ? (section.activities.find((item) => item.id === exerciseModalState.editingActivityId)?.order ?? section.activities.length)
          : section.activities.length

        if (exerciseModalState.editingActivityId) {
          const updated = await activitiesApi.updateActivity(exerciseModalState.editingActivityId, {
            title: exerciseModalState.title.trim(),
            type: isTrueFalse ? 'true_false' : 'multiple_choice',
            order: nextOrder,
            question: exerciseModalState.question.trim(),
            options,
            correctAnswer: exerciseModalState.correctAlternativeIndex ?? 0,
            imageMediaId: exerciseModalState.includeImage ? selectedExerciseImageMediaId : null,
          })

          const target = section.activities.find((item) => item.id === updated.id)
          if (target) {
            target.title = updated.title ?? exerciseModalState.title.trim()
            target.type = updated.type
            target.order = updated.order
          }
        } else {
          const created = await activitiesApi.createActivity({
            id: crypto.randomUUID(),
            sectionId: section.id,
            title: exerciseModalState.title.trim(),
            type: isTrueFalse ? 'true_false' : 'multiple_choice',
            order: section.activities.length,
            question: exerciseModalState.question.trim(),
            options,
            correctAnswer: exerciseModalState.correctAlternativeIndex ?? 0,
            imageMediaId: exerciseModalState.includeImage ? selectedExerciseImageMediaId : null,
          })

          section.activities.push({
            id: created.id,
            sectionId: created.sectionId,
            title: created.title ?? exerciseModalState.title.trim(),
            type: created.type,
            order: created.order,
          })
        }

        section.activities.sort((a, b) => a.order - b.order)
        const counts = countSectionActivities(section.activities)
        section.lessons = counts.lessons
        section.exercises = counts.exercises

        persistSectionsLocalSnapshot()
        renderSections()
        updateWorkload()
        toast(exerciseModalState.editingActivityId ? et('updateSuccess') : et('success'), 'success')
        closeExerciseModal()
      } catch (error) {
        const mediaErrorMessage = getMediaReferenceErrorMessage(error, 'exercise')
        if (mediaErrorMessage) {
          exerciseModalState.imageError = true
          renderExerciseModal()
          toast(mediaErrorMessage, 'error')
          return
        }
        toast(t('courses.home.feedback.actionError'), 'error')
      }
    })
  }

  const renderSections = () => {
    if (!sectionsList) return

    sectionsList.innerHTML = sections
      .map((section, index) => {
        const totalItems = section.lessons + section.exercises
        const activitiesMarkup = section.activities
          .sort((a, b) => a.order - b.order)
          .map((activity) => {
            const activityIcon = activity.type === 'video_pause'
              ? '▶'
              : activity.type === 'text_reading'
                ? '≡'
                : '✓'

            const activityTypeClass = activity.type === 'video_pause'
              ? 'is-video'
              : activity.type === 'text_reading'
                ? 'is-text'
                : 'is-exercise'

            return `
              <div class="section-activity-card" data-section-id="${section.id}" data-activity-id="${activity.id}">
                <div class="section-activity-main">
                  <span class="section-activity-icon ${activityTypeClass}" aria-hidden="true">${activityIcon}</span>
                  <span class="section-activity-name">${escapeHtml(activity.title)}</span>
                </div>
                <div class="section-activity-actions" aria-hidden="true">
                  <button type="button" class="section-activity-action" data-action="edit" data-section-id="${section.id}" data-activity-id="${activity.id}">✎</button>
                  <button type="button" class="section-activity-action" data-action="view" data-section-id="${section.id}" data-activity-id="${activity.id}" aria-label="Visualizar atividade"><img src="/icons/visibility.png" alt="" class="section-activity-action-icon"></button>
                  <button type="button" class="section-activity-action section-activity-delete" data-section-id="${section.id}" data-activity-id="${activity.id}">✕</button>
                </div>
              </div>
            `
          })
          .join('')

        return `
          <article class="section-card" data-section-id="${section.id}">
            <header class="section-card-head">
              <div class="section-card-head-row">
                <div class="section-card-title">${st('sectionLabel', { index: index + 1 })}: ${escapeHtml(section.name || courseTitle)}</div>
                <button type="button" class="section-delete-btn" data-section-id="${section.id}" aria-label="Remover seção">✕</button>
              </div>
            </header>
            <div class="section-card-body">
              <label class="new-course-field">
                <span>${st('fields.name')} <em>*</em></span>
                <input type="text" class="section-name-input" value="${escapeHtml(section.name)}" placeholder="${st('fields.namePlaceholder')}">
              </label>
              <label class="new-course-field">
                <span>${st('fields.description')} <em>*</em></span>
                <input type="text" class="section-description-input" value="${escapeHtml(section.description)}" placeholder="${st('fields.descriptionPlaceholder')}">
              </label>
              <div class="section-divider" aria-hidden="true"></div>
              <div class="section-activities-list">${activitiesMarkup}</div>
              <div class="section-divider" aria-hidden="true"></div>
              <div class="section-actions">
                <button type="button" class="section-add-btn" data-action="lesson" data-section-id="${section.id}">+ ${st('addLesson')}</button>
                <span>${st('or')}</span>
                <button type="button" class="section-add-btn" data-action="exercise" data-section-id="${section.id}">+ ${st('addExercise')}</button>
              </div>
              <div class="section-items-count">${totalItems} / 10 ${st('items')}</div>
            </div>
          </article>
        `
      })
      .join('')

    sectionsList.querySelectorAll<HTMLInputElement>('.section-name-input').forEach((input, index) => {
      input.addEventListener('input', () => {
        sections[index].name = input.value
        persistSectionsLocalSnapshot()
      })

      input.addEventListener('blur', async () => {
        const section = sections[index]
        if (!section) return
        await persistSectionName(section.id, input.value)
      })
    })

    sectionsList.querySelectorAll<HTMLInputElement>('.section-description-input').forEach((input, index) => {
      input.addEventListener('input', () => {
        sections[index].description = input.value
        persistSectionsLocalSnapshot()
      })
    })

    sectionsList.querySelectorAll<HTMLButtonElement>('.section-add-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const sectionId = button.dataset.sectionId
        const action = button.dataset.action
        if (!sectionId || !action) return

        const section = sections.find((item) => item.id === sectionId)
        if (!section) return

        const currentTotal = section.lessons + section.exercises
        if (currentTotal >= 10) {
          toast(st('maxItemsError'), 'error')
          return
        }

        if (action === 'lesson') {
          openLessonModal(sectionId)
          return
        }

        if (action === 'exercise') {
          openExerciseModal(sectionId)
          return
        }
      })
    })

    sectionsList.querySelectorAll<HTMLButtonElement>('.section-activity-delete').forEach((button) => {
      button.addEventListener('click', async () => {
        const sectionId = button.dataset.sectionId
        const activityId = button.dataset.activityId
        if (!sectionId || !activityId) return
        await deleteActivity(sectionId, activityId)
      })
    })

    sectionsList.querySelectorAll<HTMLButtonElement>('.section-activity-action[data-action="edit"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const sectionId = button.dataset.sectionId
        const activityId = button.dataset.activityId
        if (!sectionId || !activityId) return
        await openEditActivityModal(sectionId, activityId)
      })
    })

    sectionsList.querySelectorAll<HTMLButtonElement>('.section-activity-action[data-action="view"]').forEach((button) => {
      button.addEventListener('click', async () => {
        const sectionId = button.dataset.sectionId
        const activityId = button.dataset.activityId
        if (!sectionId || !activityId) return
        await openPreviewActivityModal(sectionId, activityId)
      })
    })

    sectionsList.querySelectorAll<HTMLButtonElement>('.section-delete-btn').forEach((button) => {
      button.addEventListener('click', async () => {
        const sectionId = button.dataset.sectionId
        if (!sectionId) return
        openDeleteSectionModal(sectionId)
      })
    })
  }

  const updateWorkload = () => {
    if (!workloadValue) return
    const totalItems = sections.reduce((sum, section) => sum + section.lessons + section.exercises, 0)
    const hours = (totalItems * 0.25).toFixed(1)
    workloadValue.textContent = `${hours} ${st('hours')}`
  }

  const toList = (options?: { clearDraft?: boolean }) => {
    closeLessonModal()
    closeExerciseModal()
    closePreviewActivityModal()
    closeDeleteSectionModal()
    closeCancelCourseModal()
    sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'list')
    if (options?.clearDraft) {
      sessionStorage.removeItem(COURSE_HOME_DRAFT_STORAGE_KEY)
    }
    renderCreatorHomePage(container, role)
  }

  const toCreate = async () => {
    closeLessonModal()
    closeExerciseModal()
    closePreviewActivityModal()
    closeDeleteSectionModal()
    closeCancelCourseModal()

    try {
      await syncSectionNamesToBackend()
    } catch {
      persistSectionsLocalSnapshot()
    }

    persistSectionsLocalSnapshot()
    const editCourseId = sessionStorage.getItem('educado.editCourseId')
    if (editCourseId) {
      sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'edit')
      renderEditCourseScreen(container, role, editCourseId)
    } else {
      sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'create')
      renderNewCourseScreen(container, role)
    }
  }

  const toReview = async () => {
    try {
      await syncSectionNamesToBackend()
    } catch {
      persistSectionsLocalSnapshot()
    }

    persistSectionsLocalSnapshot()
    sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'review')
    renderCourseReviewScreen(container, role, draftCourse)
  }

  document.getElementById('sections-add')?.addEventListener('click', () => {
    void createSection()
  })

  document.getElementById('sections-save-draft')?.addEventListener('click', () => {
    void saveDraftAndExit()
  })
  document.getElementById('sections-save-draft-mobile')?.addEventListener('click', () => {
    void saveDraftAndExit()
  })
  document.getElementById('sections-back')?.addEventListener('click', () => {
    void toCreate()
  })
  document.getElementById('sections-cancel')?.addEventListener('click', () => {
    openCancelCourseModal()
  })
  document.getElementById('sections-next')?.addEventListener('click', () => {
    void toReview()
  })

  // Edit mode: deactivate/delete buttons in sidebar
  if (isEditMode && draftCourse) {
    document.getElementById('sections-edit-deactivate')?.addEventListener('click', async () => {
      try {
        if (draftCourse.isActive !== false) {
          await coursesApi.deactivateCourse(draftCourse.id)
          toast(t('courses.home.feedback.deactivateSuccess'), 'success')
        } else {
          await coursesApi.activateCourse(draftCourse.id)
          toast(t('courses.home.feedback.activateSuccess'), 'success')
        }
        sessionStorage.removeItem('educado.editCourseId')
        sessionStorage.removeItem(COURSE_HOME_VIEW_STORAGE_KEY)
        renderHomePage(container, role)
      } catch {
        toast(t('courses.home.feedback.statusError'), 'error')
      }
    })

    document.getElementById('sections-edit-delete')?.addEventListener('click', async () => {
      if (!window.confirm(t('courses.home.feedback.confirmDeleteCourse'))) return
      try {
        await coursesApi.deleteCourse(draftCourse.id)
        toast(t('courses.home.feedback.deleteSuccess'), 'success')
        sessionStorage.removeItem('educado.editCourseId')
        sessionStorage.removeItem(COURSE_HOME_VIEW_STORAGE_KEY)
        renderHomePage(container, role)
      } catch {
        toast(t('courses.home.feedback.deleteError'), 'error')
      }
    })
  }

  container.querySelectorAll<HTMLButtonElement>('[data-course-step]').forEach((stepButton) => {
    stepButton.addEventListener('click', () => {
      const target = stepButton.dataset.courseStep

      if (target === 'create') {
        void toCreate()
        return
      }

      if (target === 'sections') return

      if (target === 'review') {
        void toReview()
      }
    })
  })

  void loadSectionsFromBackend()
}

function renderCourseReviewScreen(container: HTMLElement, role: HomeUserRole, draftCourse: Course | null) {
  clearCourseTabsInHeader()
  sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'review')

  const rr = (path: string, params?: Record<string, string | number>) => t(`courses.review.${path}`, params)
  const ns = (path: string, params?: Record<string, string | number>) => t(`courses.newCourse.${path}`, params)

  const isEditMode = Boolean(sessionStorage.getItem('educado.editCourseId'))
  const draftCourseId = draftCourse?.id ?? ''
  const getSectionsLocalKey = () => `${COURSE_HOME_SECTIONS_LOCAL_STORAGE_KEY}:${draftCourseId || 'local'}`

  container.innerHTML = `
    <section class="new-course-page">
      <div class="new-course-layout sections-layout">
        <aside class="new-course-sidebar">
          <div class="new-course-sidebar-header">
            <h2>${isEditMode ? t('courses.editCourse.title') : ns('title')}</h2>
            <div class="new-course-divider"></div>
          </div>

          <div class="new-course-steps">
            <button type="button" class="new-course-step is-complete" data-course-step="create">
              <span class="new-course-step-check">✓</span>
              <span>${ns('generalInfo')}</span>
            </button>
            <button type="button" class="new-course-step is-complete" data-course-step="sections">
              <span class="new-course-step-check">✓</span>
              <span>${ns('sections')}</span>
            </button>
            <button type="button" class="new-course-step is-active" data-course-step="review">
              <span class="new-course-step-box"></span>
              <span>${ns('review')}</span>
            </button>
          </div>

          <div class="new-course-divider"></div>

          <button id="review-save-draft" class="new-course-outline-btn" type="button">${ns('saveDraft')}</button>
          ${isEditMode && draftCourse ? `
            <div class="new-course-divider"></div>
            <button id="review-edit-deactivate" class="new-course-outline-btn" type="button" style="border-color: #e0912d; color: #e0912d;">
              ${draftCourse.isActive !== false ? t('courses.editCourse.deactivate') : t('courses.editCourse.activate')}
            </button>
            <button id="review-edit-delete" class="new-course-outline-btn" type="button" style="border-color: #d62b25; color: #d62b25;">
              ${t('courses.editCourse.deleteCourse')}
            </button>
          ` : ''}
        </aside>

        <div class="new-course-content review-content">
          <div class="new-course-main">
            <h1>${rr('title')}</h1>

            <div class="sections-alert review-alert">
              <span class="sections-alert-icon">!</span>
              <div>
                <p>${rr('alert')}</p>
              </div>
            </div>

            <div class="review-cards">
              <article class="review-card">
                <h2>${rr('generalInfo.title')}</h2>
                <div class="review-phone-frame">
                  <div class="review-phone-notch" aria-hidden="true"></div>
                  <div id="review-general-info" class="review-card-body review-phone-screen"></div>
                </div>
              </article>

              <article class="review-card">
                <h2>${rr('sections.title')}</h2>
                <div class="review-phone-frame">
                  <div class="review-phone-notch" aria-hidden="true"></div>
                  <div id="review-sections-list" class="review-card-body review-phone-screen review-sections-list"></div>
                </div>
              </article>
            </div>
          </div>

          <div class="new-course-footer">
            <button id="review-back" class="new-course-link-btn" type="button">${ns('ctas.back')}</button>
            <div class="new-course-footer-actions">
              <button id="review-cancel" class="new-course-cancel-btn" type="button">${ns('ctas.cancel')}</button>
              <button id="review-publish" class="new-course-primary-btn" type="button">${rr('publish')}</button>
            </div>
          </div>

          <div class="new-course-mobile-draft">
            <button id="review-save-draft-mobile" class="new-course-outline-btn" type="button">${ns('saveDraft')}</button>
          </div>
        </div>
      </div>
    </section>
  `

  const generalInfoContainer = document.getElementById('review-general-info')
  const sectionsContainer = document.getElementById('review-sections-list')

  let cancelModalOpen = false

  const clearAllDrafts = () => {
    sessionStorage.removeItem(COURSE_HOME_DRAFT_STORAGE_KEY)
    sessionStorage.removeItem(COURSE_HOME_FORM_DRAFT_STORAGE_KEY)
    sessionStorage.removeItem(getSectionsLocalKey())
  }

  const toList = () => {
    sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'list')
    renderCreatorHomePage(container, role)
  }

  const toSections = () => {
    sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'sections')
    const rawDraft = sessionStorage.getItem(COURSE_HOME_DRAFT_STORAGE_KEY)
    const draft = rawDraft ? (JSON.parse(rawDraft) as Course | null) : draftCourse
    renderCourseSectionsScreen(container, role, draft)
  }

  const toCreate = () => {
    const editCourseId = sessionStorage.getItem('educado.editCourseId')
    if (editCourseId) {
      sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'edit')
      renderEditCourseScreen(container, role, editCourseId)
    } else {
      sessionStorage.setItem(COURSE_HOME_VIEW_STORAGE_KEY, 'create')
      renderNewCourseScreen(container, role)
    }
  }

  const deleteCourseWithDependents = async (courseId: string) => {
    const allSections = await sectionsApi.getSections()
    const courseSections = allSections.filter((section) => section.courseId === courseId)

    await Promise.all(
      courseSections.map(async (section) => {
        const activities = await activitiesApi.getActivitiesBySection(section.id)
        await Promise.all(activities.map((activity) => activitiesApi.deleteActivity(activity.id)))
      }),
    )

    await Promise.all(courseSections.map((section) => sectionsApi.deleteSection(section.id)))
    await coursesApi.deleteCourse(courseId)
  }

  const closeCancelCourseModal = () => {
    cancelModalOpen = false
    const modal = document.getElementById('review-cancel-modal')
    if (modal) modal.remove()
  }

  const openCancelCourseModal = () => {
    if (cancelModalOpen) return
    cancelModalOpen = true

    const wrapper = document.createElement('div')
    wrapper.id = 'review-cancel-modal'
    const modalTitleText = isEditMode ? t('courses.editCourse.cancelModal.title') : t('courses.sections.cancelCourseModal.title')
    const modalMessageText = isEditMode ? t('courses.editCourse.cancelModal.message') : t('courses.sections.cancelCourseModal.message')
    const modalCancelText = isEditMode ? t('courses.editCourse.cancelModal.cancel') : t('courses.sections.cancelCourseModal.cancel')
    const modalConfirmText = isEditMode ? t('courses.editCourse.cancelModal.confirm') : t('courses.sections.cancelCourseModal.confirm')

    wrapper.innerHTML = `
      <div class="sections-lesson-modal-overlay" id="review-cancel-overlay" role="dialog" aria-modal="true" aria-labelledby="review-cancel-title">
        <div class="sections-lesson-modal-card sections-delete-modal-card">
          <header class="sections-lesson-modal-header">
            <h2 id="review-cancel-title">${modalTitleText}</h2>
            <button type="button" id="review-cancel-close" class="sections-lesson-modal-close" aria-label="${t('courses.sections.modal.close')}">✕</button>
          </header>
          <div class="sections-lesson-modal-body">
            <p class="sections-delete-modal-message">${modalMessageText}</p>
          </div>
          <footer class="sections-lesson-modal-actions">
            <button type="button" id="review-cancel-no" class="new-course-cancel-btn">${modalCancelText}</button>
            <button type="button" id="review-cancel-yes" class="new-course-primary-btn">${modalConfirmText}</button>
          </footer>
        </div>
      </div>
    `

    document.body.appendChild(wrapper)

    const overlay = document.getElementById('review-cancel-overlay')
    const closeButton = document.getElementById('review-cancel-close') as HTMLButtonElement | null
    const noButton = document.getElementById('review-cancel-no') as HTMLButtonElement | null
    const yesButton = document.getElementById('review-cancel-yes') as HTMLButtonElement | null

    overlay?.addEventListener('click', (event) => {
      if (event.target === overlay) closeCancelCourseModal()
    })
    closeButton?.addEventListener('click', closeCancelCourseModal)
    noButton?.addEventListener('click', closeCancelCourseModal)

    yesButton?.addEventListener('click', async () => {
      try {
        const rawCurrentDraft = sessionStorage.getItem(COURSE_HOME_DRAFT_STORAGE_KEY)
        const currentDraft = rawCurrentDraft ? (JSON.parse(rawCurrentDraft) as Course | null) : null

        if (currentDraft?.id && !isEditMode) {
          await deleteCourseWithDependents(currentDraft.id)
        }

        clearAllDrafts()
        sessionStorage.removeItem('educado.editCourseId')
        closeCancelCourseModal()
        toList()
      } catch {
        toast(t('courses.home.feedback.actionError'), 'error')
      }
    })
  }

  const saveDraftAndExit = async () => {
    try {
      const rawCurrentDraft = sessionStorage.getItem(COURSE_HOME_DRAFT_STORAGE_KEY)
      const currentDraft = rawCurrentDraft ? (JSON.parse(rawCurrentDraft) as Course | null) : draftCourse

      if (currentDraft?.id) {
        await coursesApi.deactivateCourse(currentDraft.id)
      }

      clearAllDrafts()
      sessionStorage.removeItem('educado.editCourseId')
      toast(t('courses.home.feedback.deactivateSuccess'), 'success')
      toList()
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const publishCourseAndExit = async () => {
    try {
      const rawCurrentDraft = sessionStorage.getItem(COURSE_HOME_DRAFT_STORAGE_KEY)
      const currentDraft = rawCurrentDraft ? (JSON.parse(rawCurrentDraft) as Course | null) : draftCourse

      if (!currentDraft?.id) {
        toast(t('courses.home.feedback.actionError'), 'error')
        return
      }

      await coursesApi.activateCourse(currentDraft.id)
      clearAllDrafts()
      sessionStorage.removeItem('educado.editCourseId')
      toast(rr('publishSuccess'), 'success')
      toList()
    } catch {
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  const loadReviewData = async () => {
    if (!generalInfoContainer || !sectionsContainer) {
      return
    }

    if (!draftCourseId) {
      generalInfoContainer.innerHTML = `<div class="creator-empty-state">${rr('missingDraft')}</div>`
      sectionsContainer.innerHTML = `<div class="creator-empty-state">${rr('missingDraft')}</div>`
      return
    }

    try {
      const [course, allSections, allTags] = await Promise.all([
        coursesApi.getCourse(draftCourseId),
        sectionsApi.getSections(),
        tagsApi.getTags(),
      ])

      sessionStorage.setItem(COURSE_HOME_DRAFT_STORAGE_KEY, JSON.stringify(course))

      const localSnapshotRaw = sessionStorage.getItem(getSectionsLocalKey())
      const localSnapshot = localSnapshotRaw
        ? (JSON.parse(localSnapshotRaw) as { sections?: Array<{ id: string; name: string; description: string }> })
        : null

      const sectionRows = allSections
        .filter((section) => section.courseId === draftCourseId)
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          const local = localSnapshot?.sections?.find((item) => item.id === section.id)
          return {
            id: section.id,
            title: local?.name?.trim() || section.title,
            description: local?.description?.trim() || '',
            videoMediaId: section.videoMediaId,
            thumbnailMediaId: section.thumbnailMediaId,
          }
        })

      const sectionsWithCounts = await Promise.all(
        sectionRows.map(async (section) => {
          const activities = await activitiesApi.getActivitiesBySection(section.id)
          const lessons = activities.filter((item) => item.type === 'video_pause' || item.type === 'text_reading').length
          const exercises = activities.filter((item) => item.type === 'multiple_choice' || item.type === 'true_false').length
          const firstImageActivity = activities.find((item) => typeof item.imageMediaId === 'string' && item.imageMediaId.trim().length > 0)

          const mediaPreview = section.videoMediaId
            ? {
                kind: 'video' as const,
                src: getMediaStreamUrl(section.videoMediaId),
                poster: section.thumbnailMediaId
                  ? getMediaStreamUrl(section.thumbnailMediaId)
                  : (firstImageActivity?.imageMediaId ? getMediaStreamUrl(firstImageActivity.imageMediaId) : ''),
              }
            : section.thumbnailMediaId
              ? {
                  kind: 'image' as const,
                  src: getMediaStreamUrl(section.thumbnailMediaId),
                }
              : firstImageActivity?.imageMediaId
                ? {
                    kind: 'image' as const,
                    src: getMediaStreamUrl(firstImageActivity.imageMediaId),
                  }
                : null

          return { ...section, lessons, exercises, mediaPreview, activities }
        }),
      )

      const tagNames = (course.tags || [])
        .map((tagId) => allTags.find((tag) => tag.id === tagId)?.name)
        .filter(Boolean) as string[]

      const difficultyKey = course.difficulty === 'beginner'
        ? 'beginner'
        : course.difficulty === 'intermediate'
          ? 'intermediate'
          : 'advanced'

      generalInfoContainer.innerHTML = `
        <div class="review-info-list">
          <div class="review-info-item"><strong>${rr('generalInfo.name')}</strong><span>${escapeHtml(course.title)}</span></div>
          <div class="review-info-item"><strong>${rr('generalInfo.category')}</strong><span>${escapeHtml(course.category)}</span></div>
          <div class="review-info-item"><strong>${rr('generalInfo.level')}</strong><span>${escapeHtml(t(`courses.newCourse.difficultyOptions.${difficultyKey}`))}</span></div>
          <div class="review-info-item"><strong>${rr('generalInfo.description')}</strong><p>${escapeHtml(course.description)}</p></div>
          <div class="review-info-item"><strong>${rr('generalInfo.tags')}</strong><span>${escapeHtml(tagNames.join(', ') || rr('generalInfo.noTags'))}</span></div>
        </div>
      `

      if (course.imageMediaId) {
        generalInfoContainer.innerHTML += `
          <div class="review-image-wrap">
            <img src="${getMediaStreamUrl(course.imageMediaId)}" alt="${escapeHtml(course.title)}" class="review-cover-image">
          </div>
        `
      }

      if (sectionsWithCounts.length === 0) {
        sectionsContainer.innerHTML = `<div class="review-empty">${rr('sections.empty')}</div>`
        return
      }

      sectionsContainer.innerHTML = sectionsWithCounts
        .map((section, index) => `
          <button type="button" class="review-section-toggle" data-review-section="${index}">
            <span class="review-section-chevron">▾</span>
            <div class="review-section-head">
              <strong>${rr('sections.itemTitle', { index: index + 1 })}</strong>
              <span>${section.lessons} ${rr('sections.lessons')} • ${section.exercises} ${rr('sections.exercises')}</span>
            </div>
            <h3>${escapeHtml(section.title)}</h3>
          </button>
          <div class="review-section-body" id="review-section-body-${index}" style="display: none;">
            ${section.description ? `<p class="review-section-desc">${escapeHtml(section.description)}</p>` : ''}
            ${section.mediaPreview && section.mediaPreview.kind === 'video'
              ? `
                <div class="review-section-media-wrap">
                  <video class="review-section-media" controls preload="metadata" ${section.mediaPreview.poster ? `poster="${section.mediaPreview.poster}"` : ''}>
                    <source src="${section.mediaPreview.src}">
                  </video>
                </div>
              `
              : section.mediaPreview && section.mediaPreview.kind === 'image'
                ? `
                  <div class="review-section-media-wrap">
                    <img src="${section.mediaPreview.src}" alt="${escapeHtml(section.title)}" class="review-section-media">
                  </div>
                `
                : ''
            }
            ${section.activities.length > 0 ? `
              <div class="review-activities-list">
                ${section.activities.sort((a: any, b: any) => a.order - b.order).map((activity: any) => {
                  const typeLabel = activity.type === 'video_pause' ? 'Aula em Vídeo'
                    : activity.type === 'text_reading' ? 'Leitura'
                    : activity.type === 'multiple_choice' ? 'Múltipla Escolha'
                    : activity.type === 'true_false' ? 'Verdadeiro/Falso'
                    : activity.type
                  const typeClass = activity.type === 'video_pause' ? 'is-video'
                    : activity.type === 'text_reading' ? 'is-text'
                    : 'is-exercise'
                  const icon = activity.type === 'video_pause' ? '▶'
                    : activity.type === 'text_reading' ? '📄'
                    : '✎'

                  return `
                    <div class="review-activity-item">
                      <span class="review-activity-icon ${typeClass}">${icon}</span>
                      <div class="review-activity-info">
                        <strong>${escapeHtml(activity.title || typeLabel)}</strong>
                        <small>${typeLabel}</small>
                      </div>
                    </div>
                    ${activity.type === 'video_pause' && activity.imageMediaId ? `
                      <div class="review-section-media-wrap">
                        <video class="review-section-media" controls preload="metadata">
                          <source src="${getMediaStreamUrl(activity.imageMediaId)}">
                        </video>
                      </div>
                    ` : ''}
                  `
                }).join('')}
              </div>
            ` : ''}
          </div>
        `)
        .join('')

      // Accordion behavior — one section open at a time
      sectionsContainer.querySelectorAll<HTMLButtonElement>('.review-section-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.reviewSection
          const body = document.getElementById(`review-section-body-${idx}`)
          if (!body) return

          const isOpen = body.style.display !== 'none'

          // Close all
          sectionsContainer.querySelectorAll<HTMLElement>('.review-section-body').forEach((el) => {
            el.style.display = 'none'
            // Pause any playing videos
            el.querySelectorAll('video').forEach((v) => v.pause())
          })
          sectionsContainer.querySelectorAll('.review-section-toggle').forEach((b) => {
            b.classList.remove('is-open')
          })

          // Toggle clicked
          if (!isOpen) {
            body.style.display = 'flex'
            btn.classList.add('is-open')
          }
        })
      })
    } catch {
      generalInfoContainer.innerHTML = `<div class="review-empty">${rr('loadError')}</div>`
      sectionsContainer.innerHTML = `<div class="review-empty">${rr('loadError')}</div>`
      toast(t('courses.home.feedback.actionError'), 'error')
    }
  }

  document.getElementById('review-back')?.addEventListener('click', toSections)
  document.getElementById('review-cancel')?.addEventListener('click', openCancelCourseModal)
  document.getElementById('review-publish')?.addEventListener('click', () => {
    void publishCourseAndExit()
  })
  document.getElementById('review-save-draft')?.addEventListener('click', () => {
    void saveDraftAndExit()
  })
  document.getElementById('review-save-draft-mobile')?.addEventListener('click', () => {
    void saveDraftAndExit()
  })

  // Edit mode: deactivate/delete buttons in sidebar
  if (isEditMode && draftCourse) {
    document.getElementById('review-edit-deactivate')?.addEventListener('click', async () => {
      try {
        if (draftCourse.isActive !== false) {
          await coursesApi.deactivateCourse(draftCourse.id)
          toast(t('courses.home.feedback.deactivateSuccess'), 'success')
        } else {
          await coursesApi.activateCourse(draftCourse.id)
          toast(t('courses.home.feedback.activateSuccess'), 'success')
        }
        sessionStorage.removeItem('educado.editCourseId')
        sessionStorage.removeItem(COURSE_HOME_VIEW_STORAGE_KEY)
        renderHomePage(container, role)
      } catch {
        toast(t('courses.home.feedback.statusError'), 'error')
      }
    })

    document.getElementById('review-edit-delete')?.addEventListener('click', async () => {
      if (!window.confirm(t('courses.home.feedback.confirmDeleteCourse'))) return
      try {
        await coursesApi.deleteCourse(draftCourse.id)
        toast(t('courses.home.feedback.deleteSuccess'), 'success')
        sessionStorage.removeItem('educado.editCourseId')
        sessionStorage.removeItem(COURSE_HOME_VIEW_STORAGE_KEY)
        renderHomePage(container, role)
      } catch {
        toast(t('courses.home.feedback.deleteError'), 'error')
      }
    })
  }

  container.querySelectorAll<HTMLButtonElement>('[data-course-step]').forEach((stepButton) => {
    stepButton.addEventListener('click', () => {
      const target = stepButton.dataset.courseStep

      if (target === 'create') {
        toCreate()
        return
      }

      if (target === 'sections') {
        toSections()
      }
    })
  })

  void loadReviewData()
}

function getStars(rating: number) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars)
}

function renderRating(rating: number) {
  const stars = getStars(rating)
  return `<span>${stars}</span><span>${rating.toFixed(1)}</span>`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
