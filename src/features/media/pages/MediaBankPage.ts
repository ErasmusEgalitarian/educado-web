import '../styles/media-bank.css'
import '../styles/media-bank-upload.css'
import '../styles/media-bank-library.css'
import { mediaApi, type MediaResponse } from '@/features/media/api/media.api'
import { getCurrentUser } from '@/shared/api/auth-session'
import { ApiError } from '@/shared/api/http'
import { t } from '@/shared/i18n'
import { toast } from '@/shared/ui/toast'

interface MediaItem {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: Date
  kind: 'image' | 'video'
  status: 'ACTIVE' | 'INACTIVE'
  title?: string
  altText?: string
  description?: string
}

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MEDIA_BANK_MODE_STORAGE_KEY = 'educado.mediaBank.mode'

export class MediaBankPage {
  private container: HTMLElement
  private readonly handleViewportResize = () => {
    if (!this.container.isConnected) {
      window.removeEventListener('resize', this.handleViewportResize)
      return
    }

    this.updateViewportLayoutMetrics()
  }
  private mediaMode: 'upload' | 'library' = this.getSavedMediaMode()
  private selectedDetailsRequestId = 0
  private mediaItems: MediaItem[] = []
  private selectedItem: MediaItem | null = null
  private librarySort: 'recent' | 'oldest' = 'recent'
  private librarySearchQuery = ''
  private pendingUploadFile: File | null = null
  private isSubmittingUpload = false
  private uploadPreviewUrl: string | null = null
  private mediaPreviewUrls = new Map<string, string>()
  private uploadDraft = {
    title: '',
    altText: '',
    description: '',
  }

  constructor(container: HTMLElement) {
    this.container = container
  }

  async init() {
    this.render()
    this.setupEventListeners()
    window.addEventListener('resize', this.handleViewportResize)
    this.updateViewportLayoutMetrics()
    await this.loadMediaItems()
  }

  private render() {
    this.container.innerHTML = `
      <div id="media-content"></div>
    `

    this.renderMediaContent()
  }

  private renderMediaContent() {
    const contentContainer = this.container.querySelector('#media-content') as HTMLElement
    if (!contentContainer) return

    this.renderMediaBank(contentContainer)
  }

  private renderMediaBank(container: HTMLElement) {
    const isUploadMode = this.mediaMode === 'upload'

    container.innerHTML = `
      <div class="frame-parent">
        <div class="tabs-component media-page-tabs">
          <button type="button" id="upload-tab" class="component-2 ${isUploadMode ? 'is-active' : ''}">
            <div class="tab-wrapper"><div class="tab">${t('courses.home.mediaBank.internalTabs.upload')}</div></div>
          </button>
          <button type="button" id="library-tab" class="component-3 ${!isUploadMode ? 'is-active' : ''}">
            <div class="tab-wrapper"><div class="tab">${t('courses.home.mediaBank.internalTabs.library')}</div></div>
          </button>
        </div>

        ${isUploadMode ? this.getUploadTemplate() : this.getLibraryTemplate()}
      </div>
    `

    this.setupMediaEventListeners()
    this.updateViewportLayoutMetrics()
  }

  private updateViewportLayoutMetrics() {
    const frameParent = this.container.querySelector('.frame-parent') as HTMLElement | null
    const currentLayout = this.container.querySelector(this.mediaMode === 'upload' ? '.upload-layout' : '.library-layout') as HTMLElement | null
    if (!frameParent || !currentLayout) return

    const viewportHeight = window.innerHeight
    const layoutTop = currentLayout.getBoundingClientRect().top
    const bottomSpacing = 16
    const availableHeight = Math.max(460, Math.floor(viewportHeight - layoutTop - bottomSpacing))

    frameParent.style.setProperty('--media-layout-height', `${availableHeight}px`)
  }

  private setupEventListeners() {
    // Global event listeners if needed
  }

