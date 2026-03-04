import { api } from '@/shared/api/http'
import type { CreateSectionInput, Section, UpdateSectionInput } from '@/features/courses/model/course.types'

export const sectionsApi = {
  getSections: () => api.get<Section[]>('/sections', { auth: true }),
  getSection: (id: string) => api.get<Section>(`/sections/${id}`, { auth: true }),
  createSection: (payload: CreateSectionInput) => api.post<Section>('/sections', payload, { auth: true }),
  updateSection: (id: string, payload: UpdateSectionInput) => api.put<Section>(`/sections/${id}`, payload, { auth: true }),
  deleteSection: (id: string) => api.del<void>(`/sections/${id}`, { auth: true }),
}
