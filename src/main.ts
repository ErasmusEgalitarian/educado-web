import { api } from './api'
import { Course, CreateCourseInput } from './types'
import { CourseEditor } from './course-editor'

class CourseManager {
  private currentView: 'courses' | 'create' | 'detail' = 'courses'
  private courses: Course[] = []
  private courseEditor: CourseEditor | null = null

  constructor() {
    this.init()
  }

  private init() {
    this.setupNavigation()
    this.setupForm()
    this.loadCourses()
  }

  private setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn')
    navButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement
        const view = target.dataset.view as 'courses' | 'create'
        this.switchView(view)
      })
    })
  }

  private switchView(view: 'courses' | 'create') {
    this.currentView = view

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view)
    })

    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('active', v.id === `${view}-view`)
    })

    if (view === 'courses') {
      this.loadCourses()
    }
  }

  private setupForm() {
    const form = document.getElementById('course-form') as HTMLFormElement
    form.addEventListener('submit', async (e) => {
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
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    try {
      this.showMessage('Creating course...', 'loading')

      await api.createCourse(courseData)

      this.showMessage('Course created successfully!', 'success')
      form.reset()

      setTimeout(() => {
        this.switchView('courses')
      }, 1500)
    } catch (error) {
      this.showMessage('Error creating course. Please try again.', 'error')
      console.error('Error:', error)
    }
  }

  private async loadCourses() {
    const coursesList = document.getElementById('courses-list')
    if (!coursesList) return

    try {
      coursesList.innerHTML = '<div class="loading">Loading courses...</div>'

      this.courses = await api.getCourses()

      if (this.courses.length === 0) {
        coursesList.innerHTML = `
          <div class="empty-state">
            <h3>No courses yet</h3>
            <p>Create your first course to get started!</p>
          </div>
        `
      } else {
        coursesList.innerHTML = this.courses.map(course => this.createCourseCard(course)).join('')

        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-course-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const courseId = (e.target as HTMLElement).dataset.courseId
            if (courseId) {
              this.showCourseDetail(courseId)
            }
          })
        })
      }
    } catch (error) {
      coursesList.innerHTML = `
        <div class="error">
          Failed to load courses. Please make sure the API server is running.
        </div>
      `
      console.error('Error loading courses:', error)
    }
  }

  private createCourseCard(course: Course): string {
    return `
      <div class="course-card" data-course-id="${course.id}">
        <h3>${course.title}</h3>
        <p>${course.shortDescription}</p>
        <div class="course-meta">
          <span class="badge badge-${course.difficulty}">${course.difficulty}</span>
          <span>${course.estimatedTime}</span>
        </div>
        <div class="course-meta">
          <span>Category: ${course.category}</span>
          <span>Threshold: ${course.passingThreshold}%</span>
        </div>
        ${course.tags.length > 0 ? `
          <div style="margin-top: 10px;">
            ${course.tags.map(tag => `<span style="display: inline-block; margin-right: 5px; padding: 2px 8px; background: #f0f0f0; border-radius: 3px; font-size: 12px;">${tag}</span>`).join('')}
          </div>
        ` : ''}
        <div style="margin-top: 15px;">
          <button class="btn btn-primary edit-course-btn" data-course-id="${course.id}">Edit Sections</button>
        </div>
      </div>
    `
  }

  private async showCourseDetail(courseId: string) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))

    // Show detail view
    const detailView = document.getElementById('course-detail-view')
    if (detailView) {
      detailView.classList.add('active')

      const contentContainer = document.getElementById('course-detail-content')
      if (contentContainer) {
        try {
          const course = await api.getCourse(courseId)

          contentContainer.innerHTML = `
            <h2>${course.title}</h2>
            <p>${course.description}</p>
            <div id="course-editor-container"></div>
          `

          // Initialize course editor
          const editorContainer = document.getElementById('course-editor-container')
          if (editorContainer) {
            this.courseEditor = new CourseEditor(editorContainer)
            await this.courseEditor.loadCourse(courseId)
          }
        } catch (error) {
          contentContainer.innerHTML = '<div class="error">Failed to load course details</div>'
          console.error('Error loading course:', error)
        }
      }
    }

    // Setup back button
    const backBtn = document.getElementById('back-to-courses')
    if (backBtn) {
      backBtn.onclick = () => this.switchView('courses')
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'loading') {
    const existingMessage = document.querySelector('.message')
    if (existingMessage) {
      existingMessage.remove()
    }

    const messageDiv = document.createElement('div')
    messageDiv.className = `message ${type}`
    messageDiv.textContent = message
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 6px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `

    if (type === 'success') {
      messageDiv.style.background = '#4caf50'
      messageDiv.style.color = 'white'
    } else if (type === 'error') {
      messageDiv.style.background = '#f44336'
      messageDiv.style.color = 'white'
    } else {
      messageDiv.style.background = '#2196f3'
      messageDiv.style.color = 'white'
    }

    document.body.appendChild(messageDiv)

    if (type !== 'loading') {
      setTimeout(() => {
        messageDiv.remove()
      }, 3000)
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CourseManager()
})

const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`
document.head.appendChild(style)