  private setupMediaEventListeners() {
    const uploadTab = this.container.querySelector('#upload-tab')
    uploadTab?.addEventListener('click', () => {
      this.setMediaMode('upload')
      this.renderMediaBank(this.container.querySelector('#media-content') as HTMLElement)
    })

    const libraryTab = this.container.querySelector('#library-tab')
    libraryTab?.addEventListener('click', () => {
      this.setMediaMode('library')
      this.renderMediaBank(this.container.querySelector('#media-content') as HTMLElement)
      this.renderGallery()
    })

    const libraryAddMediaButton = this.container.querySelector('#library-add-media-btn')
    libraryAddMediaButton?.addEventListener('click', () => {
      this.setMediaMode('upload')
      this.renderMediaBank(this.container.querySelector('#media-content') as HTMLElement)
    })

    const uploadClickButton = this.container.querySelector('#upload-click-btn')
    uploadClickButton?.addEventListener('click', () => this.handleNewMedia())

    const uploadChangeButton = this.container.querySelector('#upload-change-btn')
    uploadChangeButton?.addEventListener('click', () => this.handleNewMedia())

    const uploadClearPreviewButton = this.container.querySelector('#upload-clear-preview-btn')
    uploadClearPreviewButton?.addEventListener('click', () => this.clearPendingUploadFile())

    const uploadCancelButton = this.container.querySelector('#upload-cancel-btn')
    uploadCancelButton?.addEventListener('click', () => {
      this.resetUploadForm()
    })

    const uploadSubmitButton = this.container.querySelector('#upload-submit-btn')
    uploadSubmitButton?.addEventListener('click', () => {
      void this.handleUploadSubmit()
    })

    const uploadInput = this.container.querySelector('#upload-input') as HTMLInputElement | null
    uploadInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) {
        this.pendingUploadFile = file
        this.updateUploadFileInfo(file)
      }
    })

    const uploadTitleInput = this.container.querySelector('#upload-field-title') as HTMLInputElement | null
    uploadTitleInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      this.uploadDraft.title = target.value
      const counter = this.container.querySelector('#upload-title-counter') as HTMLElement | null
      if (counter) counter.textContent = target.value.length.toString()
      this.updateUploadSubmitState()
    })

    const uploadAltInput = this.container.querySelector('#upload-field-alt-text') as HTMLTextAreaElement | null
    uploadAltInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement
      this.uploadDraft.altText = target.value
      const counter = this.container.querySelector('#upload-alt-counter') as HTMLElement | null
      if (counter) counter.textContent = target.value.length.toString()
      this.updateUploadSubmitState()
    })

    const uploadDescriptionInput = this.container.querySelector('#upload-field-description') as HTMLTextAreaElement | null
    uploadDescriptionInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement
      this.uploadDraft.description = target.value
      const counter = this.container.querySelector('#upload-desc-counter') as HTMLElement | null
      if (counter) counter.textContent = target.value.length.toString()
      this.updateUploadSubmitState()
    })

    const uploadDropzone = this.container.querySelector('#upload-dropzone') as HTMLElement | null
    uploadDropzone?.addEventListener('dragover', (event) => {
      event.preventDefault()
      uploadDropzone.classList.add('is-drag-over')
    })

    uploadDropzone?.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('is-drag-over')
    })

    uploadDropzone?.addEventListener('drop', (event) => {
      event.preventDefault()
      uploadDropzone.classList.remove('is-drag-over')
      const file = event.dataTransfer?.files?.[0]
      if (file) {
        this.pendingUploadFile = file
        this.updateUploadFileInfo(file)
      }
    })

    const sortSelect = this.container.querySelector('#filter-sort-select') as HTMLSelectElement | null
    sortSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement
      this.librarySort = target.value === 'oldest' ? 'oldest' : 'recent'
      this.renderGallery()
    })

    const searchInput = this.container.querySelector('#filter-search-input') as HTMLInputElement | null
    searchInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      this.librarySearchQuery = target.value
      this.renderGallery()
    })

    const deleteBtn = this.container.querySelector('#delete-file-btn')
    deleteBtn?.addEventListener('click', () => {
      if (this.selectedItem) void this.deleteMediaItem(this.selectedItem.id)
    })

    const detailsDeleteButton = this.container.querySelector('#details-delete-btn')
    detailsDeleteButton?.addEventListener('click', () => {
      if (this.selectedItem) void this.deleteMediaItem(this.selectedItem.id)
    })

    const detailsCancelButton = this.container.querySelector('#details-cancel-btn')
    detailsCancelButton?.addEventListener('click', () => {
      this.clearSelectedMedia()
    })

    const detailsUpdateButton = this.container.querySelector('#details-update-btn')
    detailsUpdateButton?.addEventListener('click', () => {
      void this.updateSelectedMedia()
    })

    this.updateLibraryFooterVisibility()

    const titleInput = this.container.querySelector('#field-title') as HTMLInputElement
    const altInput = this.container.querySelector('#field-alt-text') as HTMLTextAreaElement
    const descInput = this.container.querySelector('#field-description') as HTMLTextAreaElement

    titleInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      const counter = this.container.querySelector('#title-counter') as HTMLElement
      if (counter) counter.textContent = target.value.length.toString()
    })

    altInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement
      const counter = this.container.querySelector('#alt-counter') as HTMLElement
      if (counter) counter.textContent = target.value.length.toString()
    })

    descInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement
      const counter = this.container.querySelector('#desc-counter') as HTMLElement
      if (counter) counter.textContent = target.value.length.toString()
    })

    if (this.mediaMode === 'upload') {
      if (this.pendingUploadFile) {
        this.updateUploadFileInfo(this.pendingUploadFile)
      } else {
        this.updateUploadSubmitState()
      }
    }
  }

  private async selectMediaItem(item: MediaItem) {
    const requestId = ++this.selectedDetailsRequestId
    this.selectedItem = item
    const fileInfoEmpty = this.container.querySelector('#file-info-empty') as HTMLElement | null
    const fileInfoContent = this.container.querySelector('#file-info-content') as HTMLElement | null

    if (fileInfoEmpty) fileInfoEmpty.style.display = 'none'
    if (fileInfoContent) fileInfoContent.style.display = 'block'

    const fileNameDisplay = this.container.querySelector('#file-name-display') as HTMLElement
    const fileDateDisplay = this.container.querySelector('#file-date-display') as HTMLElement
    const fileSizeDisplay = this.container.querySelector('#file-size-display') as HTMLElement
    const fileKindDisplay = this.container.querySelector('#file-kind-display') as HTMLElement
    const filePreviewImage = this.container.querySelector('#file-preview') as HTMLImageElement | null
    const filePreviewVideo = this.container.querySelector('#file-preview-video') as HTMLVideoElement | null

    if (fileNameDisplay) {
      const displayName = item.title || item.name
      fileNameDisplay.textContent = displayName
      fileNameDisplay.title = displayName
    }

    if (fileDateDisplay) {
      const dateValue = item.createdAt.toLocaleString()
      fileDateDisplay.textContent = dateValue
      fileDateDisplay.title = dateValue
    }

    if (fileSizeDisplay) {
      const sizeValue = this.formatFileSize(item.size)
      fileSizeDisplay.textContent = sizeValue
      fileSizeDisplay.title = sizeValue
    }

    if (fileKindDisplay) {
      const kindValue = item.kind === 'video' ? 'Vídeo' : 'Imagem'
      fileKindDisplay.textContent = kindValue
      fileKindDisplay.title = kindValue
    }
    if (item.kind === 'video') {
      if (filePreviewImage) {
        filePreviewImage.removeAttribute('src')
        filePreviewImage.style.display = 'none'
      }

      if (filePreviewVideo) {
        filePreviewVideo.src = item.url
        filePreviewVideo.style.display = 'block'
      }
    } else {
      if (filePreviewVideo) {
        filePreviewVideo.removeAttribute('src')
        filePreviewVideo.style.display = 'none'
      }

      if (filePreviewImage) {
        filePreviewImage.src = item.url
        filePreviewImage.style.display = 'block'
      }
    }

    const titleInput = this.container.querySelector('#field-title') as HTMLInputElement
    const altInput = this.container.querySelector('#field-alt-text') as HTMLTextAreaElement
    const descInput = this.container.querySelector('#field-description') as HTMLTextAreaElement

    if (titleInput) titleInput.value = item.title || ''
    if (altInput) altInput.value = item.altText || ''
    if (descInput) descInput.value = item.description || ''

    const titleCounter = this.container.querySelector('#title-counter') as HTMLElement
    const altCounter = this.container.querySelector('#alt-counter') as HTMLElement
    const descCounter = this.container.querySelector('#desc-counter') as HTMLElement

    if (titleCounter) titleCounter.textContent = (item.title?.length || 0).toString()
    if (altCounter) altCounter.textContent = (item.altText?.length || 0).toString()
    if (descCounter) descCounter.textContent = (item.description?.length || 0).toString()

    this.updateLibraryFooterVisibility()

    try {
      const persistedMetadata = await mediaApi.getMediaById(item.id, item.kind)
      if (requestId !== this.selectedDetailsRequestId) return

      const persistedCreatedAt = new Date(persistedMetadata.createdAt)
      item.name = persistedMetadata.title || persistedMetadata.filename || item.name
      item.title = persistedMetadata.title
      item.altText = persistedMetadata.altText
      item.description = persistedMetadata.description
      item.type = persistedMetadata.contentType || item.type
      item.size = persistedMetadata.size || item.size
      item.status = persistedMetadata.status || item.status
      if (!Number.isNaN(persistedCreatedAt.getTime())) {
        item.createdAt = persistedCreatedAt
      }

      const refreshedDisplayName = item.title || t('courses.home.mediaBank.library.untitled')
      if (fileNameDisplay) {
        fileNameDisplay.textContent = refreshedDisplayName
        fileNameDisplay.title = refreshedDisplayName
      }

      if (fileDateDisplay) {
        const refreshedDateValue = item.createdAt.toLocaleString()
        fileDateDisplay.textContent = refreshedDateValue
        fileDateDisplay.title = refreshedDateValue
      }

      if (fileSizeDisplay) {
        const refreshedSizeValue = this.formatFileSize(item.size)
        fileSizeDisplay.textContent = refreshedSizeValue
        fileSizeDisplay.title = refreshedSizeValue
      }

      if (titleInput) titleInput.value = item.title || ''
      if (altInput) altInput.value = item.altText || ''
      if (descInput) descInput.value = item.description || ''

      if (titleCounter) titleCounter.textContent = (item.title?.length || 0).toString()
      if (altCounter) altCounter.textContent = (item.altText?.length || 0).toString()
      if (descCounter) descCounter.textContent = (item.description?.length || 0).toString()

      this.renderGallery()
    } catch {
      // keep current item details if metadata fetch fails
    }
  }

  private async loadMediaItems() {
    try {
      const currentUser = getCurrentUser()
      const listResponse =
        currentUser?.role === 'ADMIN' ? await mediaApi.listAdminMedia({ page: 1, limit: 100 }) : await mediaApi.listMyMedia({ page: 1, limit: 100 })

      this.clearMediaPreviewUrls()
      this.mediaItems = listResponse.items.map((media) => this.mapMediaResponseToItem(media))
      await this.loadMediaPreviews(this.mediaItems)
      await this.hydrateMediaMetadata(this.mediaItems)
    } catch {
      this.mediaItems = []
      toast(t('courses.home.mediaBank.upload.listError'), 'error')
    }

    this.renderGallery()
  }

  private renderGallery() {
    const galleryContainer = this.container.querySelector('#media-gallery') as HTMLElement
    if (!galleryContainer) return

    const displayedItems = this.getDisplayedMediaItems()

    const countDisplay = this.container.querySelector('#media-count') as HTMLElement
    if (countDisplay) {
      countDisplay.textContent = t('courses.home.mediaBank.library.showingCount', {
        shown: displayedItems.length,
        total: this.mediaItems.length,
      })
    }

    const thumbnailsHtml = displayedItems
      .map(
        (item) => `
      <div class="media-gallery-item">
        <div class="media-thumbnail ${this.selectedItem?.id === item.id ? 'is-selected' : ''}" data-media-id="${item.id}">
          ${
            item.kind === 'video'
              ? `<video src="${item.url}" class="media-thumbnail-video" preload="metadata" muted playsinline></video>`
              : `<img src="${item.url}" alt="${item.altText || item.name}">`
          }
        </div>
        <div class="media-item-name" title="${item.title || item.name}">${item.title || item.name}</div>
      </div>
    `,
      )
      .join('')

    const placeholderDiv = galleryContainer.querySelector('#media-placeholder') as HTMLElement
    if (placeholderDiv) {
      placeholderDiv.innerHTML = thumbnailsHtml

      placeholderDiv.querySelectorAll('.media-thumbnail-video').forEach((videoElement) => {
        this.setVideoThumbnailFrame(videoElement as HTMLVideoElement)
      })

      placeholderDiv.querySelectorAll('.media-thumbnail').forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
          const mediaId = thumbnail.getAttribute('data-media-id')
          const item = this.mediaItems.find((m) => m.id === mediaId)
          if (item) {
            void this.selectMediaItem(item)
            placeholderDiv.querySelectorAll('.media-thumbnail').forEach((t) => {
              ;(t as HTMLElement).classList.remove('is-selected')
            })
            ;(thumbnail as HTMLElement).classList.add('is-selected')
          }
        })
      })
    }
  }

  private setVideoThumbnailFrame(videoElement: HTMLVideoElement, frameInSeconds = 5) {
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

  private handleNewMedia() {
    const uploadInput = this.container.querySelector('#upload-input') as HTMLInputElement | null
    if (uploadInput) {
      uploadInput.click()
      return
    }

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime'
    fileInput.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        this.pendingUploadFile = file
        this.updateUploadFileInfo(file)
      }
    })
    fileInput.click()
  }

  private getUploadTemplate() {
    const hasSelectedFile = Boolean(this.pendingUploadFile)

    return `
      <div class="content upload-layout">
        <div class="database upload-database">
          <div class="img-section-icon upload-dropzone-panel" id="upload-dropzone">
            <div id="upload-dropzone-empty" class="upload-dropzone-empty" style="display: ${hasSelectedFile ? 'none' : 'flex'};">
              <div class="arraste-e-solte">${t('courses.home.mediaBank.upload.dropTitle')}</div>
              <div class="ou">${t('courses.home.mediaBank.upload.or')}</div>
              <button type="button" class="buttons-upload" id="upload-click-btn">
                <div class="file-upload">
                  <div class="vector">
                    <svg class="vector-icon2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                </div>
                <b class="label-upload">${t('courses.home.mediaBank.upload.clickToUpload')}</b>
              </button>
              <div class="upload-file-name" id="upload-file-name">${t('courses.home.mediaBank.upload.noFileSelected')}</div>
            </div>

            <div id="upload-dropzone-preview" class="upload-dropzone-preview" style="display: ${hasSelectedFile ? 'flex' : 'none'};">
              <button type="button" class="upload-clear-preview-btn" id="upload-clear-preview-btn" aria-label="Remover arquivo selecionado">×</button>
              <div class="upload-selected-chip">Selecionado</div>
              <img class="upload-dropzone-preview-media" id="upload-dropzone-image" src="" alt="" style="display: none;">
              <video class="upload-dropzone-preview-media" id="upload-dropzone-video" src="" style="display: none;" controls preload="metadata" muted playsinline></video>
              <div class="upload-file-name upload-dropzone-file-name" id="upload-dropzone-file-name">${t('courses.home.mediaBank.upload.noFileSelected')}</div>
              <button type="button" class="buttons-upload upload-change-button" id="upload-change-btn">
                <b class="label-upload">${t('courses.home.mediaBank.upload.clickToUpload')}</b>
              </button>
            </div>

            <div class="upload-dropzone-input-wrap">
              <input id="upload-input" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" hidden>
            </div>
          </div>

          <div class="file-details upload-file-details">
            <b class="detalhes-do-anexo">${t('courses.home.mediaBank.upload.sidebarTitle')}</b>
            <div class="img-file-info">
              <div class="date" id="upload-file-summary">${t('courses.home.mediaBank.upload.noFileSelected')}</div>
            </div>
            <div class="file-details-child"></div>

            <div class="description">
              <div class="input">
                <div class="title-wrapper">
                  <b class="title"><span>${t('courses.home.mediaBank.library.fields.title')} </span><span class="span">*</span></b>
                </div>
                <div class="content3">
                  <div class="text3">
                    <input
                      type="text"
                      class="input-text"
                      id="upload-field-title"
                      placeholder="${t('courses.home.mediaBank.library.fields.titlePlaceholder')}"
                      maxlength="50"
                      value="${this.uploadDraft.title}"
                    >
                  </div>
                </div>
                <div class="hint-text"><span id="upload-title-counter">${this.uploadDraft.title.length}</span>/50 ${t('courses.home.mediaBank.library.characters')}</div>
              </div>

              <div class="input">
                <div class="title-parent">
                  <b class="title"><span>${t('courses.home.mediaBank.library.fields.altText')} </span><span class="span">*</span></b>
                </div>
                <div class="content3">
                  <div class="text3">
                    <textarea
                      class="input-text"
                      id="upload-field-alt-text"
                      placeholder="${t('courses.home.mediaBank.library.fields.altTextPlaceholder')}"
                      maxlength="125"
                      rows="3"
                    >${this.uploadDraft.altText}</textarea>
                  </div>
                </div>
                <div class="hint-text"><span id="upload-alt-counter">${this.uploadDraft.altText.length}</span>/125 ${t('courses.home.mediaBank.library.characters')}</div>
              </div>

              <div class="input">
                <div class="title-wrapper">
                  <b class="title"><span>${t('courses.home.mediaBank.library.fields.description')} </span><span class="span">*</span></b>
                </div>
                <div class="content3">
                  <div class="text3">
                    <textarea
                      class="input-text"
                      id="upload-field-description"
                      placeholder="${t('courses.home.mediaBank.library.fields.descriptionPlaceholder')}"
                      maxlength="200"
                      rows="4"
                    >${this.uploadDraft.description}</textarea>
                  </div>
                </div>
                <div class="hint-text"><span id="upload-desc-counter">${this.uploadDraft.description.length}</span>/200 ${t('courses.home.mediaBank.library.characters')}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="frame-group upload-actions upload-fixed-footer">
          <button type="button" id="upload-cancel-btn" class="cancelar-wrapper">
            <b class="cancelar">${t('courses.home.mediaBank.upload.cancel')}</b>
          </button>
          <button type="button" id="upload-submit-btn" class="buttons2 ${this.shouldEnableUploadSubmit() ? 'is-enabled' : ''}" ${this.shouldEnableUploadSubmit() ? '' : 'disabled'}>
            <b class="label-upload">${this.isSubmittingUpload ? t('courses.home.mediaBank.upload.submitting') : t('courses.home.mediaBank.upload.addMedia')}</b>
          </button>
        </div>
      </div>
    `
  }

  private getLibraryTemplate() {
    return `
      <div class="content library-layout">
        <div class="content-parent">
          <div class="library-topbar-left">
            <label class="content2" for="filter-sort-select">
              <div class="home"></div>
              <div class="text">
                <div class="label">label</div>
                <select id="filter-sort-select" class="media-control-input media-sort-input">
                  <option value="recent" ${this.librarySort === 'recent' ? 'selected' : ''}>${t('courses.home.mediaBank.library.sortRecent')}</option>
                  <option value="oldest" ${this.librarySort === 'oldest' ? 'selected' : ''}>${t('courses.home.mediaBank.library.sortOldest')}</option>
                </select>
              </div>
              <div class="keyboard-arrow-down">
                <div class="vector">
                  <svg class="vector-icon2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </label>

            <label class="content-search" for="filter-search-input">
              <div class="home"></div>
              <div class="text">
                <div class="label">label</div>
                <input
                  id="filter-search-input"
                  type="text"
                  class="media-control-input"
                  placeholder="${t('courses.home.mediaBank.library.searchMedia')}"
                  value="${this.librarySearchQuery}"
                >
              </div>
              <div class="keyboard-arrow-down">
                <div class="vector">
                  <svg class="vector-icon3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
              </div>
            </label>
          </div>

          <button type="button" class="buttons2 is-enabled library-add-media-btn" id="library-add-media-btn">
            <b class="label-upload">${t('courses.home.mediaBank.upload.addMedia')}</b>
          </button>
        </div>

        <div class="database">
          <div class="img-section-icon" id="media-gallery">
            <div class="gallery-grid" id="media-placeholder">
              <svg viewBox="0 0 200 200" fill="none" stroke="#c1cfd7" stroke-width="2">
                <rect x="10" y="10" width="180" height="180" rx="4"></rect>
                <circle cx="60" cy="60" r="15"></circle>
                <path d="M10 150l60-80 60 70 70-90"></path>
              </svg>
            </div>
            <div class="gallery-meta" id="media-count">${t('courses.home.mediaBank.library.showingCount', { shown: 0, total: 0 })}</div>
          </div>

          <div class="file-details" id="file-details-panel">
            <b class="detalhes-do-anexo">${t('courses.home.mediaBank.library.attachmentDetails')}</b>

            <div class="img-file-info" id="file-info-empty">
              <p style="color: #809cad; font-size: 14px;">${t('courses.home.mediaBank.library.selectMediaHint')}</p>
            </div>

            <div id="file-info-content" style="display: none;">
              <div class="img-file-info">
                <div class="file-information">
                  <div class="file-name" id="file-name-display">${t('courses.home.mediaBank.library.untitled')}</div>
                  <div class="date" id="file-kind-display">—</div>
                  <div class="date" id="file-date-display">—</div>
                  <div class="date" id="file-size-display">—</div>
                </div>
              </div>
              <div class="file-details-child"></div>
              <div class="description">
                <div class="input">
                  <div class="title-wrapper">
                    <b class="title"><span>${t('courses.home.mediaBank.library.fields.title')} </span><span class="span">*</span></b>
                  </div>
                  <div class="content3">
                    <div class="text3">
                      <input type="text" class="input-text" id="field-title" placeholder="${t('courses.home.mediaBank.library.fields.titlePlaceholder')}" maxlength="50">
                    </div>
                  </div>
                  <div class="hint-text"><span id="title-counter">0</span>/50 ${t('courses.home.mediaBank.library.characters')}</div>
                </div>

                <div class="input">
                  <div class="title-parent">
                    <b class="title"><span>${t('courses.home.mediaBank.library.fields.altText')} </span><span class="span">*</span></b>
                  </div>
                  <div class="content3">
                    <div class="text3">
                      <textarea class="input-text" id="field-alt-text" placeholder="${t('courses.home.mediaBank.library.fields.altTextPlaceholder')}" maxlength="125" rows="4"></textarea>
                    </div>
                  </div>
                  <div class="hint-text"><span id="alt-counter">0</span>/125 ${t('courses.home.mediaBank.library.characters')}</div>
                </div>

                <div class="input">
                  <div class="title-wrapper">
                    <b class="title"><span>${t('courses.home.mediaBank.library.fields.description')} </span><span class="span">*</span></b>
                  </div>
                  <div class="content3">
                    <div class="text3">
                      <textarea class="input-text" id="field-description" placeholder="${t('courses.home.mediaBank.library.fields.descriptionPlaceholder')}" maxlength="200" rows="6"></textarea>
                    </div>
                  </div>
                  <div class="hint-text"><span id="desc-counter">0</span>/200 ${t('courses.home.mediaBank.library.characters')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="frame-group upload-actions upload-fixed-footer library-fixed-footer ${this.selectedItem ? '' : 'is-hidden'}" id="library-actions-footer">
          <button type="button" id="details-cancel-btn" class="cancelar-wrapper">
            <b class="cancelar">${t('courses.home.mediaBank.library.footer.cancel')}</b>
          </button>
          <div class="details-primary-actions">
            <button type="button" id="details-delete-btn" class="buttons2 details-delete-btn is-enabled">
              <b class="label-upload">${t('courses.home.mediaBank.library.footer.delete')}</b>
            </button>
            <button type="button" id="details-update-btn" class="buttons2 is-enabled">
              <b class="label-upload">${t('courses.home.mediaBank.library.footer.update')}</b>
            </button>
          </div>
        </div>
      </div>
    `
  }

  private updateUploadFileInfo(file: File) {
    const uploadName = this.container.querySelector('#upload-file-name') as HTMLElement | null
    if (uploadName) {
      uploadName.textContent = `${file.name} (${this.formatFileSize(file.size)})`
    }

    const uploadDropzoneName = this.container.querySelector('#upload-dropzone-file-name') as HTMLElement | null
    if (uploadDropzoneName) {
      uploadDropzoneName.textContent = `${file.name} (${this.formatFileSize(file.size)})`
    }

    const uploadDropzoneEmpty = this.container.querySelector('#upload-dropzone-empty') as HTMLElement | null
    const uploadDropzonePreview = this.container.querySelector('#upload-dropzone-preview') as HTMLElement | null
    if (uploadDropzoneEmpty) uploadDropzoneEmpty.style.display = 'none'
    if (uploadDropzonePreview) uploadDropzonePreview.style.display = 'flex'

    const uploadSummary = this.container.querySelector('#upload-file-summary') as HTMLElement | null
    if (uploadSummary) {
      uploadSummary.textContent = `${file.name} • ${this.formatFileSize(file.size)}`
    }

    const dropzoneImagePreview = this.container.querySelector('#upload-dropzone-image') as HTMLImageElement | null
    const dropzoneVideoPreview = this.container.querySelector('#upload-dropzone-video') as HTMLVideoElement | null

    if (this.uploadPreviewUrl) {
      URL.revokeObjectURL(this.uploadPreviewUrl)
      this.uploadPreviewUrl = null
    }

    this.uploadPreviewUrl = URL.createObjectURL(file)

    if (file.type.startsWith('image/')) {
      if (dropzoneImagePreview) {
        dropzoneImagePreview.src = this.uploadPreviewUrl
        dropzoneImagePreview.style.display = 'block'
      }

      if (dropzoneVideoPreview) {
        dropzoneVideoPreview.pause()
        dropzoneVideoPreview.removeAttribute('src')
        dropzoneVideoPreview.load()
        dropzoneVideoPreview.style.display = 'none'
      }
    } else {
      if (dropzoneImagePreview) {
        dropzoneImagePreview.removeAttribute('src')
        dropzoneImagePreview.style.display = 'none'
      }

      if (dropzoneVideoPreview) {
        dropzoneVideoPreview.src = this.uploadPreviewUrl
        dropzoneVideoPreview.style.display = 'block'
      }
    }

    this.updateUploadSubmitState()
  }

  private clearPendingUploadFile() {
    this.pendingUploadFile = null
    this.isSubmittingUpload = false

    const uploadName = this.container.querySelector('#upload-file-name') as HTMLElement | null
    if (uploadName) uploadName.textContent = t('courses.home.mediaBank.upload.noFileSelected')

    const uploadDropzoneName = this.container.querySelector('#upload-dropzone-file-name') as HTMLElement | null
    if (uploadDropzoneName) uploadDropzoneName.textContent = t('courses.home.mediaBank.upload.noFileSelected')

    const uploadSummary = this.container.querySelector('#upload-file-summary') as HTMLElement | null
    if (uploadSummary) uploadSummary.textContent = t('courses.home.mediaBank.upload.noFileSelected')

    const uploadDropzoneEmpty = this.container.querySelector('#upload-dropzone-empty') as HTMLElement | null
    const uploadDropzonePreview = this.container.querySelector('#upload-dropzone-preview') as HTMLElement | null
    if (uploadDropzoneEmpty) uploadDropzoneEmpty.style.display = 'flex'
    if (uploadDropzonePreview) uploadDropzonePreview.style.display = 'none'

    if (this.uploadPreviewUrl) {
      URL.revokeObjectURL(this.uploadPreviewUrl)
      this.uploadPreviewUrl = null
    }

    const dropzoneImagePreview = this.container.querySelector('#upload-dropzone-image') as HTMLImageElement | null
    if (dropzoneImagePreview) {
      dropzoneImagePreview.removeAttribute('src')
      dropzoneImagePreview.style.display = 'none'
    }

    const dropzoneVideoPreview = this.container.querySelector('#upload-dropzone-video') as HTMLVideoElement | null
    if (dropzoneVideoPreview) {
      dropzoneVideoPreview.pause()
      dropzoneVideoPreview.removeAttribute('src')
      dropzoneVideoPreview.load()
      dropzoneVideoPreview.style.display = 'none'
    }

    const uploadInput = this.container.querySelector('#upload-input') as HTMLInputElement | null
    if (uploadInput) uploadInput.value = ''

    this.updateUploadSubmitState()
  }

  private resetUploadForm() {
    this.pendingUploadFile = null
    this.isSubmittingUpload = false
    this.uploadDraft = {
      title: '',
      altText: '',
      description: '',
    }

    const uploadName = this.container.querySelector('#upload-file-name') as HTMLElement | null
    if (uploadName) uploadName.textContent = t('courses.home.mediaBank.upload.noFileSelected')

    const uploadDropzoneName = this.container.querySelector('#upload-dropzone-file-name') as HTMLElement | null
    if (uploadDropzoneName) uploadDropzoneName.textContent = t('courses.home.mediaBank.upload.noFileSelected')

    const uploadDropzoneEmpty = this.container.querySelector('#upload-dropzone-empty') as HTMLElement | null
    const uploadDropzonePreview = this.container.querySelector('#upload-dropzone-preview') as HTMLElement | null
    if (uploadDropzoneEmpty) uploadDropzoneEmpty.style.display = 'flex'
    if (uploadDropzonePreview) uploadDropzonePreview.style.display = 'none'

    const uploadSummary = this.container.querySelector('#upload-file-summary') as HTMLElement | null
    if (uploadSummary) uploadSummary.textContent = t('courses.home.mediaBank.upload.noFileSelected')

    if (this.uploadPreviewUrl) {
      URL.revokeObjectURL(this.uploadPreviewUrl)
      this.uploadPreviewUrl = null
    }

    const dropzoneImagePreview = this.container.querySelector('#upload-dropzone-image') as HTMLImageElement | null
    if (dropzoneImagePreview) {
      dropzoneImagePreview.removeAttribute('src')
      dropzoneImagePreview.style.display = 'none'
    }

    const dropzoneVideoPreview = this.container.querySelector('#upload-dropzone-video') as HTMLVideoElement | null
    if (dropzoneVideoPreview) {
      dropzoneVideoPreview.pause()
      dropzoneVideoPreview.removeAttribute('src')
      dropzoneVideoPreview.load()
      dropzoneVideoPreview.style.display = 'none'
    }

    const uploadTitleInput = this.container.querySelector('#upload-field-title') as HTMLInputElement | null
    const uploadAltInput = this.container.querySelector('#upload-field-alt-text') as HTMLTextAreaElement | null
    const uploadDescriptionInput = this.container.querySelector('#upload-field-description') as HTMLTextAreaElement | null
    if (uploadTitleInput) uploadTitleInput.value = ''
    if (uploadAltInput) uploadAltInput.value = ''
    if (uploadDescriptionInput) uploadDescriptionInput.value = ''

    const titleCounter = this.container.querySelector('#upload-title-counter') as HTMLElement | null
    const altCounter = this.container.querySelector('#upload-alt-counter') as HTMLElement | null
    const descriptionCounter = this.container.querySelector('#upload-desc-counter') as HTMLElement | null
    if (titleCounter) titleCounter.textContent = '0'
    if (altCounter) altCounter.textContent = '0'
    if (descriptionCounter) descriptionCounter.textContent = '0'

    this.updateUploadSubmitState()
  }

  private updateUploadSubmitState() {
    const submitButton = this.container.querySelector('#upload-submit-btn') as HTMLButtonElement | null
    if (!submitButton) return

    const isEnabled = this.shouldEnableUploadSubmit()
    submitButton.disabled = !isEnabled
    submitButton.classList.toggle('is-enabled', isEnabled)

    const label = submitButton.querySelector('.label-upload') as HTMLElement | null
    if (label) {
      label.textContent = this.isSubmittingUpload ? t('courses.home.mediaBank.upload.submitting') : t('courses.home.mediaBank.upload.addMedia')
    }
  }

  private shouldEnableUploadSubmit() {
    return Boolean(
      this.pendingUploadFile &&
        !this.isSubmittingUpload &&
        this.uploadDraft.title.trim() &&
        this.uploadDraft.altText.trim() &&
        this.uploadDraft.description.trim(),
    )
  }

  private mapMediaResponseToItem(media: MediaResponse): MediaItem {
    const id = media.id ?? media._id ?? media.gridFsId
    const createdAt = new Date(media.createdAt)
    const safeCreatedAt = Number.isNaN(createdAt.getTime()) ? new Date(0) : createdAt

    return {
      id,
      name: media.title || media.filename,
      url: media.kind === 'image' ? 'https://via.placeholder.com/300x200?text=Media' : 'https://via.placeholder.com/300x200?text=Video',
      type: media.contentType,
      size: media.size,
      createdAt: safeCreatedAt,
      kind: media.kind,
      status: media.status,
      title: media.title,
      altText: media.altText,
      description: media.description,
    }
  }

  private async hydrateMediaMetadata(items: MediaItem[]) {
    const itemsNeedingMetadata = items.filter((item) => !(item.title && item.altText && item.description))
    if (itemsNeedingMetadata.length === 0) return

    await Promise.all(
      itemsNeedingMetadata.map(async (item) => {
        try {
          const metadata = await mediaApi.getMediaById(item.id, item.kind)
          const metadataDate = new Date(metadata.createdAt)

          item.name = metadata.title || metadata.filename || item.name
          item.title = metadata.title ?? item.title
          item.altText = metadata.altText ?? item.altText
          item.description = metadata.description ?? item.description
          item.type = metadata.contentType || item.type
          item.size = metadata.size || item.size
          item.status = metadata.status || item.status

          if (!Number.isNaN(metadataDate.getTime())) {
            item.createdAt = metadataDate
          }
        } catch {
          // keep list payload when metadata lookup is unavailable for an item
        }
      }),
    )
  }

  private async loadMediaPreviews(items: MediaItem[]) {
    await Promise.all(
      items.map(async (item) => {
        try {
          const blob = await mediaApi.streamMedia(item.id)
          const objectUrl = URL.createObjectURL(blob)
          this.mediaPreviewUrls.set(item.id, objectUrl)
          item.url = objectUrl
        } catch {
          item.url = item.kind === 'video' ? 'https://via.placeholder.com/300x200?text=Video' : 'https://via.placeholder.com/300x200?text=Media'
        }
      }),
    )
  }

  private clearMediaPreviewUrls() {
    this.mediaPreviewUrls.forEach((objectUrl) => {
      URL.revokeObjectURL(objectUrl)
    })
    this.mediaPreviewUrls.clear()
  }

  private validateUploadFile(file: File): string | null {
    if (IMAGE_TYPES.includes(file.type)) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) return t('courses.home.mediaBank.upload.errors.imageTooLarge')
      return null
    }

    if (VIDEO_TYPES.includes(file.type)) {
      if (file.size > MAX_VIDEO_SIZE_BYTES) return t('courses.home.mediaBank.upload.errors.videoTooLarge')
      return null
    }

    return t('courses.home.mediaBank.upload.errors.invalidType')
  }

  private getUploadErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
      if (error.status === 401) return t('courses.home.mediaBank.upload.errors.unauthorized')

      if (error.status === 403) {
        if (error.code === 'MEDIA_INACTIVE') return t('courses.home.mediaBank.upload.errors.mediaInactive')
        return t('courses.home.mediaBank.upload.errors.forbidden')
      }

      if (error.status === 422) {
        if (error.code === 'INVALID_IMAGE_TYPE' || error.code === 'INVALID_VIDEO_TYPE') {
          return t('courses.home.mediaBank.upload.errors.invalidType')
        }

        if (error.code === 'VALIDATION_ERROR') {
          return t('courses.home.mediaBank.upload.errors.requiredFields')
        }

        return t('courses.home.mediaBank.upload.errors.validation')
      }
    }

    return t('courses.home.mediaBank.upload.errors.generic')
  }

  private async handleUploadSubmit() {
    if (this.isSubmittingUpload || !this.pendingUploadFile) return

    if (!this.uploadDraft.title.trim() || !this.uploadDraft.altText.trim() || !this.uploadDraft.description.trim()) {
      toast(t('courses.home.mediaBank.upload.errors.requiredFields'), 'error')
      return
    }

    const fileValidationError = this.validateUploadFile(this.pendingUploadFile)
    if (fileValidationError) {
      toast(fileValidationError, 'error')
      return
    }

    this.isSubmittingUpload = true
    this.updateUploadSubmitState()
    toast(t('courses.home.mediaBank.upload.loading'), 'loading')

    try {
      const uploadedKind = this.pendingUploadFile.type.startsWith('video/') ? 'video' : 'image'
      const uploadedBinary = await mediaApi.uploadMedia({ file: this.pendingUploadFile })
      const uploadedId = uploadedBinary.id ?? uploadedBinary._id ?? uploadedBinary.gridFsId

      if (!uploadedId) {
        throw new Error('Missing media id from upload response')
      }

      let persistedMetadata = uploadedBinary

      try {
        persistedMetadata = await mediaApi.createMediaMetadata(uploadedId, uploadedKind, {
          title: this.uploadDraft.title.trim(),
          altText: this.uploadDraft.altText.trim(),
          description: this.uploadDraft.description.trim(),
        })
      } catch (metadataError) {
        try {
          await mediaApi.deleteMedia(uploadedId, uploadedKind)
        } catch {
          // ignore cleanup failure and return original metadata error
        }

        throw metadataError
      }

      const uploadedItem = this.mapMediaResponseToItem(persistedMetadata)
      await this.loadMediaPreviews([uploadedItem])
      this.mediaItems = [uploadedItem, ...this.mediaItems]
      this.resetUploadForm()
      this.setMediaMode('library')
      this.renderMediaBank(this.container.querySelector('#media-content') as HTMLElement)
      this.renderGallery()
      toast(t('courses.home.mediaBank.upload.success'), 'success')
    } catch (error) {
      toast(this.getUploadErrorMessage(error), 'error')
    } finally {
      this.isSubmittingUpload = false
      this.updateUploadSubmitState()
    }
  }

  private getDisplayedMediaItems() {
    const normalizedQuery = this.normalizeSearchText(this.librarySearchQuery)

    const filteredItems = this.mediaItems.filter((item) => {
      if (!normalizedQuery) return true

      const searchableText = [item.title, item.name, item.altText, item.description]
        .filter(Boolean)
        .join(' ')
      const normalizedText = this.normalizeSearchText(searchableText)

      return normalizedText.includes(normalizedQuery)
    })

    const orderedItems = [...filteredItems]
    orderedItems.sort((first, second) => {
      const firstTimestamp = Number.isNaN(first.createdAt.getTime()) ? 0 : first.createdAt.getTime()
      const secondTimestamp = Number.isNaN(second.createdAt.getTime()) ? 0 : second.createdAt.getTime()

      if (this.librarySort === 'oldest') {
        if (firstTimestamp !== secondTimestamp) return firstTimestamp - secondTimestamp
        return (first.title || first.name).localeCompare(second.title || second.name)
      }

      if (firstTimestamp !== secondTimestamp) return secondTimestamp - firstTimestamp
      return (first.title || first.name).localeCompare(second.title || second.name)
    })

    return orderedItems
  }

  private normalizeSearchText(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  }

  private async deleteMediaItem(id: string) {
    const confirmDelete = await this.showDeleteMediaModal()
    if (!confirmDelete) return

    const itemToDelete = this.mediaItems.find((item) => item.id === id)
    if (!itemToDelete) return

    try {
      await mediaApi.deleteMedia(id, itemToDelete.kind)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          toast(t('courses.home.mediaBank.upload.errors.unauthorized'), 'error')
          return
        }

        if (error.status === 403) {
          toast(t('courses.home.mediaBank.upload.errors.forbidden'), 'error')
          return
        }

        if (error.status === 404) {
          toast(t('courses.home.mediaBank.library.footer.deleteError'), 'error')
          return
        }
      }

      toast(t('courses.home.mediaBank.library.footer.deleteError'), 'error')
      return
    }

    const mediaPreviewUrl = this.mediaPreviewUrls.get(id)
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl)
      this.mediaPreviewUrls.delete(id)
    }

    this.mediaItems = this.mediaItems.filter((item) => item.id !== id)
    this.clearSelectedMedia(false)
    this.renderMediaBank(this.container.querySelector('#media-content') as HTMLElement)
    this.renderGallery()
    toast(t('courses.home.mediaBank.library.footer.deleteSuccess'), 'success')
  }

  private showDeleteMediaModal() {
    return new Promise<boolean>((resolve) => {
      const existingModal = document.getElementById('media-delete-modal')
      if (existingModal) existingModal.remove()

      const overlay = document.createElement('div')
      overlay.id = 'media-delete-modal'
      overlay.className = 'media-delete-modal-overlay'
      overlay.innerHTML = `
        <div class="media-delete-modal" role="dialog" aria-modal="true" aria-labelledby="media-delete-modal-title">
          <h3 id="media-delete-modal-title" class="media-delete-modal-title">${t('courses.home.mediaBank.library.deleteModal.title')}</h3>
          <p class="media-delete-modal-message">${t('courses.home.mediaBank.library.deleteModal.message')}</p>
          <div class="media-delete-modal-actions">
            <button type="button" class="media-delete-modal-cancel" id="media-delete-cancel">${t('courses.home.mediaBank.library.deleteModal.cancel')}</button>
            <button type="button" class="media-delete-modal-confirm" id="media-delete-confirm">${t('courses.home.mediaBank.library.deleteModal.confirm')}</button>
          </div>
        </div>
      `

      const close = (confirmed: boolean) => {
        overlay.remove()
        document.removeEventListener('keydown', handleEscape)
        resolve(confirmed)
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          close(false)
        }
      }

      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          close(false)
        }
      })

      const cancelButton = overlay.querySelector('#media-delete-cancel') as HTMLButtonElement | null
      const confirmButton = overlay.querySelector('#media-delete-confirm') as HTMLButtonElement | null

      cancelButton?.addEventListener('click', () => close(false))
      confirmButton?.addEventListener('click', () => close(true))

      document.addEventListener('keydown', handleEscape)
      document.body.appendChild(overlay)
      cancelButton?.focus()
    })
  }

  private clearSelectedMedia(keepRender = true) {
    this.selectedItem = null

    const fileInfoEmpty = this.container.querySelector('#file-info-empty') as HTMLElement | null
    const fileInfoContent = this.container.querySelector('#file-info-content') as HTMLElement | null
    if (fileInfoEmpty) fileInfoEmpty.style.display = 'block'
    if (fileInfoContent) fileInfoContent.style.display = 'none'

    const mediaPlaceholder = this.container.querySelector('#media-placeholder') as HTMLElement | null
    mediaPlaceholder?.querySelectorAll('.media-thumbnail').forEach((thumbnail) => {
      ;(thumbnail as HTMLElement).classList.remove('is-selected')
    })

    this.updateLibraryFooterVisibility()

    if (keepRender) this.renderGallery()
  }

  private updateLibraryFooterVisibility() {
    const footer = this.container.querySelector('#library-actions-footer') as HTMLElement | null
    if (!footer) return

    footer.classList.toggle('is-hidden', !this.selectedItem)
  }

  private async updateSelectedMedia() {
    if (!this.selectedItem) return

    const titleInput = this.container.querySelector('#field-title') as HTMLInputElement | null
    const altInput = this.container.querySelector('#field-alt-text') as HTMLTextAreaElement | null
    const descriptionInput = this.container.querySelector('#field-description') as HTMLTextAreaElement | null

    const title = titleInput?.value.trim() ?? ''
    const altText = altInput?.value.trim() ?? ''
    const description = descriptionInput?.value.trim() ?? ''

    if (!title || !altText || !description) {
      toast(t('courses.home.mediaBank.upload.errors.requiredFields'), 'error')
      return
    }

    try {
      const updatedMedia = await mediaApi.updateMediaMetadata(this.selectedItem.id, this.selectedItem.kind, {
        title,
        altText,
        description,
      })

      this.selectedItem.name = updatedMedia.title || updatedMedia.filename || this.selectedItem.name
      this.selectedItem.title = updatedMedia.title
      this.selectedItem.altText = updatedMedia.altText
      this.selectedItem.description = updatedMedia.description
      this.selectedItem.type = updatedMedia.contentType
      this.selectedItem.size = updatedMedia.size
      this.selectedItem.status = updatedMedia.status

      const updatedCreatedAt = new Date(updatedMedia.createdAt)
      if (!Number.isNaN(updatedCreatedAt.getTime())) {
        this.selectedItem.createdAt = updatedCreatedAt
      }

      await this.selectMediaItem(this.selectedItem)

      toast(t('courses.home.mediaBank.library.footer.updateSuccess'), 'success')
      this.renderGallery()
    } catch {
      toast(t('courses.home.mediaBank.library.footer.updateError'), 'error')
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
  }

  private getSavedMediaMode(): 'upload' | 'library' {
    const savedMode = sessionStorage.getItem(MEDIA_BANK_MODE_STORAGE_KEY)
    return savedMode === 'upload' ? 'upload' : 'library'
  }

  private setMediaMode(mode: 'upload' | 'library') {
    this.mediaMode = mode
    sessionStorage.setItem(MEDIA_BANK_MODE_STORAGE_KEY, mode)
  }
}
