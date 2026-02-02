import axios from 'axios'
import { Course, CreateCourseInput } from './types'

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL

export const api = {
  async getCourses(): Promise<Course[]> {
    const response = await axios.get(`${API_BASE_URL}/courses`)
    return response.data
  },

  async getCourse(id: string): Promise<Course> {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`)
    return response.data
  },

  async createCourse(course: CreateCourseInput): Promise<Course> {
    const response = await axios.post(`${API_BASE_URL}/courses`, course)
    return response.data
  },

  async updateCourse(
    id: string,
    course: Partial<CreateCourseInput>
  ): Promise<Course> {
    const response = await axios.put(
      `${API_BASE_URL}/courses/${id}`,
      course
    )
    return response.data
  },

  async deleteCourse(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/courses/${id}`)
  }
}
