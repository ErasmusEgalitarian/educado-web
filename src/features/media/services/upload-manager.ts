import {
  mediaApi,
  type InitChunkedResponse,
  type MediaKind,
  type MediaResponse,
  type UpdateMediaPayload,
  type UploadPartResponse,
} from '@/features/media/api/media.api'
import { ApiError } from '@/shared/api/http'
import { t } from '@/shared/i18n'

export type UploadJobStatus = 'queued' | 'uploading' | 'finalizing' | 'completed' | 'failed' | 'aborted'
export type UploadJobSource = 'media-bank' | 'course-cover' | 'lesson-video' | 'exercise-image'

export interface UploadJobContext {
  targetId?: string
  [key: string]: string | number | boolean | null | undefined
}

export interface UploadJobMetadataDraft extends UpdateMediaPayload {}

export interface UploadJob {
  localId: string
  filename: string
  kind: MediaKind
  totalBytes: number
  uploadedBytes: number
  totalParts: number
  completedParts: number
  status: UploadJobStatus
  error?: string
  mediaId?: string
  startedAt: number
  finishedAt?: number
  result?: MediaResponse
  metadataDraft: UploadJobMetadataDraft
  source: UploadJobSource
  context?: UploadJobContext
}

type UploadStateListener = (jobs: UploadJob[]) => void
type UploadEventType = 'completed' | 'failed' | 'aborted'
type UploadEventListener = (job: UploadJob) => void

interface UploadJobInternal {
  job: UploadJob
  file: File
  controller: AbortController
  emittedTerminalEvent: boolean
}

function cloneJob(job: UploadJob): UploadJob {
  return {
    ...job,
    metadataDraft: { ...job.metadataDraft },
    context: job.context ? { ...job.context } : undefined,
    result: job.result ? { ...job.result } : undefined,
  }
}

function resolveMediaId(media: Pick<MediaResponse, 'id' | '_id' | 'gridFsId'>) {
  return media.id ?? media._id ?? media.gridFsId
}

class UploadManager {
  private jobs = new Map<string, UploadJobInternal>()
  private listeners = new Set<UploadStateListener>()
  private eventListeners: Record<UploadEventType, Set<UploadEventListener>> = {
    completed: new Set(),
    failed: new Set(),
    aborted: new Set(),
  }
  private beforeUnloadRegistered = false

  enqueue(
    file: File,
    kind: MediaKind,
    metadataDraft: UploadJobMetadataDraft,
    source: UploadJobSource,
    context?: UploadJobContext,
  ) {
    const localId = crypto.randomUUID()
    const controller = new AbortController()

    const job: UploadJob = {
      localId,
      filename: file.name,
      kind,
      totalBytes: file.size,
      uploadedBytes: 0,
      totalParts: kind === 'image' ? 1 : 0,
      completedParts: 0,
      status: 'queued',
      startedAt: Date.now(),
      metadataDraft: { ...metadataDraft },
      source,
      context: context ? { ...context } : undefined,
    }

    this.jobs.set(localId, {
      job,
      file,
      controller,
      emittedTerminalEvent: false,
    })

    this.emitState()
    void this.run(localId)
    return localId
  }

  async abort(localId: string) {
    const upload = this.jobs.get(localId)
    if (!upload) return
    if (upload.job.status === 'completed' || upload.job.status === 'failed' || upload.job.status === 'aborted') return

    upload.controller.abort()

    if (upload.job.kind === 'video' && upload.job.mediaId) {
      try {
        await mediaApi.abortVideoUpload(upload.job.mediaId)
      } catch {
        /* ignore */
      }
    }

    upload.job.status = 'aborted'
    upload.job.finishedAt = Date.now()
    this.emitState()
    this.emitEvent('aborted', upload.job)
  }

  dismiss(localId: string) {
    const upload = this.jobs.get(localId)
    if (!upload) return

    if (upload.job.status === 'queued' || upload.job.status === 'uploading' || upload.job.status === 'finalizing') {
      return
    }

    this.jobs.delete(localId)
    this.emitState()
  }

  subscribe(listener: UploadStateListener) {
    this.listeners.add(listener)
    listener(this.getActive())

    return () => {
      this.listeners.delete(listener)
    }
  }

  getActive() {
    return Array.from(this.jobs.values())
      .map((entry) => cloneJob(entry.job))
      .sort((first, second) => second.startedAt - first.startedAt)
  }

  getById(localId: string) {
    const upload = this.jobs.get(localId)
    return upload ? cloneJob(upload.job) : null
  }

  on(event: UploadEventType, listener: UploadEventListener) {
    this.eventListeners[event].add(listener)
    return () => {
      this.eventListeners[event].delete(listener)
    }
  }

  private emitState() {
    const jobs = this.getActive()
    this.listeners.forEach((listener) => listener(jobs))
    this.syncBeforeUnload()
  }

  private emitEvent(event: UploadEventType, job: UploadJob) {
    const upload = this.jobs.get(job.localId)
    if (!upload || upload.emittedTerminalEvent) return

    if (event === 'completed' || event === 'failed' || event === 'aborted') {
      upload.emittedTerminalEvent = true
    }

    const snapshot = cloneJob(job)
    this.eventListeners[event].forEach((listener) => listener(snapshot))
  }

