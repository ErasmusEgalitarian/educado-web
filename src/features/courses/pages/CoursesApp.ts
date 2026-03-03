import { coursesApi } from '@/features/courses/api/courses.api'
import type { Course, CreateCourseInput } from '@/features/courses/model/course.types'
import { CourseEditor } from '@/features/courses/editor'
import { toast } from '@/shared/ui/toast'

type ViewMode = 'grid' | 'table'
type MainView = 'courses' | 'create' | 'detail'

class CoursesApp {
  private viewMode: ViewMode = 'grid'
  private courses: Course[] = []
  private filteredCourses: Course[] = []
  private courseEditor: CourseEditor | null = null
  private searchQuery = ''
  private filterValue = 'recent'

  init() {
    this.setupEventListeners()
    this.setupForm()
    this.loadCourses()
    this.updateSidebarStats()
  }

  private setupEventListeners() {
    document.getElementById('create-course-btn')?.addEventListener('click', () => this.switchView('create'))
    document.getElementById('cancel-create')?.addEventListener('click', () => this.switchView('courses'))
    document.getElementById('back-to-courses')?.addEventListener('click', () => this.switchView('courses'))

    document.getElementById('grid-view-btn')?.addEventListener('click', () => this.setViewMode('grid'))
    document.getElementById('table-view-btn')?.addEventListener('click', () => this.setViewMode('table'))

    const searchInput = document.getElementById('course-search') as HTMLInputElement | null
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value.toLowerCase()
      this.applyFilters()
    })

    const filterDropdown = document.getElementById('filter-dropdown') as HTMLSelectElement | null
    filterDropdown?.addEventListener('change', (e) => {
      this.filterValue = (e.target as HTMLSelectElement).value
      this.applyFilters()
    })
  }

  private setViewMode(mode: ViewMode) {
    this.viewMode = mode

    const gridBtn = document.getElementById('grid-view-btn')
    const tableBtn = document.getElementById('table-view-btn')
    const gridView = document.getElementById('courses-grid-view')
    const tableView = document.getElementById('courses-table-view')

    gridBtn?.classList.toggle('active', mode === 'grid')
    tableBtn?.classList.toggle('active', mode === 'table')

    if (mode === 'grid') {
      gridView?.style.setProperty('display', 'block')
      tableView?.style.setProperty('display', 'none')
    } else {
      gridView?.style.setProperty('display', 'none')
      tableView?.style.setProperty('display', 'block')
    }

    this.renderCourses()
  }

  private switchView(view: MainView) {
    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('active', (v as HTMLElement).id === `${view}-view`)
    })

    if (view === 'courses') this.loadCourses()
  }

  private setupForm() {
    const form = document.getElementById('course-form') as HTMLFormElement | null
    form?.addEventListener('submit', async (e) => {
      e.preventDefault()
      await this.handleCreateCourse(form)
    })
  }

  private async handleCreateCourse(form: HTMLFormElement) {
    const formData = new FormData(form)

    const courseData: CreateCourseInput = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      shortDescription: formData.get('shortDescription') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      difficulty: formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced',
      estimatedTime: formData.get('estimatedTime') as string,
      passingThreshold: parseInt(formData.get('passingThreshold') as string),
      category: formData.get('category') as string,
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean)
    }

    try {
      toast('Criando curso...', 'loading')
      await coursesApi.createCourse(courseData)
      toast('Curso criado com sucesso!', 'success')
      form.reset()
      setTimeout(() => this.switchView('courses'), 1500)
    } catch (error) {
      toast('Erro ao criar curso. Tente novamente.', 'error')
      console.error(error)
    }
  }

  private applyFilters() {
    let filtered = [...this.courses]

    if (this.searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(this.searchQuery) ||
        course.category.toLowerCase().includes(this.searchQuery) ||
        course.shortDescription.toLowerCase().includes(this.searchQuery)
      )
    }

    switch (this.filterValue) {
      case 'recent':
        filtered.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0))
        break
      case 'oldest':
        filtered.sort((a, b) => (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0))
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
    }

    this.filteredCourses = filtered
    this.renderCourses()
  }

  private async loadCourses() {
    try {
      const coursesList = document.getElementById('courses-list')
      const tableBody = document.getElementById('courses-table-body')

      if (coursesList) coursesList.innerHTML = '<div class="loading">Carregando cursos...</div>'
      if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="loading">Carregando cursos...</td></tr>'

      this.courses = await coursesApi.getCourses()
      this.applyFilters()
      this.updateSidebarStats()
    } catch (error) {
      const coursesList = document.getElementById('courses-list')
      const tableBody = document.getElementById('courses-table-body')

      if (coursesList) {
        coursesList.innerHTML = `<div class="error">Falha ao carregar cursos. Certifique-se de que o servidor da API está em execução.</div>`
      }
      if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="6" class="error">Falha ao carregar cursos.</td></tr>'
      }
      console.error(error)
    }
  }

  private renderCourses() {
    if (this.viewMode === 'grid') this.renderGridView()
    else this.renderTableView()
  }

  private renderGridView() {
    const coursesList = document.getElementById('courses-list')
    if (!coursesList) return

    if (this.filteredCourses.length === 0) {
      coursesList.innerHTML = `
        <div class="empty-state">
          <h3>Nenhum curso encontrado</h3>
          <p>Crie seu primeiro curso para começar!</p>
        </div>
      `
      return
    }

    coursesList.innerHTML = this.filteredCourses.map(course => this.createCourseCard(course)).join('')

    document.querySelectorAll('.edit-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courseId = (e.target as HTMLElement).dataset.courseId
        if (courseId) this.showCourseDetail(courseId)
      })
    })

    document.querySelectorAll('.view-course-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courseId = (e.target as HTMLElement).dataset.courseId
        if (courseId) this.showCourseDetail(courseId)
      })
    })
  }

  private renderTableView() {
    const tableBody = document.getElementById('courses-table-body')
    if (!tableBody) return

    if (this.filteredCourses.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum curso encontrado</td></tr>'
      return
    }

    tableBody.innerHTML = this.filteredCourses.map(course => this.createTableRow(course)).join('')

    document.querySelectorAll('.edit-course-icon').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courseId = (e.target as HTMLElement).dataset.courseId
        if (courseId) this.showCourseDetail(courseId)
      })
    })
  }

  private createCourseCard(course: Course): string {
    const rating = course.rating || 3.7
    const stars = this.getStars(rating)
    const categoryName = course.category || 'Geral'
    const estimatedTime = course.estimatedTime || 'N/A'
    const iconLetter = course.title.charAt(0).toUpperCase()

    return `
      <div class="course-card" data-course-id="${course.id}">
        <div class="course-card-header">
            <div class="course-icon-small">
                ${iconLetter}
            </div>
            <h3>${course.title}</h3>
        </div>
        
        <div class="course-meta">
          <div class="meta-item">
            <svg class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>${categoryName}</span>
          </div>
          <div class="meta-item">
            <svg class="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>${estimatedTime}</span>
          </div>
        </div>

        <div class="course-rating">
            <span class="stars">${stars}</span>
            <span class="rating-number">${rating.toFixed(1)}</span>
        </div>

        <div class="course-actions">
          <button class="btn btn-edit edit-course-btn" data-course-id="${course.id}">Editar</button>
          <button class="btn btn-view view-course-btn" data-course-id="${course.id}">Visualizar</button>
        </div>
      </div>
    `
  }

  private createTableRow(course: Course): string {
    const rating = course.rating || 3.7
    const stars = this.getStars(rating)
    const categoryName = course.category || 'Geral'
    const estimatedTime = course.estimatedTime || 'N/A'
    const enrolledCount = Math.floor(Math.random() * 200) + 50

    return `
      <tr>
        <td>${course.title}</td>
        <td>${categoryName}</td>
        <td>${estimatedTime}</td>
        <td>${enrolledCount} alunos</td>
        <td>${stars} ${rating.toFixed(1)}</td>
        <td>
          <button class="btn-icon edit-course-icon" data-course-id="${course.id}" title="Editar">✏️</button>
        </td>
      </tr>
    `
  }

  private getStars(rating: number): string {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars)
  }

  private updateSidebarStats() {
    const totalCourses = this.courses.length
    const totalStudents = totalCourses * 20
    const totalCertificates = Math.floor(totalCourses * 6.75)
    const avgRating = this.courses.length > 0
      ? this.courses.reduce((sum, c) => sum + (c.rating || 3.7), 0) / this.courses.length
      : 3.7

    document.getElementById('total-courses')!.textContent = totalCourses.toString()
    document.getElementById('total-students')!.textContent = totalStudents.toString()
    document.getElementById('total-certificates')!.textContent = totalCertificates.toString()
    document.getElementById('rating-stars')!.textContent = this.getStars(avgRating)
    document.getElementById('rating-value')!.textContent = avgRating.toFixed(1)

    const coursesChangeEl = document.getElementById('courses-change')
    const studentsChangeEl = document.getElementById('students-change')
    const certificatesChangeEl = document.getElementById('certificates-change')

    if (coursesChangeEl) { coursesChangeEl.textContent = '▲ 5%'; coursesChangeEl.className = 'stat-change positive' }
    if (studentsChangeEl) { studentsChangeEl.textContent = '▼ 5%'; studentsChangeEl.className = 'stat-change negative' }
    if (certificatesChangeEl) { certificatesChangeEl.textContent = '▲ 5%'; certificatesChangeEl.className = 'stat-change positive' }
  }

  private async showCourseDetail(courseId: string) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))

    const detailView = document.getElementById('course-detail-view')
    if (!detailView) return

    detailView.classList.add('active')
    const contentContainer = document.getElementById('course-detail-content')
    if (!contentContainer) return

    try {
      const course = await coursesApi.getCourse(courseId)

      contentContainer.innerHTML = `
        <div class="course-detail-header">
          <h2>${course.title}</h2>
          <p class="course-description">${course.description}</p>
        </div>
        <div id="course-editor-container"></div>
      `

      const editorContainer = document.getElementById('course-editor-container')
      if (editorContainer) {
        this.courseEditor = new CourseEditor(editorContainer)
        await this.courseEditor.loadCourse(courseId)
      }
    } catch (error) {
      contentContainer.innerHTML = '<div class="error">Falha ao carregar detalhes do curso</div>'
      console.error(error)
    }
  }
}

export function startCoursesApp() {
  new CoursesApp().init()
}