import { api } from '@/shared/api/http'
import type {
  Course,
  CourseListQuery,
  CreateCourseInput,
  UpdateCourseInput,
} from '@/features/courses/model/course.types'

function toQueryString(query?: CourseListQuery): string {
  if (!query) return ''

  const params = new URLSearchParams()

  if (query.status) params.set('status', query.status)
  if (query.category) params.set('category', query.category)
  if (query.difficulty) params.set('difficulty', query.difficulty)
  if (query.q) params.set('q', query.q)

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

export const coursesApi = {
  getCourses: (query?: CourseListQuery) => api.get<Course[]>(`/courses${toQueryString(query)}`, { auth: true }),
  getMyCourses: (query?: CourseListQuery) => api.get<Course[]>(`/me/courses${toQueryString(query)}`, { auth: true }),
  getCourse: (id: string) => api.get<Course>(`/courses/${id}`, { auth: true }),
  createCourse: (payload: CreateCourseInput) => api.post<Course>('/courses', payload, { auth: true }),
  updateCourse: (id: string, payload: UpdateCourseInput) => api.put<Course>(`/courses/${id}`, payload, { auth: true }),
  activateCourse: (id: string) => api.post<Course>(`/courses/${id}/activate`, undefined, { auth: true }),
  deactivateCourse: (id: string) => api.post<Course>(`/courses/${id}/deactivate`, undefined, { auth: true }),
  deleteCourse: (id: string) => api.del<void>(`/courses/${id}`, { auth: true }),
}