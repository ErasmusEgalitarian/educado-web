import { api } from '@/shared/api/http'
import { getAccessToken } from '@/shared/api/auth-session'

export type MediaKind = 'image' | 'video'
export type MediaStatus = 'ACTIVE' | 'INACTIVE'

export interface MediaResponse {
  id?: string
  _id?: string
  ownerId: string
  kind: MediaKind
  title?: string
  altText?: string
  description?: string
  filename: string
  contentType: string
  size: number
  gridFsId: string
  status: MediaStatus
  createdAt: string
  updatedAt: string
  streamUrl?: string
}

export interface UploadMediaResponse extends MediaResponse {}

export interface UploadMediaPayload {
  file: File
}

export interface UpdateMediaPayload {
  title: string
  altText: string
  description: string
}

interface MediaListQuery {
  page?: number
  limit?: number
  kind?: MediaKind
  status?: MediaStatus
}

export interface PaginatedMediaResponse {
  items: MediaResponse[]
  page: number
  limit: number
  total: number
}

export interface InitChunkedResponse {
  id: string
  chunkSize: number
  totalParts: number
}

export interface UploadPartResponse {
  partNumber: number
  etag: string
}

export interface UploadPartProgress {
  uploadId: string
  partNumber: number
  etag: string
  chunkSize: number
  completedParts: number
  totalParts: number
  uploadedBytes: number
}

export interface UploadVideoChunkedOptions {
  signal?: AbortSignal
  onPartCompleted?: (progress: UploadPartProgress) => void
  abortOnError?: boolean
}

export interface UploadBinaryOptions {
  signal?: AbortSignal
}

export function initVideoUpload(file: File, options?: UploadBinaryOptions) {
  return api.post<InitChunkedResponse>(
    '/media/videos/init',
    {
      filename: file.name,
      contentType: file.type,
      size: file.size,
    },
    { auth: true, signal: options?.signal }
  )
}

export function uploadVideoPart(
  uploadId: string,
  partNumber: number,
  chunk: Blob,
  filename: string,
  options?: UploadBinaryOptions,
) {
  const formData = new FormData()
  formData.append('chunk', chunk, `${filename}.part${partNumber}`)

  return api.post<UploadPartResponse>(
    `/media/videos/${uploadId}/parts/${partNumber}`,
    formData,
    { auth: true, signal: options?.signal }
  )
}

export function completeVideoUpload(uploadId: string, parts: UploadPartResponse[], options?: UploadBinaryOptions) {
  return api.post<UploadMediaResponse>(
    `/media/videos/${uploadId}/complete`,
    { parts },
    { auth: true, signal: options?.signal }
  )
}

export function abortVideoUpload(uploadId: string) {
  return api.post<void>(`/media/videos/${uploadId}/abort`, {}, { auth: true })
}

export function uploadImageBinary(file: File, options?: UploadBinaryOptions): Promise<UploadMediaResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<UploadMediaResponse>('/media/images', formData, { auth: true, signal: options?.signal })
}

async function uploadVideoChunked(file: File, options?: UploadVideoChunkedOptions): Promise<UploadMediaResponse> {
  const init = await initVideoUpload(file, options)
  const parts: UploadPartResponse[] = []
  let uploadedBytes = 0

  try {
    for (let partNumber = 1; partNumber <= init.totalParts; partNumber++) {
      const start = (partNumber - 1) * init.chunkSize
      const end = Math.min(start + init.chunkSize, file.size)
      const chunk = file.slice(start, end)

      const result = await uploadVideoPart(init.id, partNumber, chunk, file.name, options)
      parts.push(result)
      uploadedBytes += chunk.size

      options?.onPartCompleted?.({
        uploadId: init.id,
        partNumber,
        etag: result.etag,
        chunkSize: chunk.size,
        completedParts: parts.length,
        totalParts: init.totalParts,
        uploadedBytes,
      })
    }

    return completeVideoUpload(init.id, parts, options)
  } catch (error) {
    if (options?.abortOnError !== false) {
      abortVideoUpload(init.id).catch(() => {
        /* ignore */
      })
    }
    throw error
  }
}

function toQueryString(query?: MediaListQuery): string {
  if (!query) return ''

  const params = new URLSearchParams()

  if (query.page) params.set('page', query.page.toString())
  if (query.limit) params.set('limit', query.limit.toString())
  if (query.kind) params.set('kind', query.kind)
  if (query.status) params.set('status', query.status)

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

export const mediaApi = {
  listMyMedia: (query?: MediaListQuery) => api.get<PaginatedMediaResponse>(`/me/media${toQueryString(query)}`, { auth: true }),

  listAdminMedia: (query?: MediaListQuery) => api.get<PaginatedMediaResponse>(`/admin/media${toQueryString(query)}`, { auth: true }),

  getImageById: (id: string) => api.get<MediaResponse>(`/media/images/${id}`, { auth: true }),

  getVideoById: (id: string) => api.get<MediaResponse>(`/media/videos/${id}`, { auth: true }),

  getMediaById: (id: string, kind: MediaKind) => {
    if (kind === 'video') return mediaApi.getVideoById(id)
    return mediaApi.getImageById(id)
  },

  initVideoUpload,

  uploadVideoPart,

  completeVideoUpload,

  abortVideoUpload,

  uploadImageBinary,

  uploadImage: ({ file }: UploadMediaPayload) => uploadImageBinary(file),

  uploadVideo: ({ file }: UploadMediaPayload, options?: UploadVideoChunkedOptions) => uploadVideoChunked(file, options),

  uploadMedia: ({ file }: UploadMediaPayload) => {
    const kind = file.type.startsWith('video/') ? 'video' : 'image'

    if (kind === 'video') {
      return mediaApi.uploadVideo({ file })
    }

    return mediaApi.uploadImage({ file })
  },

  createImageMetadata: (id: string, payload: UpdateMediaPayload) =>
    api.post<MediaResponse>(`/media/images/${id}/metadata`, payload, { auth: true }),

  createVideoMetadata: (id: string, payload: UpdateMediaPayload) =>
    api.post<MediaResponse>(`/media/videos/${id}/metadata`, payload, { auth: true }),

  createMediaMetadata: (id: string, kind: MediaKind, payload: UpdateMediaPayload) => {
    if (kind === 'video') return mediaApi.createVideoMetadata(id, payload)
    return mediaApi.createImageMetadata(id, payload)
  },

  updateImageMetadata: (id: string, payload: UpdateMediaPayload) =>
    api.put<MediaResponse>(`/media/images/${id}/metadata`, payload, { auth: true }),

  updateVideoMetadata: (id: string, payload: UpdateMediaPayload) =>
    api.put<MediaResponse>(`/media/videos/${id}/metadata`, payload, { auth: true }),

  updateMediaMetadata: (id: string, kind: MediaKind, payload: UpdateMediaPayload) => {
    if (kind === 'video') return mediaApi.updateVideoMetadata(id, payload)
    return mediaApi.updateImageMetadata(id, payload)
  },

  streamMedia: async (id: string) => {
    const token = getAccessToken()

    const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:5001'}/media/${id}/stream`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })

    if (!response.ok) {
      throw new Error(`Could not stream media. Status: ${response.status}`)
    }

    return response.blob()
  },

  deleteImage: (id: string) => api.del<void>(`/media/images/${id}`, { auth: true }),

  deleteVideo: (id: string) => api.del<void>(`/media/videos/${id}`, { auth: true }),

  deleteMedia: (id: string, kind: MediaKind) => {
    if (kind === 'video') return mediaApi.deleteVideo(id)
    return mediaApi.deleteImage(id)
  },
}
