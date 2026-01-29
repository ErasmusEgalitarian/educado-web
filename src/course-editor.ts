import { api } from './api'
import { Course } from './types'

export interface Section {
  id: string
  courseId: string
  title: string
  videoUrl?: string | null
  thumbnailUrl?: string | null
  duration?: number | null
  order: number
  activities?: Activity[]
}

export interface Activity {
  id: string
  sectionId: string
  type: 'video_pause' | 'true_false' | 'text_reading' | 'multiple_choice'
  order: number
  pauseTimestamp?: number | null
  textPages?: string[] | null
  question?: string | null
  imageUrl?: string | null
  options?: string[] | null
  correctAnswer?: number | boolean | null
  icon?: string | null
}

export class CourseEditor {
  private courseId: string | null = null
  private sections: Section[] = []
  private currentSection: Section | null = null

  constructor(private container: HTMLElement) {}

  async loadCourse(courseId: string) {
    this.courseId = courseId
    await this.loadSections()
    this.render()
  }

  async loadSections() {
    if (!this.courseId) return
    try {
      const response = await fetch(`/api/sections/course/${this.courseId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sections')
      }
      const data = await response.json()
      this.sections = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error loading sections:', error)
      this.sections = []
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="course-editor">
        <div class="editor-header">
          <h3>Course Sections</h3>
          <button class="btn btn-primary" id="add-section-btn">Add Section</button>
        </div>

        <div id="sections-list">
          ${this.renderSections()}
        </div>

        <div id="section-editor" style="display: none;">
          ${this.renderSectionEditor()}
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  renderSections() {
    if (this.sections.length === 0) {
      return `<div class="empty-state">No sections yet. Add your first section to get started.</div>`
    }

    return this.sections
      .sort((a, b) => a.order - b.order)
      .map(section => `
        <div class="section-card" data-section-id="${section.id}">
          <div class="section-header">
            <h4>${section.order}. ${section.title}</h4>
            <div class="section-actions">
              <button class="btn-icon edit-section" data-id="${section.id}">Edit</button>
              <button class="btn-icon add-activity" data-id="${section.id}">Add Activity</button>
              <button class="btn-icon delete-section" data-id="${section.id}">Delete</button>
            </div>
          </div>
          ${section.videoUrl ? `<p class="section-meta">Video: ${section.videoUrl}</p>` : ''}
          ${section.activities && section.activities.length > 0 ? `
            <div class="activities-list">
              <h5>Activities:</h5>
              ${section.activities.map(activity => this.renderActivity(activity)).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')
  }

  renderActivity(activity: Activity) {
    let content = `<strong>${activity.type}</strong>`

    if (activity.question) {
      content += `: ${activity.question}`
    }

    if (activity.type === 'multiple_choice' && activity.options) {
      content += `<ul>${activity.options.map((opt, i) =>
        `<li>${opt} ${i === activity.correctAnswer ? '✓' : ''}</li>`
      ).join('')}</ul>`
    }

    return `
      <div class="activity-item">
        <span class="activity-order">${activity.order}.</span>
        <span class="activity-type">${content}</span>
        <button class="btn-icon delete-activity" data-section="${activity.sectionId}" data-id="${activity.id}">×</button>
      </div>
    `
  }

  renderSectionEditor() {
    return `
      <div class="modal-backdrop">
        <div class="modal">
          <h3 id="section-editor-title">Add Section</h3>
          <form id="section-form">
            <input type="hidden" id="section-id" />

            <div class="form-group">
              <label>Section Title</label>
              <input type="text" id="section-title" required />
            </div>

            <div class="form-group">
              <label>Video URL (optional)</label>
              <input type="url" id="section-video" />
            </div>

            <div class="form-group">
              <label>Thumbnail URL (optional)</label>
              <input type="url" id="section-thumbnail" />
            </div>

            <div class="form-group">
              <label>Duration (seconds)</label>
              <input type="number" id="section-duration" />
            </div>

            <div class="form-group">
              <label>Order</label>
              <input type="number" id="section-order" required min="1" />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" id="cancel-section">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Section</button>
            </div>
          </form>
        </div>
      </div>
    `
  }

  renderActivityEditor(sectionId: string) {
    return `
      <div class="modal-backdrop">
        <div class="modal">
          <h3>Add Activity</h3>
          <form id="activity-form">
            <input type="hidden" id="activity-section-id" value="${sectionId}" />

            <div class="form-group">
              <label>Activity Type</label>
              <select id="activity-type" required>
                <option value="">Select type...</option>
                <option value="video_pause">Video Pause</option>
                <option value="true_false">True/False</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="text_reading">Text Reading</option>
              </select>
            </div>

            <div class="form-group">
              <label>Order</label>
              <input type="number" id="activity-order" required min="1" />
            </div>

            <div id="activity-fields"></div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" id="cancel-activity">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Activity</button>
            </div>
          </form>
        </div>
      </div>
    `
  }

  attachEventListeners() {
    // Add section button
    document.getElementById('add-section-btn')?.addEventListener('click', () => {
      this.showSectionEditor()
    })

    // Edit section buttons
    document.querySelectorAll('.edit-section').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).dataset.id
        const section = this.sections.find(s => s.id === id)
        if (section) this.showSectionEditor(section)
      })
    })

    // Add activity buttons
    document.querySelectorAll('.add-activity').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sectionId = (e.target as HTMLElement).dataset.id!
        this.showActivityEditor(sectionId)
      })
    })

    // Delete section buttons
    document.querySelectorAll('.delete-section').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.target as HTMLElement).dataset.id
        if (confirm('Delete this section and all its activities?')) {
          await this.deleteSection(id!)
        }
      })
    })
  }

  showSectionEditor(section?: Section) {
    const editor = document.getElementById('section-editor')!
    editor.style.display = 'block'
    editor.innerHTML = this.renderSectionEditor()

    if (section) {
      (document.getElementById('section-editor-title')! as HTMLElement).textContent = 'Edit Section';
      (document.getElementById('section-id')! as HTMLInputElement).value = section.id;
      (document.getElementById('section-title')! as HTMLInputElement).value = section.title;
      (document.getElementById('section-video')! as HTMLInputElement).value = section.videoUrl || '';
      (document.getElementById('section-thumbnail')! as HTMLInputElement).value = section.thumbnailUrl || '';
      (document.getElementById('section-duration')! as HTMLInputElement).value = String(section.duration || '');
      (document.getElementById('section-order')! as HTMLInputElement).value = String(section.order);
    } else {
      (document.getElementById('section-order')! as HTMLInputElement).value = String(this.sections.length + 1);
    }

    // Form submission
    document.getElementById('section-form')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      await this.saveSection()
    })

    // Cancel button
    document.getElementById('cancel-section')?.addEventListener('click', () => {
      editor.style.display = 'none'
    })
  }

  showActivityEditor(sectionId: string) {
    const modal = document.createElement('div')
    modal.innerHTML = this.renderActivityEditor(sectionId)
    document.body.appendChild(modal)

    const typeSelect = document.getElementById('activity-type') as HTMLSelectElement
    typeSelect.addEventListener('change', () => {
      this.updateActivityFields(typeSelect.value as Activity['type'])
    })

    document.getElementById('activity-form')?.addEventListener('submit', async (e) => {
      e.preventDefault()
      await this.saveActivity()
      modal.remove()
    })

    document.getElementById('cancel-activity')?.addEventListener('click', () => {
      modal.remove()
    })
  }

  updateActivityFields(type: Activity['type']) {
    const container = document.getElementById('activity-fields')!

    let fields = ''

    switch(type) {
      case 'video_pause':
        fields = `
          <div class="form-group">
            <label>Pause Timestamp (seconds)</label>
            <input type="number" id="pause-timestamp" required />
          </div>
        `
        break

      case 'true_false':
        fields = `
          <div class="form-group">
            <label>Question</label>
            <input type="text" id="question" required />
          </div>
          <div class="form-group">
            <label>Correct Answer</label>
            <select id="correct-answer" required>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        `
        break

      case 'multiple_choice':
        fields = `
          <div class="form-group">
            <label>Question</label>
            <input type="text" id="question" required />
          </div>
          <div class="form-group">
            <label>Options (one per line)</label>
            <textarea id="options" rows="4" required placeholder="Option 1
Option 2
Option 3
Option 4"></textarea>
          </div>
          <div class="form-group">
            <label>Correct Answer (0-based index)</label>
            <input type="number" id="correct-answer" min="0" required />
          </div>
        `
        break

      case 'text_reading':
        fields = `
          <div class="form-group">
            <label>Text Pages (one per line)</label>
            <textarea id="text-pages" rows="6" required placeholder="Page 1 content...
Page 2 content..."></textarea>
          </div>
        `
        break
    }

    container.innerHTML = fields
  }

  async saveSection() {
    const id = (document.getElementById('section-id') as HTMLInputElement).value
    const data = {
      id: id || `section-${Date.now()}`,
      courseId: this.courseId,
      title: (document.getElementById('section-title') as HTMLInputElement).value,
      videoUrl: (document.getElementById('section-video') as HTMLInputElement).value || null,
      thumbnailUrl: (document.getElementById('section-thumbnail') as HTMLInputElement).value || null,
      duration: parseInt((document.getElementById('section-duration') as HTMLInputElement).value) || null,
      order: parseInt((document.getElementById('section-order') as HTMLInputElement).value)
    }

    try {
      const response = await fetch(
        id ? `/api/sections/${id}` : '/api/sections',
        {
          method: id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      )

      if (response.ok) {
        await this.loadSections()
        this.render()
      }
    } catch (error) {
      console.error('Error saving section:', error)
    }
  }

  async saveActivity() {
    const type = (document.getElementById('activity-type') as HTMLSelectElement).value as Activity['type']
    const sectionId = (document.getElementById('activity-section-id') as HTMLInputElement).value

    const data: any = {
      id: `activity-${Date.now()}`,
      sectionId,
      type,
      order: parseInt((document.getElementById('activity-order') as HTMLInputElement).value)
    }

    // Add type-specific fields
    switch(type) {
      case 'video_pause':
        data.pauseTimestamp = parseInt((document.getElementById('pause-timestamp') as HTMLInputElement).value)
        break

      case 'true_false':
        data.question = (document.getElementById('question') as HTMLInputElement).value
        data.correctAnswer = (document.getElementById('correct-answer') as HTMLSelectElement).value === 'true'
        break

      case 'multiple_choice':
        data.question = (document.getElementById('question') as HTMLInputElement).value
        data.options = (document.getElementById('options') as HTMLTextAreaElement).value.split('\n').filter(o => o.trim())
        data.correctAnswer = parseInt((document.getElementById('correct-answer') as HTMLInputElement).value)
        break

      case 'text_reading':
        data.textPages = (document.getElementById('text-pages') as HTMLTextAreaElement).value.split('\n').filter(p => p.trim())
        break
    }

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await this.loadSections()
        this.render()
      }
    } catch (error) {
      console.error('Error saving activity:', error)
    }
  }

  async deleteSection(id: string) {
    try {
      const response = await fetch(`/api/sections/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await this.loadSections()
        this.render()
      }
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }
}