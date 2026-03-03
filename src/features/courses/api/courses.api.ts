import { api } from '@/shared/api/http'
import type { Course, CreateCourseInput } from '@/features/courses/model/course.types'

export const coursesApi = {
  getCourses: () => api.get<Course[]>('/courses'),
  getCourse: (id: string) => api.get<Course>(`/courses/${id}`),
  createCourse: (payload: CreateCourseInput) => api.post<void>('/courses', payload),
}