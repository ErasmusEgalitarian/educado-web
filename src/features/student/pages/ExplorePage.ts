import { t } from '@/shared/i18n'
import { renderMobileLayout } from '../components/MobileLayout'
import { studentApi, CatalogCourse } from '../api/student.api'
import { getAccessToken } from '@/shared/api/auth-session'
import { routes } from '@/app/routes'

export async function renderExplorePage(container: HTMLElement) {
  let courses: CatalogCourse[] = []
  let categories: string[] = []
  let activeCategory = ''
  let searchQuery = ''

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5001'
  const token = getAccessToken() ?? ''
  const getImageUrl = (mediaId: string) =>
    `${baseUrl}/media/${mediaId}/stream?token=${token}`

  const getDifficultyLabel = (d: string) => {
    const key = `student.explore.level.${d}` as const
    return t(key)
  }

  const renderStars = (rating: number | null) => {
    const r = rating ?? 0
    let html = ''
    for (let i = 1; i <= 5; i++) {
      html += `<svg width="12" height="12" viewBox="0 0 24 24" fill="${i <= r ? '#f5a623' : '#d1dbe3'}" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    }
    return html
  }

  const loadCourses = async () => {
    try {
      const params: { q?: string; category?: string } = {}
      if (searchQuery) params.q = searchQuery
      if (activeCategory) params.category = activeCategory
      const data = await studentApi.listCourses(params)
      courses = data.items
    } catch {
      courses = []
    }
  }

  const render = () => {
    const categoryTagsHtml = `
      <div class="mobile-category-tags" style="margin-top: 8px;">
        <button class="mobile-category-tag${!activeCategory ? ' active' : ''}" data-category="">${t('student.explore.all')}</button>
        ${categories.map(c => `
          <button class="mobile-category-tag${activeCategory === c ? ' active' : ''}" data-category="${c}">${c}</button>
        `).join('')}
      </div>
    `

    const coursesHtml = courses.map(c => `
      <div class="mobile-course-card" data-course-id="${c.id}" style="cursor: pointer;">
        ${c.imageMediaId ? `<img class="mobile-course-card-img" src="${getImageUrl(c.imageMediaId)}" alt="${c.title}">` : '<div class="mobile-course-card-img"></div>'}
        <div class="mobile-course-card-body">
          <div class="mobile-course-card-title">${c.title}</div>
          <div class="mobile-course-card-meta">
            <span class="mobile-course-card-meta-item">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 10h8M3 2h6v6H3z"/></svg>
              ${c.category}
            </span>
            <span class="mobile-course-card-meta-item">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="5"/><path d="M6 3v3l2 1"/></svg>
              ${c.estimatedTime}
            </span>
            <span class="mobile-course-card-meta-item">${getDifficultyLabel(c.difficulty)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
            <div style="display: flex; gap: 1px;">${renderStars(c.rating)}</div>
            <span style="font-size: 10px; color: #628397;">${t('student.explore.learnMore')}</span>
          </div>
        </div>
      </div>
    `).join('')

    const contentHtml = `
      <div style="padding: 16px 24px 0;">
        <h1 style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 20px; color: #141b1f; margin: 0 0 16px;">${t('student.explore.title')}</h1>
        <div class="mobile-search-bar">
          <input type="text" placeholder="${t('student.explore.searchPlaceholder')}" id="explore-search" value="${searchQuery}">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="7" cy="7" r="5.5"/><line x1="11" y1="11" x2="14" y2="14"/></svg>
        </div>
        ${categoryTagsHtml}
      </div>
      <div style="padding: 16px 24px;">
        ${coursesHtml || `<div class="mobile-empty-state"><div class="mobile-empty-state-text">${t('student.myCourses.emptyTitle')}</div></div>`}
      </div>
    `

    renderMobileLayout(container, 'explore', contentHtml)
    bindEvents()
  }

  const bindEvents = () => {
    const searchInput = container.querySelector('#explore-search') as HTMLInputElement | null
    let searchTimeout: ReturnType<typeof setTimeout> | null = null
    searchInput?.addEventListener('input', () => {
      if (searchTimeout) clearTimeout(searchTimeout)
      searchTimeout = setTimeout(async () => {
        searchQuery = searchInput.value
        await loadCourses()
        render()
      }, 400)
    })

    container.querySelectorAll('.mobile-category-tag').forEach(tag => {
      tag.addEventListener('click', async () => {
        activeCategory = (tag as HTMLElement).dataset.category ?? ''
        await loadCourses()
        render()
      })
    })

    container.querySelectorAll('.mobile-course-card').forEach(card => {
      card.addEventListener('click', () => {
        const courseId = (card as HTMLElement).dataset.courseId
        window.location.assign(`${routes.studentCourseDetail}?id=${courseId}`)
      })
    })
  }

  // Load data
  try {
    const [coursesData, catData] = await Promise.all([
      studentApi.listCourses(),
      studentApi.getCategories(),
    ])
    courses = coursesData.items
    categories = catData.categories
  } catch {
    courses = []
    categories = []
  }

  render()
}
