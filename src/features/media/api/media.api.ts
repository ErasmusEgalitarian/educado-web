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

  uploadImage: ({ file }: UploadMediaPayload) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<UploadMediaResponse>('/media/images', formData, { auth: true })
  },

  uploadVideo: ({ file }: UploadMediaPayload) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<UploadMediaResponse>('/media/videos', formData, { auth: true })
  },

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
