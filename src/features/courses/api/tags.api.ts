import { api } from '@/shared/api/http'
import type { CreateTagInput, Tag, UpdateTagInput } from '@/features/courses/model/course.types'

export const tagsApi = {
  getTags: () => api.get<Tag[]>('/tags', { auth: true }),
  getTag: (id: string) => api.get<Tag>(`/tags/${id}`, { auth: true }),
  createTag: (payload: CreateTagInput) => api.post<Tag>('/tags', payload, { auth: true }),
  updateTag: (id: string, payload: UpdateTagInput) => api.put<Tag>(`/tags/${id}`, payload, { auth: true }),
  deleteTag: (id: string) => api.del<void>(`/tags/${id}`, { auth: true }),
}
