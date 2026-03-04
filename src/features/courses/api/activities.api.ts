import { api } from '@/shared/api/http'
import type { Activity, CreateActivityInput, UpdateActivityInput } from '@/features/courses/model/course.types'

export const activitiesApi = {
  getActivitiesBySection: (sectionId: string) => api.get<Activity[]>(`/activities/section/${sectionId}`, { auth: true }),
  getActivity: (id: string) => api.get<Activity>(`/activities/${id}`, { auth: true }),
  createActivity: (payload: CreateActivityInput) => api.post<Activity>('/activities', payload, { auth: true }),
  updateActivity: (id: string, payload: UpdateActivityInput) => api.put<Activity>(`/activities/${id}`, payload, { auth: true }),
  deleteActivity: (id: string) => api.del<void>(`/activities/${id}`, { auth: true }),
}