  private syncBeforeUnload() {
    const hasBlockingUploads = Array.from(this.jobs.values()).some(({ job }) => job.status === 'uploading' || job.status === 'finalizing')

    if (hasBlockingUploads && !this.beforeUnloadRegistered) {
      window.addEventListener('beforeunload', this.handleBeforeUnload)
      this.beforeUnloadRegistered = true
      return
    }

    if (!hasBlockingUploads && this.beforeUnloadRegistered) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload)
      this.beforeUnloadRegistered = false
    }
  }

  private readonly handleBeforeUnload = (event: BeforeUnloadEvent) => {
    const message = t('courses.home.mediaBank.upload.background.confirmLeave')
    event.preventDefault()
    event.returnValue = message
    return message
  }

  private setFailed(job: UploadJob, error: unknown) {
    if (job.status === 'aborted') return

    job.status = 'failed'
    job.error = this.getErrorMessage(error)
    job.finishedAt = Date.now()
    this.emitState()
    this.emitEvent('failed', job)
  }

  private async run(localId: string) {
    const upload = this.jobs.get(localId)
    if (!upload) return

    try {
      if (upload.job.kind === 'video') {
        await this.runVideoUpload(upload)
      } else {
        await this.runImageUpload(upload)
      }
    } catch (error) {
      if (upload.controller.signal.aborted || upload.job.status === 'aborted') {
        if (upload.job.status !== 'aborted') {
          upload.job.status = 'aborted'
          upload.job.finishedAt = Date.now()
          this.emitState()
          this.emitEvent('aborted', upload.job)
        }
        return
      }

      this.setFailed(upload.job, error)
    }
  }

  private async runVideoUpload(upload: UploadJobInternal) {
    const { job, file, controller } = upload
    job.status = 'uploading'
    this.emitState()

    let init: InitChunkedResponse | null = null
    const parts: UploadPartResponse[] = []

    try {
      init = await mediaApi.initVideoUpload(file, { signal: controller.signal })
      job.mediaId = init.id
      job.totalParts = init.totalParts
      this.emitState()

      for (let partNumber = 1; partNumber <= init.totalParts; partNumber++) {
        if (controller.signal.aborted) {
          throw new DOMException('Aborted', 'AbortError')
        }

        const start = (partNumber - 1) * init.chunkSize
        const end = Math.min(start + init.chunkSize, file.size)
        const chunk = file.slice(start, end)

        const part = await mediaApi.uploadVideoPart(init.id, partNumber, chunk, file.name, { signal: controller.signal })
        parts.push(part)
        job.completedParts = parts.length
        job.uploadedBytes += chunk.size
        this.emitState()
      }

      job.status = 'finalizing'
      this.emitState()

      const completedBinary = await mediaApi.completeVideoUpload(init.id, parts, { signal: controller.signal })
      await this.completeMetadata(upload, completedBinary)
    } catch (error) {
      if ((controller.signal.aborted || error instanceof DOMException) && job.mediaId) {
        try {
          await mediaApi.abortVideoUpload(job.mediaId)
        } catch {
          /* ignore */
        }
      } else if (init?.id) {
        try {
          await mediaApi.abortVideoUpload(init.id)
        } catch {
          /* ignore */
        }
      }

      throw error
    }
  }

  private async runImageUpload(upload: UploadJobInternal) {
    const { job, file, controller } = upload
    job.status = 'uploading'
    this.emitState()

    const uploadedBinary = await mediaApi.uploadImageBinary(file, { signal: controller.signal })
    job.mediaId = resolveMediaId(uploadedBinary)
    job.totalParts = 1
    job.completedParts = 1
    job.uploadedBytes = file.size
    job.status = 'finalizing'
    this.emitState()

    await this.completeMetadata(upload, uploadedBinary)
  }

  private async completeMetadata(upload: UploadJobInternal, uploadedBinary: MediaResponse) {
    const { job } = upload
    const mediaId = resolveMediaId(uploadedBinary)

    if (!mediaId) {
      throw new Error('Missing media id from upload response')
    }

    job.mediaId = mediaId

    try {
      const result = await mediaApi.createMediaMetadata(mediaId, job.kind, job.metadataDraft)
      job.status = 'completed'
      job.result = result
      job.finishedAt = Date.now()
      job.uploadedBytes = job.totalBytes
      if (job.totalParts === 0) {
        job.totalParts = 1
      }
      if (job.completedParts === 0) {
        job.completedParts = job.totalParts
      }
      this.emitState()
      this.emitEvent('completed', job)
    } catch (error) {
      try {
        await mediaApi.deleteMedia(mediaId, job.kind)
      } catch {
        /* ignore */
      }

      throw error
    }
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof ApiError) {
      if (error.status === 401) return t('courses.home.mediaBank.upload.errors.unauthorized')
      if (error.status === 403) return t('courses.home.mediaBank.upload.errors.forbidden')

      if (error.status === 422) {
        if (error.code === 'INVALID_IMAGE_TYPE' || error.code === 'INVALID_VIDEO_TYPE') {
          return t('courses.home.mediaBank.upload.errors.invalidType')
        }

        if (error.code === 'VALIDATION_ERROR') {
          return t('courses.home.mediaBank.upload.errors.validation')
        }
      }
    }

    if (error instanceof Error && error.message) {
      return error.message
    }

    return t('courses.home.mediaBank.upload.background.failed')
  }
}

export const uploadManager = new UploadManager()
