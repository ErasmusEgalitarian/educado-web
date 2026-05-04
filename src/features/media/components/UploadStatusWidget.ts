import '../styles/upload-status-widget.css'
import { t } from '@/shared/i18n'
import { uploadManager, type UploadJob, type UploadJobStatus } from '@/features/media/services/upload-manager'

const SUCCESS_AUTO_DISMISS_MS = 5000
const ABORTED_AUTO_DISMISS_MS = 2000

function getJobStatusText(job: UploadJob) {
  if (job.status === 'uploading') {
    const progress = job.totalBytes > 0 ? Math.min(100, Math.round((job.uploadedBytes / job.totalBytes) * 100)) : 0
    return t('courses.home.mediaBank.upload.background.uploading', { progress })
  }

  if (job.status === 'finalizing') return t('courses.home.mediaBank.upload.background.finalizing')
  if (job.status === 'completed') return t('courses.home.mediaBank.upload.background.completed')
  if (job.status === 'aborted') return t('courses.home.mediaBank.upload.background.aborted')
  if (job.status === 'failed') return `${t('courses.home.mediaBank.upload.background.failed')}: ${job.error ?? '—'}`
  return t('courses.home.mediaBank.upload.background.started')
}

function getProgressWidth(job: UploadJob) {
  if (job.status === 'completed') return 100
  if (job.status === 'failed' || job.status === 'aborted') {
    return job.totalBytes > 0 ? Math.round((job.uploadedBytes / job.totalBytes) * 100) : 0
  }

  if (job.totalBytes <= 0) return 0
  return Math.min(100, Math.round((job.uploadedBytes / job.totalBytes) * 100))
}

function isTerminalStatus(status: UploadJobStatus) {
  return status === 'completed' || status === 'failed' || status === 'aborted'
}

export class UploadStatusWidget {
  private readonly container: HTMLElement
  private unsubscribe: (() => void) | null = null
  private jobs: UploadJob[] = []
  private dismissTimers = new Map<string, number>()

  constructor(container: HTMLElement) {
    this.container = container
  }

  mount() {
    this.container.classList.add('upload-status-widget')
    this.unsubscribe = uploadManager.subscribe((jobs) => {
      this.jobs = jobs
      this.syncTimers()
      this.render()
    })
  }

  unmount() {
    this.unsubscribe?.()
    this.unsubscribe = null
    this.dismissTimers.forEach((timer) => window.clearTimeout(timer))
    this.dismissTimers.clear()
    this.container.innerHTML = ''
  }

  private syncTimers() {
    const visibleJobIds = new Set(this.jobs.map((job) => job.localId))

    this.dismissTimers.forEach((timer, localId) => {
      if (visibleJobIds.has(localId)) return
      window.clearTimeout(timer)
      this.dismissTimers.delete(localId)
    })

    this.jobs.forEach((job) => {
      if (this.dismissTimers.has(job.localId)) {
        if (job.status !== 'completed' && job.status !== 'aborted') {
          window.clearTimeout(this.dismissTimers.get(job.localId))
          this.dismissTimers.delete(job.localId)
        }
        return
      }

      const delay = job.status === 'completed' ? SUCCESS_AUTO_DISMISS_MS : job.status === 'aborted' ? ABORTED_AUTO_DISMISS_MS : null
      if (delay == null) return

      const timer = window.setTimeout(() => {
        uploadManager.dismiss(job.localId)
        this.dismissTimers.delete(job.localId)
      }, delay)

      this.dismissTimers.set(job.localId, timer)
    })
  }

  private render() {
    this.container.innerHTML = this.jobs
      .map((job) => {
        const progress = getProgressWidth(job)
        const statusText = getJobStatusText(job)
        const showCancel = job.status === 'uploading'
        const showDismiss = isTerminalStatus(job.status)
        const dismissAriaLabel = t('courses.home.mediaBank.upload.background.dismiss')

        return `
          <section class="upload-status-card is-${job.status}">
            <div class="upload-status-card-header">
              <div>
                <p class="upload-status-card-title">${this.escapeHtml(job.filename)}</p>
                <p class="upload-status-card-subtitle">${this.escapeHtml(statusText)}</p>
              </div>
              ${showDismiss ? `<button type="button" class="upload-status-dismiss-btn" data-action="dismiss" data-local-id="${job.localId}" aria-label="${dismissAriaLabel}">×</button>` : ''}
            </div>

            <div class="upload-status-progress" aria-hidden="true">
              <div class="upload-status-progress-bar" style="width: ${progress}%"></div>
            </div>

            <div class="upload-status-card-footer">
              <span class="upload-status-meta">${job.completedParts}/${Math.max(job.totalParts, 1)}</span>
              ${showCancel ? `<button type="button" class="upload-status-action-btn is-secondary" data-action="cancel" data-local-id="${job.localId}">${t('courses.home.mediaBank.upload.background.cancel')}</button>` : ''}
            </div>
          </section>
        `
      })
      .join('')

    this.container.querySelectorAll<HTMLButtonElement>('[data-action="cancel"]').forEach((button) => {
      button.addEventListener('click', () => {
        const localId = button.dataset.localId
        if (!localId) return
        void uploadManager.abort(localId)
      })
    })

    this.container.querySelectorAll<HTMLButtonElement>('[data-action="dismiss"]').forEach((button) => {
      button.addEventListener('click', () => {
        const localId = button.dataset.localId
        if (!localId) return
        uploadManager.dismiss(localId)
      })
    })
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}
